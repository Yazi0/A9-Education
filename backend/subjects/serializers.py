from rest_framework import serializers
from .models import Subject
from users.serializers import GradeSerializer
from users.models import Grade

class SubjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.name')
    grades_detail = GradeSerializer(source='grades', many=True, read_only=True)
    grades = serializers.PrimaryKeyRelatedField(many=True, queryset=Grade.objects.all(), required=False)

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'grades', 'grades_detail', 'stream', 
            'teacher', 'teacher_name', 'description', 'class_fee'
        ]
