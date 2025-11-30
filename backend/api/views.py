from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.db.models import Sum, Q, Count
from django.utils import timezone
from datetime import timedelta, datetime
from decimal import Decimal
from django_filters.rest_framework import DjangoFilterBackend
import csv
from django.http import HttpResponse

from .models import Product, Transaction, Budget, Ad, Notification, SupportTicket
from .serializers import (
    UserSerializer, RegisterSerializer, ChangePasswordSerializer,
    ProductSerializer, TransactionSerializer, TransactionSummarySerializer,
    BudgetSerializer, AdSerializer, OverviewAnalyticsSerializer,
    BreakdownAnalyticsSerializer, KPISerializer, NotificationSerializer,
    SupportTicketSerializer
)
from .gemini_service import GeminiService
import tempfile
import os

User = get_user_model()


# ========== AUTHENTIFICATION ==========

class RegisterView(APIView):
    """Inscription d'un nouvel utilisateur"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'type': 'validation_error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Connexion via email et mot de passe"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'type': 'validation_error',
                'errors': {
                    'email': ['Email et mot de passe requis.']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate avec email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'type': 'validation_error',
                'errors': {
                    'email': ['Email ou mot de passe incorrect.']
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.check_password(password):
            return Response({
                'type': 'validation_error',
                'errors': {
                    'password': ['Email ou mot de passe incorrect.']
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'type': 'validation_error',
                'errors': {
                    'email': ['Ce compte est désactivé.']
                }
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class ProfileView(APIView):
    """Récupération et mise à jour du profil"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response({
            'type': 'validation_error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """Changement de mot de passe"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({
                    'type': 'validation_error',
                    'errors': {
                        'old_password': ['Mot de passe actuel incorrect.']
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Mot de passe modifié avec succès.'
            })
        
        return Response({
            'type': 'validation_error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ========== PRODUITS ==========

class ProductViewSet(viewsets.ModelViewSet):
    """CRUD pour les produits"""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'stock_status']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export CSV des produits"""
        products = self.get_queryset()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Nom', 'Description', 'Prix', 'Unité', 'Catégorie', 'Stock'])
        
        for product in products:
            writer.writerow([
                product.name,
                product.description,
                product.price,
                product.unit,
                product.get_category_display(),
                product.get_stock_status_display()
            ])
        
        return response


# ========== TRANSACTIONS ==========

class TransactionViewSet(viewsets.ModelViewSet):
    """CRUD pour les transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category']
    search_fields = ['name', 'category']
    ordering_fields = ['date', 'amount']
    ordering = ['-date']
    
    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        
        # Filtre par date range
        date_range = self.request.query_params.get('date_range')
        if date_range:
            now = timezone.now()
            if date_range == 'today':
                start_date = now.replace(hour=0, minute=0, second=0)
            elif date_range == 'week':
                start_date = now - timedelta(days=7)
            elif date_range == 'month':
                start_date = now - timedelta(days=30)
            elif date_range == 'year':
                start_date = now - timedelta(days=365)
            else:
                start_date = None
            
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Résumé pour le dashboard"""
        user = request.user
        now = timezone.now()
        yesterday = now - timedelta(days=1)
        day_before = now - timedelta(days=2)
        
        # Transactions des dernières 24h
        recent = Transaction.objects.filter(
            user=user,
            date__gte=yesterday
        )
        
        # Transactions des 24h précédentes
        previous = Transaction.objects.filter(
            user=user,
            date__gte=day_before,
            date__lt=yesterday
        )
        
        # Calculs
        income_24h = recent.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        expenses_24h = recent.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        prev_income = previous.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        prev_expenses = previous.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        # Balance totale
        total_income = Transaction.objects.filter(
            user=user, type='income'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        total_expenses = Transaction.objects.filter(
            user=user, type='expense'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        balance = total_income - total_expenses
        
        # Variations en %
        def calc_variation(current, previous):
            if previous > 0:
                return float(((current - previous) / previous) * 100)
            return 0.0
        
        data = {
            'balance': balance,
            'income_24h': income_24h,
            'expenses_24h': expenses_24h,
            'income_variation': calc_variation(income_24h, prev_income),
            'expenses_variation': calc_variation(expenses_24h, prev_expenses)
        }
        
        serializer = TransactionSummarySerializer(data)
        return Response(serializer.data)


# ========== ANALYTICS ==========

class AnalyticsView(APIView):
    """Analytics pour le dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get_overview(self, request):
        """Graphique barres: Revenus vs Dépenses par mois"""
        user = request.user
        now = timezone.now()
        six_months_ago = now - timedelta(days=180)
        
        transactions = Transaction.objects.filter(
            user=user,
            date__gte=six_months_ago
        )
        
        # Grouper par mois
        monthly_data = {}
        for t in transactions:
            month_key = t.date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {'income': Decimal('0.00'), 'expenses': Decimal('0.00')}
            
            if t.type == 'income':
                monthly_data[month_key]['income'] += t.amount
            else:
                monthly_data[month_key]['expenses'] += t.amount
        
        # Formater pour le serializer
        result = []
        for month, data in sorted(monthly_data.items()):
            result.append({
                'month': datetime.strptime(month, '%Y-%m').strftime('%b %Y'),
                'income': data['income'],
                'expenses': data['expenses']
            })
        
        serializer = OverviewAnalyticsSerializer(result, many=True)
        return Response(serializer.data)
    
    def get_breakdown(self, request):
        """Graphique camembert: Dépenses par catégorie"""
        user = request.user
        
        expenses = Transaction.objects.filter(
            user=user,
            type='expense'
        ).values('category').annotate(
            total=Sum('amount')
        ).order_by('-total')
        
        total_expenses = sum(item['total'] for item in expenses)
        
        result = []
        for item in expenses:
            percentage = float((item['total'] / total_expenses) * 100) if total_expenses > 0 else 0
            result.append({
                'category': item['category'],
                'amount': item['total'],
                'percentage': percentage
            })
        
        serializer = BreakdownAnalyticsSerializer(result, many=True)
        return Response(serializer.data)
    
    def get_kpi(self, request):
        """KPIs clés"""
        user = request.user
        now = timezone.now()
        month_ago = now - timedelta(days=30)
        
        # Panier moyen (revenus / nombre de transactions de revenus)
        income_transactions = Transaction.objects.filter(
            user=user,
            type='income',
            date__gte=month_ago
        )
        
        total_income = income_transactions.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        count_income = income_transactions.count()
        average_basket = total_income / count_income if count_income > 0 else Decimal('0.00')
        
        # MRR estimé (revenus du dernier mois)
        estimated_mrr = total_income
        
        # CAC (estimation simplifiée: dépenses marketing / nouveaux clients)
        # Pour simplifier, on utilise les dépenses de catégorie "Marketing"
        marketing_expenses = Transaction.objects.filter(
            user=user,
            type='expense',
            category__icontains='marketing',
            date__gte=month_ago
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        # Estimation simplifiée du CAC
        cac = marketing_expenses
        
        data = {
            'average_basket': average_basket,
            'estimated_mrr': estimated_mrr,
            'cac': cac
        }
        
        serializer = KPISerializer(data)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    view = AnalyticsView()
    return view.get_overview(request)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_breakdown(request):
    view = AnalyticsView()
    return view.get_breakdown(request)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_kpi(request):
    view = AnalyticsView()
    return view.get_kpi(request)


# ========== BUDGETS ==========

class BudgetViewSet(viewsets.ModelViewSet):
    """CRUD pour les budgets"""
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)


# ========== ANNONCES ==========

class AdViewSet(viewsets.ModelViewSet):
    """CRUD pour les annonces"""
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['product_name', 'owner_name', 'description', 'location']
    
    def get_queryset(self):
        # Les annonces sont publiques mais filtrées par vérification
        return Ad.objects.filter(is_verified=True)
    
    def get_permissions(self):
        # Lecture publique, écriture authentifiée
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]


# ========== NOTIFICATIONS ==========

class NotificationViewSet(viewsets.ModelViewSet):
    """CRUD pour les notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['patch'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ========== SUPPORT ==========

class SupportTicketViewSet(viewsets.ModelViewSet):
    """CRUD pour les tickets support"""
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SupportTicket.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ========== VOICE AI ==========

class VoiceCommandView(APIView):
    """Traitement des commandes vocales via Gemini"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if 'audio' not in request.FILES:
            return Response({'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
        audio_file = request.FILES['audio']
        
        try:
            audio_bytes = audio_file.read()
            mime_type = audio_file.content_type or 'audio/mp3'
            
            service = GeminiService()
            result = service.process_voice_command(audio_bytes, mime_type)
            
            if result.get('intent') == 'create_transaction':
                data = result.get('data', {})
                
                # Prepare data for serializer
                transaction_data = {
                    'name': data.get('name', 'Transaction Vocale'),
                    'amount': data.get('amount'),
                    'type': data.get('type'),
                    'category': data.get('category', 'Divers'),
                    'currency': data.get('currency', 'FCFA'),
                    'date': data.get('date') or timezone.now().date()
                }
                
                # Use serializer to validate and save
                # We need to pass context={'request': request} so that create() method can access user
                serializer = TransactionSerializer(data=transaction_data, context={'request': request})
                
                if serializer.is_valid():
                    serializer.save()
                    return Response({
                        'status': 'success',
                        'transcription': result.get('transcription'),
                        'transaction': serializer.data
                    })
                else:
                     return Response({
                        'status': 'error',
                        'transcription': result.get('transcription'),
                        'message': 'Validation failed',
                        'errors': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'status': 'processed',
                'transcription': result.get('transcription'),
                'intent': result.get('intent'),
                'data': result.get('data'),
                'error': result.get('error')
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)