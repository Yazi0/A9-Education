from django.urls import path
from .views import (
    ClassListView, ClassCreateView, ClassDeleteView,
    VideoListView, VideoCreateView, VideoDeleteView,
    StudyMaterialListView, StudyMaterialCreateView, StudyMaterialDeleteView
)

urlpatterns = [
    path('subjects/<int:subject_id>/classes/', ClassListView.as_view()),
    path('classes/create/', ClassCreateView.as_view()),
    path('classes/<int:pk>/delete/', ClassDeleteView.as_view()),
    
    path('classes/<int:class_id>/videos/', VideoListView.as_view()),
    path('videos/create/', VideoCreateView.as_view()),
    path('videos/<int:pk>/delete/', VideoDeleteView.as_view()),
    
    path('subjects/<int:subject_id>/materials/', StudyMaterialListView.as_view()),
    path('materials/create/', StudyMaterialCreateView.as_view()),
    path('materials/<int:pk>/delete/', StudyMaterialDeleteView.as_view()),
]
