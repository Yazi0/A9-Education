from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/users/register/'

    def test_registration_student(self):
        data = {
            "username": "teststudent",
            "password": "testpassword123",
            "email": "student@example.com",
            "role": "student",
            "name": "Test Student",
            "phone": "0771234567",
            "address": "123 Main St, Galle",
            "district": "Galle",
            "current_grade": "10"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(username="teststudent")
        self.assertEqual(user.role, "student")
        self.assertEqual(user.name, "Test Student")
        self.assertTrue(user.student_id.startswith("STU/GAL/10/S"))

    def test_registration_teacher(self):
        data = {
            "username": "testteacher",
            "password": "testpassword123",
            "email": "teacher@example.com",
            "role": "teacher",
            "name": "Test Teacher",
            "phone": "0777654321",
            "address": "456 High St, Colombo",
            "district": "Colombo"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(username="testteacher")
        self.assertEqual(user.role, "teacher")
        self.assertIsNone(user.student_id) # Should be None for teacher
