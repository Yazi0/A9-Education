from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Class, Video, StudyMaterial
from .serializers import ClassSerializer, VideoSerializer, StudyMaterialSerializer

class ClassListView(ListAPIView):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subject_id = self.kwargs['subject_id']
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
        class_id = self.kwargs['class_id']
        return Video.objects.filter(class_obj_id=class_id)

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
        return StudyMaterial.objects.filter(subject_id=subject_id)

class StudyMaterialCreateView(CreateAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]

class StudyMaterialDeleteView(DestroyAPIView):
    queryset = StudyMaterial.objects.all()
    permission_classes = [IsAuthenticated]
