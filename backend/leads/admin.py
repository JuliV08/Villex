"""
Django Admin configuration for leads app.
"""

from django.contrib import admin
from .models import Lead, LeadEvent


class LeadEventInline(admin.TabularInline):
    model = LeadEvent
    extra = 0
    readonly_fields = ['id', 'event_type', 'raw_payload', 'created_at']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'contact', 
        'project_type', 
        'status', 
        'spam_score',
        'created_at'
    ]
    list_filter = ['status', 'project_type', 'timeframe', 'budget_range', 'created_at']
    search_fields = ['name', 'contact', 'message']
    readonly_fields = [
        'id', 
        'lead_token', 
        'spam_score', 
        'ip_hash', 
        'user_agent',
        'calendly_invitee_uri',
        'calendly_event_uri',
        'created_at', 
        'updated_at'
    ]
    
    fieldsets = (
        ('Contacto', {
            'fields': ('name', 'contact', 'project_type', 'message')
        }),
        ('Calificación', {
            'fields': ('timeframe', 'budget_range', 'reference_url', 'has_domain_hosting')
        }),
        ('Estado', {
            'fields': ('status', 'source')
        }),
        ('Calendly', {
            'fields': ('calendly_invitee_uri', 'calendly_event_uri', 'scheduled_start_time', 'canceled_at'),
            'classes': ('collapse',)
        }),
        ('Anti-spam', {
            'fields': ('spam_score', 'ip_hash', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('Sistema', {
            'fields': ('id', 'lead_token', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [LeadEventInline]
    
    def has_delete_permission(self, request, obj=None):
        # Prevent accidental deletion of leads
        return request.user.is_superuser


@admin.register(LeadEvent)
class LeadEventAdmin(admin.ModelAdmin):
    list_display = ['lead', 'event_type', 'created_at']
    list_filter = ['event_type', 'created_at']
    search_fields = ['lead__name', 'lead__contact', 'event_type']
    readonly_fields = ['id', 'lead', 'event_type', 'raw_payload', 'created_at']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
