from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Student, Admin, Hall, Payment
from .serializers import StudentSerializer, AdminSerializer, HallSerializer, PaymentSerializer, LoginSerializer, AdminLoginSerializer, StudentDashboardSerializer, AdminDashboardSerializer,BookingSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.db import transaction
from django.db.models import F
from .models import Allocation, Room
from django.utils import timezone
 
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
                # Manually create tokens for student
                refresh = RefreshToken()
                refresh['user_id'] = student.student_id
                refresh['matric_number'] = student.matric_number
                
                # CRITICAL: Add matric_number to access token too
                access = refresh.access_token
                access['matric_number'] = student.matric_number
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(access),
                    'student_name': student.full_name,
                    'level': student.level,
                    'matric_number': student.matric_number
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


#student dashboard
@api_view(['GET'])
@permission_classes([AllowAny])  # Allow access without authentication
def student_dashboard(request):
    matric_no = request.query_params.get("matriculation_number")

    if not matric_no:
        return Response({"error": "Matriculation number needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        student = Student.objects.get(matric_number=matric_no)
        profile_data = StudentDashboardSerializer(student).data
        
        response_data = {
            "profile": profile_data,
            "available_halls": []
        }
        
        # If they DON'T have a room AND their payment is VERIFIED, show them halls.
        if not student.room and student.payment_status == "Verified":
            halls = Hall.objects.filter(gender=student.gender, available_rooms__gt=0)
            response_data["available_halls"] = HallSerializer(halls, many=True).data
        
        # If they HAVE a room, show their room details
        elif student.room:
            response_data["room_details"] = {
                "hall_name": student.hall_selected.hall_name,
                "room_number": student.room.room_number,
            }
        
        return Response(response_data)

    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        


        
    
@api_view(['GET'])
@permission_classes([AllowAny])
def admin_dashboard_data(request):
    try:
        admin_email = request.query_params.get("email")
        admin = Admin.objects.get(email=admin_email)

        #using the adimn serializer
        profile_data = AdminDashboardSerializer(admin).data

        return Response(profile_data)

    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)


#room booking algorithm logic
@api_view(['POST'])
@permission_classes([AllowAny])
def book_room(request):
    # Check if the data sent (hall_id, matric) is valid format
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
       hall_id = serializer.validated_data['hall_id']
       matric = serializer.validated_data['matriculation_number']


       try:
           #using transaction atomic
           with transaction.atomic():
            # We lock the student row so they can't double-click 
                # or book from two devices at once.
            student = Student.objects.select_for_update().get(matric_number=matric)

            #validation
            if student.room:
                return Response({"error": "Student already has a room"}, status=status.HTTP_400_BAD_REQUEST)
            if student.payment_status != "Verified":
                return Response({"error": "Payment not verified"}, status=status.HTTP_400_BAD_REQUEST)

            #4. sequential algorithm
            room = Room.objects.select_for_update().filter(
                hall_id=hall_id,
                current_occupants__lt=F('capacity')
            ).order_by('room_number').first()
            
            if not room:
                return Response({"error": "The hall is fully booked"}, status=status.HTTP_400_BAD_REQUEST)
            
            #execute the booking
            room.current_occupants += 1
            room.save()
            
            #update the student record
            student.room = room
            student.hall_selected = room.hall
            student.save()

            #create the allocation record
            allocation = Allocation.objects.create(
                student=student,
                room=room,
                allocation_date=timezone.now(),
                status='active'
            )
            
            #sucess message
            return Response({"message": "Room booked successfully",
            "room number":room.room_number,
            "hall name":room.hall.hall_name}, status=status.HTTP_200_OK)
            

       except Student.DoesNotExist:
           return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
       #except Room.DoesNotExist:
          # return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
       except Exception as e:
           return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

           

    
