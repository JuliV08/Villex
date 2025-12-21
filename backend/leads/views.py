"""
Views for leads app.
API endpoint and thank-you page.
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
    build_calendly_url,
    build_whatsapp_url,
    build_thank_you_url,
)


@method_decorator(csrf_exempt, name='dispatch')
class LeadCreateView(View):
    """
    POST /api/leads/
    Create a new lead from the contact form.
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
        status = 'spam' if is_spam else 'new'
        
        # Convert has_domain_hosting to boolean or None
        if has_domain_hosting is not None:
            if isinstance(has_domain_hosting, str):
                has_domain_hosting = has_domain_hosting.lower() in ('true', 'yes', 'si', 'sí', '1')
            else:
                has_domain_hosting = bool(has_domain_hosting)
        
        # Create Lead (ALWAYS save, even if spam)
        lead = Lead.objects.create(
            name=name,
            contact=contact,
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
            }
        )
        
        # Build response URLs
        lead_token = str(lead.lead_token)
        thank_you_url = build_thank_you_url(lead_token)
        calendly_url = build_calendly_url(lead_token)
        whatsapp_url = build_whatsapp_url({
            'name': name,
            'project_type': project_type,
            'message': message,
        })
        
        return JsonResponse({
            'success': True,
            'lead_token': lead_token,
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
    calendly_url = build_calendly_url(str(lead.lead_token))
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
