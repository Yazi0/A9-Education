from rest_framework import serializers
from .models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.name')

    class Meta:
        model = Subject
        fields = ['id', 'name', 'teacher', 'teacher_name']
