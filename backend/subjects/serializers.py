from rest_framework import serializers
from .models import Subject
from users.serializers import GradeSerializer
from users.models import Grade

class SubjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.user_id') # Based on common users.User field if missing name
    price = serializers.ReadOnlyField(source='class_fee')
    grade = serializers.SerializerMethodField()
    grades_detail = GradeSerializer(source='grades', many=True, read_only=True)

    def get_grade(self, obj):
        first_grade = obj.grades.first()
        return first_grade.name if first_grade else "N/A"

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'grades', 'grade', 'grades_detail', 'stream', 
            'teacher', 'teacher_name', 'description', 'class_fee', 'price'
        ]
