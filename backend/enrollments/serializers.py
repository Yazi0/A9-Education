from rest_framework import serializers
from .models import Enrollment
from subjects.serializers import SubjectSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subject', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'subject', 'subject_details', 'status', 'enrolled_at']
