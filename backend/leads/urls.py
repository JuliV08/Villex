"""
URL configuration for leads app.
"""

from django.urls import path
from .views import (
    LeadCreateView, 
    EmailConfirmView, 
    ResendConfirmView,
    thank_you_view,
)

urlpatterns = [
    path('leads/', LeadCreateView.as_view(), name='lead_create'),
    path('leads/confirm', EmailConfirmView.as_view(), name='email_confirm'),
    path('leads/resend-confirm', ResendConfirmView.as_view(), name='resend_confirm'),
    path('gracias/<uuid:lead_token>/', thank_you_view, name='thank_you'),
]
