from django.db import models
from subjects.models import Subject

class Class(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    date = models.DateField()

    def __str__(self):
        return self.title


class Video(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    video_url = models.URLField()

    def __str__(self):
        return self.title


class StudyMaterial(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='materials/')

    def __str__(self):
        return self.title
