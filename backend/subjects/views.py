from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Subject
from .serializers import SubjectSerializer

class SubjectListView(ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student' and user.current_grade:
            return Subject.objects.filter(grade=user.current_grade)
        return Subject.objects.all()


class TeacherSubjectListView(ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(teacher=self.request.user)


class SubjectCreateView(CreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)
