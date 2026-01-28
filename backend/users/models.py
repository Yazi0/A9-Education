# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    # Common fields
    name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)

    # Student-specific fields
    student_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    current_grade = models.CharField(max_length=20, blank=True, null=True)
    
    # Teacher-specific fields
    subject = models.CharField(max_length=100, blank=True, null=True)
    grades = models.CharField(max_length=100, blank=True, null=True)
    educational_qualifications = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    class_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.role == 'student' and not self.student_id:
            import random
            # Format: STU/DIST/GRADE/S1234
            dist = self.district[:3].upper() if self.district else "GEN"
            grade = self.current_grade if self.current_grade else "G-XX"
            rand = random.randint(1000, 9999)
            self.student_id = f"STU/{dist}/{grade}/S{rand}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
