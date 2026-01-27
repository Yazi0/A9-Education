from django.db import models

from users.models import User

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
