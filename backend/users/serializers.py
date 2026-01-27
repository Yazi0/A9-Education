# backend/users/serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'name', 'phone', 
            'address', 'district', 'student_id', 'current_grade', 
            'subject', 'grades', 'educational_qualifications', 'about', 'class_fee'
        ]
        read_only_fields = ['student_id']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 'role', 'name', 
            'phone', 'address', 'district', 'current_grade',
            'student_id'
        ]
        read_only_fields = ['student_id']

    def create(self, validated_data):
        # For students, ensure student_id matches the username (which is the generated ID from frontend)
        if validated_data.get('role') == 'student':
            validated_data['student_id'] = validated_data.get('username')
            
        user = User.objects.create_user(**validated_data)
        return user
