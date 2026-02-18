# backend/users/serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'name', 'phone', 
            'address', 'district', 'student_id', 'current_grade', 
            'subject', 'grades', 'educational_qualifications', 'about', 'class_fee',
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
