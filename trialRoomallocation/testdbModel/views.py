from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, Admin, Hall, Payment
from .serializers import StudentSerializer, AdminSerializer, HallSerializer, PaymentSerializer, LoginSerializer, AdminLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

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
    serializers = PaymentSerializer(payment, many=True)
    return Response(serializers.data) 

@api_view(['POST'])
def student_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        matriculation_number = serializer.validated_data['matriculation_number']
        password = serializer.validated_data['password']
        try: 
            student = Student.objects.get(matric_number=matriculation_number)

            if student.password == password:
                refresh = RefreshToken.for_user(student)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'student_name': student.full_name,
                    'level': student.level
                }, status=status.HTTP_200_OK)   
            else:
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Student.DoesNotExist:
            return Response({'message': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            admin = Admin.objects.get(email=email)
            if admin.password == password:
                # Manually create tokens for admin
                refresh = RefreshToken()
                refresh['user_id'] = admin.admin_id
                refresh['email'] = admin.email
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'admin_name': admin.name,
                    'email': admin.email
                }, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Admin.DoesNotExist:
            return Response({'message': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)