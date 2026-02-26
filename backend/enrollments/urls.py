from django.urls import path
from .views import MyEnrollmentsView, EnrollView, TeacherStudentsView

urlpatterns = [
    path('my/', MyEnrollmentsView.as_view()),
    path('create/', EnrollView.as_view()),
    path('teacher-students/', TeacherStudentsView.as_view()),
]
