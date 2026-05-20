from django.urls import path
from .views import (
    MeView, TeacherDashboardView, UserRegistrationView, QRLoginView, TeacherListView, GradeListView,
    TeacherApplicationCreateView, TeacherApplicationListView, TeacherApplicationDetailView,
    TeacherApplicationInviteView, TeacherApplicationApproveView
)

urlpatterns = [
    path('me/', MeView.as_view()),
    path('register/', UserRegistrationView.as_view()),
    path('qr-login/', QRLoginView.as_view()),
    path('teacher-dashboard/', TeacherDashboardView.as_view()),
    path('teachers/', TeacherListView.as_view()),
    path('grades/', GradeListView.as_view()),
    
    # Teacher Application URLs
    path('applications/apply/', TeacherApplicationCreateView.as_view()),
    path('applications/', TeacherApplicationListView.as_view()),
    path('applications/<int:pk>/', TeacherApplicationDetailView.as_view()),
    path('applications/invite/', TeacherApplicationInviteView.as_view()),
    path('applications/<int:pk>/approve/', TeacherApplicationApproveView.as_view()),
]

