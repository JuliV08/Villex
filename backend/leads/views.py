"""
Views for leads app.
API endpoints for lead creation, email confirmation, and thank-you page.
"""

import json
from django.conf import settings
from django.http import JsonResponse, Http404
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Lead, LeadEvent
from .utils import (
    hash_ip,
    get_client_ip,
    check_rate_limit,
    calculate_spam_score,
    validate_contact,
    extract_email_from_contact,
    build_calendly_url,
    build_whatsapp_url,
    build_thank_you_url,
    send_confirmation_email,
    check_email_cooldown,
)


@method_decorator(csrf_exempt, name='dispatch')
class LeadCreateView(View):
    """
    POST /api/leads/
    Create a new lead from the contact form.
    Now implements email confirmation flow.
    """
    
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(
                {'error': 'Invalid JSON'},
                status=400
            )
        
        # Extract fields
        name = data.get('name', '').strip()
        contact = data.get('contact', '').strip()
        project_type = data.get('project_type', '').strip()
        message = data.get('message', '').strip()
        
        # New qualification fields
        timeframe = data.get('timeframe', '').strip()
        budget_range = data.get('budget_range', '').strip()
        reference_url = data.get('reference_url', '').strip()
        has_domain_hosting = data.get('has_domain_hosting')
        
        # Honeypots
        honeypot_1 = data.get('honeypot', '').strip()
        honeypot_2 = data.get('company', '').strip()
        honeypot_filled = bool(honeypot_1 or honeypot_2)
        
        # Validate required fields
        if not name:
            return JsonResponse(
                {'error': 'El nombre es requerido'},
                status=400
            )
        
        is_valid_contact, contact_error = validate_contact(contact)
        if not is_valid_contact:
            return JsonResponse(
                {'error': contact_error},
                status=400
            )
        
        # Extract email if contact is an email
        contact_email = extract_email_from_contact(contact)
        
        # Get IP and user agent
        client_ip = get_client_ip(request)
        ip_hash = hash_ip(client_ip)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]
        
        # Check rate limit
        is_rate_limited = check_rate_limit(ip_hash)
        
        # Calculate spam score
        spam_score = calculate_spam_score(data, honeypot_filled)
        
        # Add to spam score if rate limited
        if is_rate_limited:
            spam_score += 5
        
        # Determine status
        is_spam = spam_score >= settings.SPAM_SCORE_THRESHOLD
        
        # Convert has_domain_hosting to boolean or None
        if has_domain_hosting is not None:
            if isinstance(has_domain_hosting, str):
                has_domain_hosting = has_domain_hosting.lower() in ('true', 'yes', 'si', 'sí', '1')
            else:
                has_domain_hosting = bool(has_domain_hosting)
        
        # Determine initial status
        if is_spam:
            status = 'spam'
        elif contact_email:
            status = 'pending_email_confirm'
        else:
            # Phone contact - can't send email confirmation
            status = 'new'
        
        # Create Lead (ALWAYS save, even if spam)
        lead = Lead.objects.create(
            name=name,
            contact=contact,
            contact_email=contact_email,
            project_type=project_type,
            message=message,
            timeframe=timeframe,
            budget_range=budget_range,
            reference_url=reference_url,
            has_domain_hosting=has_domain_hosting,
            source='form',
            status=status,
            spam_score=spam_score,
            ip_hash=ip_hash,
            user_agent=user_agent,
        )
        
        # Create LeadEvent
        LeadEvent.objects.create(
            lead=lead,
            event_type='lead_created',
            raw_payload={
                'source': 'api',
                'spam_score': spam_score,
                'is_spam': is_spam,
                'rate_limited': is_rate_limited,
                'has_email': bool(contact_email),
            }
        )
        
        # Build response
        lead_token = str(lead.lead_token)
        
        # Prepare WhatsApp URL (needed for both flows)
        whatsapp_url = build_whatsapp_url({
            'name': name,
            'project_type': project_type,
            'message': message,
        })
        
        # If email contact and not spam, send confirmation email
        if contact_email and not is_spam:
            email_sent = send_confirmation_email(lead)
            
            LeadEvent.objects.create(
                lead=lead,
                event_type='confirmation_email_sent' if email_sent else 'confirmation_email_failed',
                raw_payload={'email': contact_email}
            )
            
            return JsonResponse({
                'success': True,
                'lead_token': lead_token,
                'requires_email_confirmation': True,
                'email_sent': email_sent,
                'message': 'Revisá tu email para confirmar y agendar tu llamada.',
                'whatsapp_url': whatsapp_url,
            }, status=201)
        
        # Phone contact or spam - return URLs directly (old behavior)
        thank_you_url = build_thank_you_url(lead_token)
        calendly_url = build_calendly_url(lead_token, contact_email, name)
        # whatsapp_url already calculated above
        
        return JsonResponse({
            'success': True,
            'lead_token': lead_token,
            'requires_email_confirmation': False,
            'thank_you_url': thank_you_url,
            'calendly_url': calendly_url,
            'whatsapp_url': whatsapp_url,
        }, status=201)
    
    def options(self, request):
        """Handle preflight CORS requests."""
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response


@method_decorator(csrf_exempt, name='dispatch')
class EmailConfirmView(View):
    """
    GET /api/leads/confirm?token=...
    Confirm email and return Calendly URL.
    """
    
    def get(self, request):
        token = request.GET.get('token', '').strip()
        
        if not token:
            return JsonResponse({
                'success': False,
                'error': 'Token requerido',
            }, status=400)
        
        try:
            lead = Lead.objects.get(email_confirm_token=token)
        except Lead.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Token inválido o expirado',
            }, status=404)
        
        # Check if already confirmed
        if lead.status == 'email_confirmed':
            calendly_url = build_calendly_url(
                str(lead.lead_token), 
                lead.contact_email, 
                lead.name
            )
            return JsonResponse({
                'success': True,
                'already_confirmed': True,
                'lead_token': str(lead.lead_token),
                'calendly_url': calendly_url,
                'name': lead.name,
                'email': lead.contact_email,
            })
        
        # Check if token is valid (not expired)
        if not lead.is_token_valid():
            return JsonResponse({
                'success': False,
                'error': 'El link ha expirado. Solicitá uno nuevo.',
                'can_resend': True,
                'email': lead.contact_email,
            }, status=410)
        
        # Confirm email
        lead.confirm_email()
        
        # Log event
        LeadEvent.objects.create(
            lead=lead,
            event_type='email_confirmed',
            raw_payload={'token': token[:8] + '...'}
        )
        
        # Build Calendly URL with prefill
        calendly_url = build_calendly_url(
            str(lead.lead_token), 
            lead.contact_email, 
            lead.name
        )
        
        return JsonResponse({
            'success': True,
            'lead_token': str(lead.lead_token),
            'calendly_url': calendly_url,
            'name': lead.name,
            'email': lead.contact_email,
        })
    
    def options(self, request):
        """Handle preflight CORS requests."""
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response


@method_decorator(csrf_exempt, name='dispatch')
class ResendConfirmView(View):
    """
    POST /api/leads/resend-confirm
    Resend confirmation email.
    """
    
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        email = data.get('email', '').strip().lower()
        
        if not email:
            return JsonResponse({
                'success': False,
                'error': 'Email requerido',
            }, status=400)
        
        # Check cooldown
        if check_email_cooldown(email):
            return JsonResponse({
                'success': False,
                'error': 'Esperá un momento antes de reenviar.',
            }, status=429)
        
        try:
            lead = Lead.objects.filter(
                contact_email=email,
                status='pending_email_confirm'
            ).latest('created_at')
        except Lead.DoesNotExist:
            # Don't reveal if email exists or not
            return JsonResponse({
                'success': True,
                'message': 'Si el email existe, recibirás un nuevo link.',
            })
        
        # Generate new token and send
        lead.generate_confirm_token()
        email_sent = send_confirmation_email(lead)
        
        LeadEvent.objects.create(
            lead=lead,
            event_type='confirmation_email_resent' if email_sent else 'confirmation_email_resend_failed',
            raw_payload={'email': email}
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Si el email existe, recibirás un nuevo link.',
        })
    
    def options(self, request):
        """Handle preflight CORS requests."""
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response


def thank_you_view(request, lead_token):
    """
    GET /gracias/<lead_token>/
    Thank-you page with Calendly CTA.
    """
    try:
        lead = Lead.objects.get(lead_token=lead_token)
    except Lead.DoesNotExist:
        raise Http404("Lead no encontrado")
    
    # Build URLs
    calendly_url = build_calendly_url(str(lead.lead_token), lead.contact_email, lead.name)
    whatsapp_url = build_whatsapp_url({
        'name': lead.name,
        'project_type': lead.project_type,
        'message': lead.message,
    })
    
    context = {
        'lead': lead,
        'calendly_url': calendly_url,
        'whatsapp_url': whatsapp_url,
    }
    
    return render(request, 'leads/thank_you.html', context)
