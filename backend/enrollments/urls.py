from django.urls import path
from .views import MyEnrollmentsView, EnrollView

urlpatterns = [
    path('my/', MyEnrollmentsView.as_view()),
    path('create/', EnrollView.as_view()),
]
