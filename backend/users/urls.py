from django.urls import path
from .views import MeView, TeacherDashboardView, UserRegistrationView, QRLoginView, TeacherListView

urlpatterns = [
    path('me/', MeView.as_view()),
    path('register/', UserRegistrationView.as_view()),
    path('qr-login/', QRLoginView.as_view()),
    path('teacher-dashboard/', TeacherDashboardView.as_view()),
    path('teachers/', TeacherListView.as_view()),
]
