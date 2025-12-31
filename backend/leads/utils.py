"""
Utility functions for leads app.
Anti-spam detection, URL building, email confirmation, etc.
"""

import re
import hashlib
from urllib.parse import urlencode
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def hash_ip(ip_address: str) -> str:
    """
    Hash IP address for privacy - never store raw IPs.
    """
    secret = settings.IP_HASH_SECRET
    combined = f"{ip_address}:{secret}"
    return hashlib.sha256(combined.encode()).hexdigest()[:64]


def get_client_ip(request) -> str:
    """
    Get client IP from request, handling proxies.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '')
    return ip


def check_rate_limit(ip_hash: str) -> bool:
    """
    Check if IP has exceeded rate limit.
    Returns True if rate limited (should block), False if OK.
    """
    cache_key = f"lead_rate_{ip_hash}"
    count = cache.get(cache_key, 0)
    
    if count >= settings.SPAM_RATE_LIMIT_COUNT:
        return True  # Rate limited
    
    # Increment count
    cache.set(cache_key, count + 1, settings.SPAM_RATE_LIMIT_SECONDS)
    return False


def check_email_cooldown(email: str) -> bool:
    """
    Check if email is in cooldown period (to prevent spam resends).
    Returns True if in cooldown (should block), False if OK.
    """
    cache_key = f"email_cooldown_{hashlib.md5(email.lower().encode()).hexdigest()}"
    if cache.get(cache_key):
        return True
    cache.set(cache_key, True, 60)  # 60 second cooldown
    return False


# Common disposable email domains
DISPOSABLE_EMAIL_DOMAINS = {
    'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'maildrop.cc', 'getairmail.com', 'sharklasers.com',
    'guerrillamailblock.com', 'pokemail.net', 'spam4.me', 'grr.la',
    'dispostable.com', 'tempail.com', 'emailondeck.com', 'getnada.com',
}


def is_disposable_email(email: str) -> bool:
    """
    Check if email is from a known disposable email provider.
    """
    if not email or '@' not in email:
        return False
    domain = email.lower().split('@')[1]
    return domain in DISPOSABLE_EMAIL_DOMAINS


def extract_email_from_contact(contact: str) -> str:
    """
    Extract email from contact field if it's an email.
    Returns empty string if not an email.
    """
    contact = contact.strip()
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, contact):
        return contact.lower()
    return ''


def calculate_spam_score(data: dict, honeypot_filled: bool) -> int:
    """
    Calculate spam score based on various signals.
    Higher score = more likely spam.
    """
    score = 0
    
    # Honeypot filled - very strong spam signal
    if honeypot_filled:
        score += 10
    
    message = data.get('message', '')
    
    # Multiple URLs in message
    url_pattern = r'https?://[^\s]+'
    urls_found = len(re.findall(url_pattern, message))
    if urls_found > 3:
        score += urls_found
    
    # Common spam patterns
    spam_patterns = [
        r'casino',
        r'viagra',
        r'lottery',
        r'winner',
        r'cryptocurrency.*invest',
        r'make money fast',
        r'click here',
        r'\$\d{4,}.*day',
    ]
    
    message_lower = message.lower()
    for pattern in spam_patterns:
        if re.search(pattern, message_lower):
            score += 3
    
    # Very short name (likely bot)
    name = data.get('name', '')
    if len(name) < 2:
        score += 2
    
    # All caps message
    if message and message == message.upper() and len(message) > 20:
        score += 2
    
    # Disposable email
    contact = data.get('contact', '')
    if is_disposable_email(contact):
        score += 3
    
    return score


def validate_contact(contact: str) -> tuple[bool, str]:
    """
    Validate contact as email or phone.
    Returns (is_valid, error_message).
    """
    contact = contact.strip()
    
    if not contact:
        return False, "El contacto es requerido"
    
    # Check if it's an email
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, contact):
        return True, ""
    
    # Check if it's a phone (flexible pattern for international)
    # Remove common formatting characters
    phone_clean = re.sub(r'[\s\-\.\(\)]', '', contact)
    phone_pattern = r'^\+?\d{8,15}$'
    if re.match(phone_pattern, phone_clean):
        return True, ""
    
    return False, "Ingresá un email o teléfono válido"


def build_calendly_url(lead_token: str, email: str = '', name: str = '') -> str:
    """
    Build Calendly URL with UTM parameters, lead token, and prefill data.
    """
    base_url = settings.CALENDLY_BASE_URL
    
    params = {
        'utm_source': 'villex',
        'utm_medium': 'landing',
        'utm_campaign': 'agenda_30min',
        'utm_content': str(lead_token),
    }
    
    # Add prefill parameters if available
    if email:
        params['email'] = email
    if name:
        params['name'] = name
    
    return f"{base_url}?{urlencode(params)}"


def build_whatsapp_url(lead_data: dict) -> str:
    """
    Build WhatsApp URL with pre-filled message.
    """
    phone = settings.WHATSAPP_PHONE
    template = settings.WHATSAPP_TEMPLATE
    
    # Map project types to Spanish
    project_types = {
        'web': 'una web custom',
        'sistema': 'un sistema/backoffice',
        'otro': 'un proyecto',
    }
    project_type_text = project_types.get(
        lead_data.get('project_type', ''), 
        'un proyecto'
    )
    
    # Build message from template
    message = template.format(
        name=lead_data.get('name', ''),
        project_type=project_type_text,
        message=lead_data.get('message', '')[:200],  # Limit message length
    )
    
    return f"https://wa.me/{phone}?text={urlencode({'': message})[1:]}"


def build_thank_you_url(lead_token: str) -> str:
    """
    Build thank-you page URL.
    """
    return f"/api/gracias/{lead_token}/"


def build_confirm_url(token: str) -> str:
    """
    Build email confirmation URL for frontend.
    """
    frontend_url = settings.FRONTEND_URL.rstrip('/')
    return f"{frontend_url}/confirm?token={token}"


def send_confirmation_email(lead) -> bool:
    """
    Send email confirmation to lead.
    Returns True if sent successfully.
    """
    if not lead.contact_email:
        return False
    
    # Check cooldown
    if check_email_cooldown(lead.contact_email):
        return False
    
    # Generate token if not exists or expired
    if not lead.is_token_valid():
        lead.generate_confirm_token()
    
    confirm_url = build_confirm_url(lead.email_confirm_token)
    
    context = {
        'lead_name': lead.name,
        'confirm_url': confirm_url,
        'project_type': lead.project_type,
    }
    
    try:
        html_message = render_to_string('leads/confirm_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject='Confirmá tu email para agendar tu llamada | VILLEX',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[lead.contact_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        # Update email sent timestamp
        from django.utils import timezone
        lead.email_sent_at = timezone.now()
        lead.save(update_fields=['email_sent_at'])
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
