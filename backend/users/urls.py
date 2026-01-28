from django.urls import path
from .views import MeView, TeacherDashboardView, UserRegistrationView, QRLoginView

urlpatterns = [
    path('me/', MeView.as_view()),
    path('register/', UserRegistrationView.as_view()),
    path('qr-login/', QRLoginView.as_view()),
    path('teacher-dashboard/', TeacherDashboardView.as_view()),
]
