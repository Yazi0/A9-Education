from django.db import models
from users.models import User

class Subject(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(
        'users.User', 
        on_delete=models.CASCADE,
        related_name='subjects_taught'  # <--- add this
    )
