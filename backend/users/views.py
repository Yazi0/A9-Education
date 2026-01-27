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


# This is TeacherDashboardView
class TeacherDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'teacher':
            return Response({'error': 'Access denied!'}, status=403)
        serializer = UserSerializer(user)
        return Response(serializer.data)
