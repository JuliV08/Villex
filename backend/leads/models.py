"""
Lead and LeadEvent models for VILLEX sales funnel.
"""

import uuid
import secrets
from datetime import timedelta
from django.db import models
from django.utils import timezone


class Lead(models.Model):
    """
    Lead model - stores all prospect information and tracking data.
    """
    
    # Status choices
    STATUS_CHOICES = [
        ('pending_email_confirm', 'Pendiente Confirmación Email'),
        ('email_confirmed', 'Email Confirmado'),
        ('new', 'Nuevo'),
        ('scheduled', 'Agendado'),
        ('canceled', 'Cancelado'),
        ('contacted', 'Contactado'),
        ('won', 'Ganado'),
        ('lost', 'Perdido'),
        ('spam', 'Spam'),
    ]
    
    # Primary key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Unique token for public URLs (thank-you page, Calendly UTM)
    lead_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Basic contact info
    name = models.CharField(max_length=120, verbose_name='Nombre')
    contact = models.CharField(max_length=180, verbose_name='Contacto (email/teléfono)')
    contact_email = models.EmailField(blank=True, verbose_name='Email extraído')
    
    # Project details
    project_type = models.CharField(max_length=60, blank=True, verbose_name='Tipo de proyecto')
    message = models.TextField(blank=True, verbose_name='Mensaje')
    
    # Qualification fields (sales funnel)
    timeframe = models.CharField(max_length=40, blank=True, verbose_name='Plazo estimado')
    budget_range = models.CharField(max_length=40, blank=True, verbose_name='Presupuesto aproximado')
    reference_url = models.URLField(blank=True, verbose_name='URL de referencia')
    has_domain_hosting = models.BooleanField(null=True, blank=True, verbose_name='¿Tiene dominio/hosting?')
    
    # Tracking
    source = models.CharField(max_length=30, default='form', verbose_name='Fuente')
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending_email_confirm', verbose_name='Estado')
    
    # Anti-spam
    spam_score = models.IntegerField(default=0, verbose_name='Puntuación de spam')
    ip_hash = models.CharField(max_length=80, blank=True, verbose_name='Hash de IP')
    user_agent = models.CharField(max_length=255, blank=True, verbose_name='User Agent')
    
    # Email confirmation
    email_confirm_token = models.CharField(max_length=64, blank=True, unique=True, null=True, verbose_name='Token de confirmación')
    email_confirm_expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Expiración del token')
    email_confirmed_at = models.DateTimeField(null=True, blank=True, verbose_name='Email confirmado en')
    email_sent_at = models.DateTimeField(null=True, blank=True, verbose_name='Email enviado en')
    
    # Calendly integration (for future webhook)
    calendly_invitee_uri = models.TextField(blank=True, verbose_name='Calendly Invitee URI')
    calendly_event_uri = models.TextField(blank=True, verbose_name='Calendly Event URI')
    scheduled_start_time = models.DateTimeField(null=True, blank=True, verbose_name='Hora de reunión agendada')
    canceled_at = models.DateTimeField(null=True, blank=True, verbose_name='Cancelado en')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado')
    
    class Meta:
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.contact} ({self.status})"
    
    def generate_confirm_token(self):
        """Generate a new email confirmation token with expiry."""
        self.email_confirm_token = secrets.token_urlsafe(48)[:64]
        self.email_confirm_expires_at = timezone.now() + timedelta(hours=24)
        self.save(update_fields=['email_confirm_token', 'email_confirm_expires_at'])
        return self.email_confirm_token
    
    def is_token_valid(self):
        """Check if the confirmation token is still valid."""
        if not self.email_confirm_token or not self.email_confirm_expires_at:
            return False
        return timezone.now() < self.email_confirm_expires_at
    
    def confirm_email(self):
        """Mark email as confirmed."""
        self.status = 'email_confirmed'
        self.email_confirmed_at = timezone.now()
        self.save(update_fields=['status', 'email_confirmed_at'])


class LeadEvent(models.Model):
    """
    LeadEvent model - tracks all events related to a lead.
    Used for audit trail and future integrations (n8n, Calendly webhooks).
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='events',
        verbose_name='Lead'
    )
    
    event_type = models.CharField(max_length=60, verbose_name='Tipo de evento')
    raw_payload = models.JSONField(null=True, blank=True, verbose_name='Payload original')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado')
    
    class Meta:
        verbose_name = 'Evento de Lead'
        verbose_name_plural = 'Eventos de Leads'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.lead.name} - {self.event_type} ({self.created_at})"
