from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer

class PaymentCreateView(CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
