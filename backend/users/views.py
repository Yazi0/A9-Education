from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from .serializers import UserSerializer, UserCreateSerializer, GradeSerializer, TeacherApplicationSerializer
from .models import User, Grade, TeacherApplication
from rest_framework import generics


# This is MeView
class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = []


from rest_framework_simplejwt.tokens import RefreshToken

# This is QRLoginView
class QRLoginView(APIView):
    permission_classes = []

    def post(self, request):
        student_id = request.data.get('student_id')
        if not student_id:
            return Response({'error': 'Student ID is required'}, status=400)
        
        try:
            user = User.objects.get(student_id=student_id, role='student')
            if not user.is_active:
                return Response({'error': 'User account is disabled'}, status=403)
                
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response({'error': 'Invalid Student ID'}, status=404)


# This is TeacherDashboardView
class TeacherDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'teacher':
            return Response({'error': 'Access denied!'}, status=403)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class TeacherListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = User.objects.filter(role='teacher')
        grade_id = self.request.query_params.get('grade')
        if grade_id:
            queryset = queryset.filter(grades__id=grade_id)
        return queryset

class GradeListView(generics.ListAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = []

class TeacherApplicationCreateView(generics.CreateAPIView):
    queryset = TeacherApplication.objects.all()
    serializer_class = TeacherApplicationSerializer
    permission_classes = []

class TeacherApplicationListView(generics.ListAPIView):
    queryset = TeacherApplication.objects.all().order_by('-created_at')
    serializer_class = TeacherApplicationSerializer
    permission_classes = [permissions.IsAdminUser]

class TeacherApplicationDetailView(generics.RetrieveAPIView):
    queryset = TeacherApplication.objects.all()
    serializer_class = TeacherApplicationSerializer
    permission_classes = [permissions.IsAdminUser]

class TeacherApplicationInviteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=400)

        subject = "Invitation to Register as a Teacher on A9 Education"
        message = f"""Dear Teacher,

You have been invited by the A9 Administration to register as a teacher on our online platform.

Please click the link below to fill out the Teacher Application web form:
http://localhost:5173/register/teacher/apply

Thank you,
A9 Education Administration Team
"""
        try:
            send_mail(
                subject,
                message,
                'yasiru01nimsara@gmail.com',
                [email],
                fail_silently=False,
            )
            return Response({"success": "Invitation sent successfully"})
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=500)

class TeacherApplicationApproveView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            app = TeacherApplication.objects.get(pk=pk)
        except TeacherApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=404)

        if app.status == 'approved':
            return Response({"error": "Application already approved"}, status=400)

        # Generate credentials
        import re
        
        # 1. Clean short name (taking the main/last word)
        words = [w for w in app.name.split() if len(re.sub(r'[^a-zA-Z0-9]', '', w)) > 2]
        if not words:
            words = app.name.split()
        raw_short = words[-1] if words else "teacher"
        teachershortname = re.sub(r'[^a-zA-Z0-9]', '', raw_short).lower()

        # 2. Clean subject name
        subject_clean = re.sub(r'[^a-zA-Z0-9]', '', app.subject)
        if not subject_clean:
            subject_clean = "Maths"

        # 3. Auto-generate sequential number (001, 002, etc.)
        teacher_count = User.objects.filter(role='teacher').count()
        autogeneratenumber = f"{teacher_count + 1:03d}"

        # 4. Construct Username (Using '.' as a separator, since Django's default username validator rejects '/')
        teacher_username = f"{teachershortname}.{subject_clean}.{autogeneratenumber}"
        
        # 5. Construct Password: teachershortname_subject
        password = f"{teachershortname}_{subject_clean}"


        try:
            # Create user
            user = User.objects.create_user(
                username=teacher_username,
                email=app.email,
                password=password,
                role='teacher',
                name=app.name,
                phone=app.phone,
                subject=app.subject,
                educational_qualifications=app.educational_qualifications,
                about=app.about,
                is_staff=True
            )
            # Handle grades
            if app.grades:
                grade_names = [g.strip() for g in app.grades.split(',') if g.strip()]
                for g_name in grade_names:
                    grade, _ = Grade.objects.get_or_create(name=g_name)
                    user.grades.add(grade)
            
            # Update application status
            app.status = 'approved'
            app.save()

        except Exception as err:
            return Response({"error": f"Failed to create user account: {str(err)}"}, status=400)

        # Send Email with credentials
        subject = "A9 Academy - Your Teacher Credentials"
        message = f"""Dear {app.name},

Your application to register as a teacher on A9 Education Online Platform has been APPROVED!

You have agreed to pay a 20% commission fee from each student who joins your class to the A9 Education platform.

Here are your credentials to log in to the platform:
- Username: {teacher_username}
- Password: {password}

You can log in to your dashboard here:
http://localhost:5173/login

Welcome to the A9 Academy team!

Best regards,
A9 Education Administration
"""
        try:
            send_mail(
                subject,
                message,
                'yasiru01nimsara@gmail.com',
                [app.email],
                fail_silently=False,
            )
        except Exception as mail_err:
            print("Failed to send credentials email:", mail_err)

        return Response({
            "status": "approved",
            "username": teacher_username,
            "password": password
        })

