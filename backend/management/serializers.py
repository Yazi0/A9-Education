from rest_framework import serializers
from users.models import User
from subjects.models import Subject
from enrollments.models import Enrollment
from payments.models import Payment

class AdminUserSerializer(serializers.ModelSerializer):
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
