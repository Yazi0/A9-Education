# backend/users/serializers.py
from rest_framework import serializers
from users.models import User, Grade

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    current_grade_name = serializers.ReadOnlyField(source='current_grade.name')
    grades_detail = GradeSerializer(source='grades', many=True, read_only=True)
    grades = serializers.PrimaryKeyRelatedField(many=True, queryset=Grade.objects.all(), required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'name', 'phone', 
            'address', 'district', 'student_id', 'current_grade', 'current_grade_name', 
            'subject', 'grades', 'grades_detail', 'educational_qualifications', 'about', 'class_fee',
            'date_joined', 'profile_image'
        ]
        read_only_fields = ['student_id', 'date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 'role', 'name', 
            'phone', 'address', 'district', 'current_grade', 'profile_image', 'student_id'
        ]
        read_only_fields = ['student_id']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
