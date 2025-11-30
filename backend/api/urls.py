from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, ProfileView, ChangePasswordView,
    ProductViewSet, TransactionViewSet, BudgetViewSet, AdViewSet,
    NotificationViewSet, SupportTicketViewSet, VoiceCommandView,
    analytics_overview, analytics_breakdown, analytics_kpi
)

# Router pour les ViewSets
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'ads', AdViewSet, basename='ad')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'support', SupportTicketViewSet, basename='support')

urlpatterns = [
    # ===== AUTH =====
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', ProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # ===== ANALYTICS =====
    path('analytics/overview/', analytics_overview, name='analytics-overview'),
    path('analytics/breakdown/', analytics_breakdown, name='analytics-breakdown'),
    path('analytics/kpi/', analytics_kpi, name='analytics-kpi'),
    
    # ===== ROUTER (Products, Transactions, Budgets, Ads) =====
    path('', include(router.urls)),
    
    # ===== VOICE AI =====
    path('voice-command/', VoiceCommandView.as_view(), name='voice-command'),
]
