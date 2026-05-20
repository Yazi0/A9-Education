from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User
from subjects.models import Subject
from enrollments.models import Enrollment
from payments.models import Payment
from django.db.models import Sum, Count
from .serializers import (
    AdminUserSerializer, 
    AdminSubjectSerializer, 
    AdminEnrollmentSerializer, 
    AdminPaymentSerializer
)

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        stats = {
            'total_students': User.objects.filter(role='student').count(),
            'total_teachers': User.objects.filter(role='teacher').count(),
            'total_subjects': Subject.objects.count(),
            'total_revenue': Payment.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0,
            'recent_payments': Payment.objects.order_by('-id')[:5].values('id', 'student__username', 'amount', 'status'),
            'recent_enrollments': Enrollment.objects.order_by('-id')[:5].values('id', 'student__username', 'subject__name', 'status'),
        }
        return Response(stats)

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]

class SubjectManagementViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = AdminSubjectSerializer
    permission_classes = [permissions.IsAdminUser]

class EnrollmentManagementViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = AdminEnrollmentSerializer
    permission_classes = [permissions.IsAdminUser]

class PaymentManagementViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = AdminPaymentSerializer
    permission_classes = [permissions.IsAdminUser]
