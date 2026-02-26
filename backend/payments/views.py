from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer

class PaymentCreateView(CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically approve payment for simulation
        payment = serializer.save(student=self.request.user, status='approved')
        # Automatically create or update enrollment
        from enrollments.models import Enrollment
        # Create or update enrollment
        enrollment, created = Enrollment.objects.update_or_create(
            student=payment.student,
            subject=payment.subject,
            defaults={'status': 'enrolled'}
        )
        if not created:
            enrollment.status = 'enrolled'
            enrollment.save()
