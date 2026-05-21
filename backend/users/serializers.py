# backend/users/serializers.py
from rest_framework import serializers
from users.models import User, Grade, TeacherApplication

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'name']


class GradeRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        if not data:
            return None
        try:
            return super().to_internal_value(data)
        except Exception as e:
            if isinstance(data, (str, int)):
                name_str = str(data).strip()
                if name_str.isdigit():
                    raise e
                if name_str:
                    from users.models import normalize_grade_name
                    normalized_name = normalize_grade_name(name_str)
                    grade, created = Grade.objects.get_or_create(name=normalized_name)
                    return grade
            raise e

class UserSerializer(serializers.ModelSerializer):
    current_grade_name = serializers.ReadOnlyField(source='current_grade.name')
    grades_detail = GradeSerializer(source='grades', many=True, read_only=True)
    grades = serializers.PrimaryKeyRelatedField(many=True, queryset=Grade.objects.all(), required=False)
    current_grade = GradeRelatedField(queryset=Grade.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'name', 'phone', 
            'address', 'district', 'student_id', 'current_grade', 'current_grade_name', 
            'subject', 'grades', 'grades_detail', 'educational_qualifications', 'about', 'class_fee',
            'date_joined', 'profile_image', 'is_staff', 'is_superuser'
        ]
        read_only_fields = ['student_id', 'date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    current_grade = GradeRelatedField(queryset=Grade.objects.all(), required=False, allow_null=True)

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

class TeacherApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherApplication
        fields = '__all__'


