from rest_framework import serializers
from users.models import User, Grade
from users.serializers import GradeSerializer, GradeRelatedField
from subjects.models import Subject
from enrollments.models import Enrollment
from payments.models import Payment

class AdminUserSerializer(serializers.ModelSerializer):
    current_grade_name = serializers.ReadOnlyField(source='current_grade.name')
    grades_detail = GradeSerializer(source='grades', many=True, read_only=True)
    grades = serializers.PrimaryKeyRelatedField(many=True, queryset=Grade.objects.all(), required=False)
    current_grade = GradeRelatedField(queryset=Grade.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = '__all__'

class AdminSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class AdminEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class AdminPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
