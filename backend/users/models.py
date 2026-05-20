from django.db import models
from django.contrib.auth.models import AbstractUser

class Grade(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

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
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    # Student-specific fields
    student_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    current_grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, blank=True, null=True, related_name='students')
    
    # Teacher-specific fields
    subject = models.CharField(max_length=100, blank=True, null=True)
    grades = models.ManyToManyField(Grade, blank=True, related_name='teachers')
    educational_qualifications = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    class_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.role == 'student' and not self.student_id:
            import random
            # Format: STU/DIST/GRADE/S1234
            dist = self.district[:3].upper() if self.district else "GEN"
            grade = self.current_grade.name if self.current_grade else "G-XX"
            rand = random.randint(1000, 9999)
            self.student_id = f"STU/{dist}/{grade}/S{rand}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class Student(User):
    class Meta:
        proxy = True
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

    def save(self, *args, **kwargs):
        self.role = 'student'
        super().save(*args, **kwargs)

class Teacher(User):
    class Meta:
        proxy = True
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'

    def save(self, *args, **kwargs):
        self.role = 'teacher'
        super().save(*args, **kwargs)

class TeacherApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=100)
    grades = models.CharField(max_length=200, blank=True, null=True)
    educational_qualifications = models.TextField()
    about = models.TextField()
    id_number = models.CharField(max_length=50)
    id_photo = models.ImageField(upload_to='teacher_ids/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"

