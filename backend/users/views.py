from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

# This is MeView
from rest_framework import generics
from .serializers import UserSerializer, UserCreateSerializer
from .models import User

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
    queryset = User.objects.filter(role='teacher')
    serializer_class = UserSerializer
    permission_classes = []
