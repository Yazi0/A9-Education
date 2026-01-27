from django.urls import path
from .views import MeView, TeacherDashboardView, UserRegistrationView

urlpatterns = [
    path('me/', MeView.as_view()),
    path('register/', UserRegistrationView.as_view()),
    path('teacher-dashboard/', TeacherDashboardView.as_view()),
]
