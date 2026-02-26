from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Enrollment
from .serializers import EnrollmentSerializer

class MyEnrollmentsView(ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)


class EnrollView(CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class TeacherStudentsView(APIView):
    """
    Returns a list of students enrolled in the logged-in teacher's subjects,
    grouped by subject.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'teacher':
            return Response({'error': 'Only teachers can access this endpoint.'}, status=403)

        # Get all enrollments for subjects taught by this teacher
        enrollments = Enrollment.objects.filter(
            subject__teacher=user,
            status='enrolled'
        ).select_related('student', 'student__current_grade', 'subject')

        data = []
        seen_pairs = set()
        for enrollment in enrollments:
            student = enrollment.student
            subject = enrollment.subject
            pair = (student.id, subject.id)
            if pair in seen_pairs:
                continue
            seen_pairs.add(pair)

            data.append({
                'id': student.id,
                'name': student.name or student.username,
                'username': student.username,
                'student_id': student.student_id or 'N/A',
                'email': student.email or '',
                'phone': student.phone or 'Not set',
                'current_grade': student.current_grade.name if student.current_grade else 'Unknown',
                'district': student.district or 'Unknown',
                'date_joined': student.date_joined.strftime('%Y-%m-%d') if student.date_joined else '',
                'enrolled_subject': subject.name,
                'enrolled_subject_id': subject.id,
                'enrolled_at': enrollment.enrolled_at.strftime('%Y-%m-%d'),
            })

        return Response(data)
