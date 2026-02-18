from rest_framework import serializers
from .models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.name')

    class Meta:
        model = Subject
        fields = ['id', 'name', 'grade', 'stream', 'teacher', 'teacher_name', 'description', 'class_fee']
