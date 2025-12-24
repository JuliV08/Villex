"""
URL configuration for leads app.
"""

from django.urls import path
from .views import LeadCreateView, thank_you_view

urlpatterns = [
    path('leads/', LeadCreateView.as_view(), name='lead_create'),
    path('gracias/<uuid:lead_token>/', thank_you_view, name='thank_you'),
]
