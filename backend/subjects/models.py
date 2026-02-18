from django.db import models
from users.models import User

class Subject(models.Model):
    name = models.CharField(max_length=100)
    grade = models.CharField(max_length=20, default="Grade 13")
    stream = models.CharField(max_length=50, default="Combined Maths")
    teacher = models.ForeignKey(
        'users.User', 
        on_delete=models.CASCADE,
        related_name='subjects_taught'
    )
    description = models.TextField(blank=True, null=True)
    class_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.name} - {self.grade} ({self.teacher.name})"
