from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, Admin, Hall, Payment
from .serializers import StudentSerializer, AdminSerializer, HallSerializer, PaymentSerializer

@api_view(['GET'])
def get_student(request):
    student = Student.objects.all()
    serializers = StudentSerializer(student, many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_admin(request):
    admin = Admin.objects.all()
    serializers = AdminSerializer(admin, many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_hall(request):
    hall = Hall.objects.all()
    serializers = HallSerializer(hall,  many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_payment(request):
    payment = Payment.objects.all()
    serializers = PaymentSerializer(Payment, many=True)
    return Response(serializers.data)