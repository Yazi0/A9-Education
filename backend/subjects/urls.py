from django.urls import path
from .views import SubjectListView, SubjectCreateView, TeacherSubjectListView

urlpatterns = [
    path('', SubjectListView.as_view()),
    path('my/', TeacherSubjectListView.as_view()),
    path('create/', SubjectCreateView.as_view()),
]
