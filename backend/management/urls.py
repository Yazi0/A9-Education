from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminStatsView, 
    UserManagementViewSet, 
    SubjectManagementViewSet,
    EnrollmentManagementViewSet,
    PaymentManagementViewSet
)

router = DefaultRouter()
router.register(r'users', UserManagementViewSet)
router.register(r'subjects', SubjectManagementViewSet)
router.register(r'enrollments', EnrollmentManagementViewSet)
router.register(r'payments', PaymentManagementViewSet)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
