import stripe
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from subjects.models import Subject
from enrollments.models import Enrollment

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get('subject_id')
        try:
            subject = Subject.objects.get(id=subject_id)
            
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'lkr',
                            'product_data': {
                                'name': subject.name,
                            },
                            'unit_amount': int(subject.price * 100), # Amount in cents
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=settings.FRONTEND_URL + '/student/payment-success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.FRONTEND_URL + '/student/payment-failed',
                metadata={
                    'student_id': request.user.id,
                    'subject_id': subject.id
                }
            )

            return Response({'url': checkout_session.url})
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Fullfill the purchase
            student_id = session['metadata']['student_id']
            subject_id = session['metadata']['subject_id']
            
            # Create payment record
            Payment.objects.create(
                student_id=student_id,
                subject_id=subject_id,
                amount=session['amount_total'] / 100,
                status='approved',
                transaction_id=session['payment_intent']
            )
            
            # Enroll student
            Enrollment.objects.update_or_create(
                student_id=student_id,
                subject_id=subject_id,
                defaults={'status': 'enrolled'}
            )

        return Response(status=status.HTTP_200_OK)
