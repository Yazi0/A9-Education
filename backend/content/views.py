from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Class, Video, StudyMaterial
from .serializers import ClassSerializer, VideoSerializer, StudyMaterialSerializer
from payments.models import Payment
from datetime import datetime
from rest_framework.exceptions import PermissionDenied

class ClassListView(ListAPIView):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subject_id = self.kwargs['subject_id']
        user = self.request.user
        
        if user.role == 'student':
            now = datetime.now()
            has_paid = Payment.objects.filter(
                student=user,
                subject_id=subject_id,
                month=now.month,
                year=now.year,
                status__in=['approved', 'pending']
            ).exists()
            
            if not has_paid:
                raise PermissionDenied("You must pay for this month to access content.")
                
        return Class.objects.filter(subject_id=subject_id)

class ClassCreateView(CreateAPIView):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

class ClassDeleteView(DestroyAPIView):
    queryset = Class.objects.all()
    permission_classes = [IsAuthenticated]


class VideoListView(ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subject_id = self.kwargs['subject_id']
        user = self.request.user
        
        if user.role == 'student':
            now = datetime.now()
            has_paid = Payment.objects.filter(
                student=user,
                subject_id=subject_id,
                month=now.month,
                year=now.year,
                status__in=['approved', 'pending']
            ).exists()
            
            if not has_paid:
                raise PermissionDenied("You must pay for this month to access videos.")
                
        return Video.objects.filter(subject_id=subject_id)

class VideoCreateView(CreateAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

class VideoDeleteView(DestroyAPIView):
    queryset = Video.objects.all()
    permission_classes = [IsAuthenticated]


class StudyMaterialListView(ListAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subject_id = self.kwargs['subject_id']
        user = self.request.user
        
        if user.role == 'student':
            now = datetime.now()
            has_paid = Payment.objects.filter(
                student=user,
                subject_id=subject_id,
                month=now.month,
                year=now.year,
                status__in=['approved', 'pending']
            ).exists()
            
            if not has_paid:
                raise PermissionDenied("You must pay for this month to access study materials.")
                
        return StudyMaterial.objects.filter(subject_id=subject_id)

class StudyMaterialCreateView(CreateAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]

class StudyMaterialDeleteView(DestroyAPIView):
    queryset = StudyMaterial.objects.all()
    permission_classes = [IsAuthenticated]



