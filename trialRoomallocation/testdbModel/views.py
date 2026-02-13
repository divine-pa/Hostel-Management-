# ==================================================
# VIEWS.PY - This file handles requests from the website/app
# ==================================================
# Think of this as a waiter in a restaurant:
# - Students/admins make requests (like "show me my dashboard")
# - Views get the data from the database
# - Views send back the response (the data they asked for)

from django.shortcuts import render

# Import tools from Django to create API endpoints
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Student, Admin, Hall, Payment
from .serializers import StudentSerializer, AdminSerializer, HallSerializer, PaymentSerializer, LoginSerializer, AdminLoginSerializer, StudentDashboardSerializer, AdminDashboardSerializer,BookingSerializer,AllocationSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.db import transaction
from django.db.models import F
from .models import Allocation, Room
from django.utils import timezone
from .utils import send_allocation_email
from django.db.models import Sum, Q , F, Count
 
# ==================================================
# GET ALL STUDENTS - Shows a list of all students
# ==================================================
# This is like asking "Can I see everyone who is registered?"
@api_view(['GET'])  # This only responds to GET requests (asking for data)
def get_student(request):
    # Step 1: Get ALL students from the database
    student = Student.objects.all()
    
    # Step 2: Convert the student data to JSON format (so phones/websites can understand)
    serializers = StudentSerializer(student, many=True)
    
    # Step 3: Send back the list of students
    return Response(serializers.data)

# ==================================================
# GET ALL ADMINS - Shows a list of all admins
# ==================================================
# This is like asking "Can I see all the hostel managers?"
@api_view(['GET'])  # Only responds to GET requests
def get_admin(request):
    # Step 1: Get ALL admins from the database
    admin = Admin.objects.all()
    
    # Step 2: Convert admin data to JSON
    serializers = AdminSerializer(admin, many=True)
    
    # Step 3: Send back the list of admins
    return Response(serializers.data)

# ==================================================
# GET ALL HALLS - Shows a list of all hostel halls
# ==================================================
@api_view(['GET'])  # Only responds to GET requests
def get_hall(request):
    # Step 1: Get ALL halls from the database
    hall = Hall.objects.all()
    
    # Step 2: Convert hall data to JSON
    serializers = HallSerializer(hall,  many=True)
    
    # Step 3: Send back the list of halls
    return Response(serializers.data)

# ==================================================
# GET ALL PAYMENTS - Shows a list of all payments
# ==================================================
@api_view(['GET'])  # Only responds to GET requests
def get_payment(request):
    # Step 1: Get ALL payments from the database
    payment = Payment.objects.all()
    
    # Step 2: Convert payment data to JSON
    serializers = PaymentSerializer(payment, many=True)
    
    # Step 3: Send back the list of payments
    return Response(serializers.data) 

# ==================================================
# STUDENT LOGIN - Checks if student can login
# ==================================================
# This is like a security guard checking if you can enter
@api_view(['POST'])  # This responds to POST requests (sending data)
def student_login(request):
    # Step 1: Check if the data sent is in the correct format
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():  # If the format is correct
        # Get the matric number and password the student entered
        matriculation_number = serializer.validated_data['matriculation_number']
        password = serializer.validated_data['password']
        
        try: 
            # Step 2: Try to find a student with this matric number in the database
            student = Student.objects.get(matric_number=matriculation_number)

            # Step 3: Check if the password matches
            if student.password == password:
                # CORRECT PASSWORD! Let them in
                
                # Step 4: Create a special token (like a ticket) for this student
                # This token proves they logged in successfully
                refresh = RefreshToken()
                refresh['user_id'] = student.student_id
                refresh['matric_number'] = student.matric_number
                
                # Create an access token (a shorter ticket for quick requests)
                access = refresh.access_token
                access['matric_number'] = student.matric_number
                
                # Step 5: Send back the tokens and student info
                return Response({
                    'refresh': str(refresh),  # Long-term token
                    'access': str(access),  # Short-term token
                    'student_name': student.full_name,
                    'level': student.level,
                    'matric_number': student.matric_number
                }, status=status.HTTP_200_OK)   # 200 = Success!
            else:
                # WRONG PASSWORD!
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        except Student.DoesNotExist:
            # No student with that matric number exists
            return Response({'message': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # If the data format was wrong
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==================================================
# ADMIN LOGIN - Checks if admin can login
# ==================================================
# This is like a security guard checking if a manager can enter
@api_view(['POST'])  # Responds to POST requests
def admin_login(request):
    # Step 1: Check if the data sent is in the correct format
    serializer = AdminLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        # Get the email and password the admin entered
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            # Step 2: Try to find an admin with this email in the database
            admin = Admin.objects.get(email=email)
            
            # Step 3: Check if the password matches
            if admin.password == password:
                # CORRECT PASSWORD! Let them in
                
                # Step 4: Create special tokens for this admin
                refresh = RefreshToken()
                refresh['user_id'] = admin.admin_id
                refresh['email'] = admin.email
                
                # Step 5: Send back the tokens and admin info
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'admin_name': admin.name,
                    'email': admin.email
                }, status=status.HTTP_200_OK)
            else:
                # WRONG PASSWORD!
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        except Admin.DoesNotExist:
            # No admin with that email exists
            return Response({'message': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # If the data format was wrong
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================================================
# STUDENT DASHBOARD - Shows student their personal info
# ==================================================
# This is like opening your personal account page
@api_view(['GET'])  # Responds to GET requests
@permission_classes([AllowAny])  # Anyone can access this (even without logging in)
def student_dashboard(request):
    # Step 1: Get the matriculation number from the request
    matric_no = request.query_params.get("matriculation_number")

    # Step 2: Make sure they provided a matric number
    if not matric_no:
        return Response({"error": "Matriculation number needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Step 3: Find this student in the database
        student = Student.objects.get(matric_number=matric_no)
        
        # Step 4: Get the student's profile information
        profile_data = StudentDashboardSerializer(student).data
        
        # Step 5: Create a response package with their profile
        response_data = {
            "profile": profile_data,
            "available_halls": []  # Start with an empty list of halls
        }
        
        # Step 6: Decide what else to show them
        
        # If they DON'T have a room AND their payment is VERIFIED
        # Show them the available halls they can choose from
        if not student.room and student.payment_status == "Verified":
            # Get halls that match their gender and have empty rooms
            halls = Hall.objects.filter(gender=student.gender, available_rooms__gt=0)
            response_data["available_halls"] = HallSerializer(halls, many=True).data
        
        # If they ALREADY HAVE a room, show them their room details
        elif student.room:
            response_data["room_details"] = {
                "hall_name": student.hall_selected.hall_name,
                "room_number": student.room.room_number,
            }
        
        # Step 7: Send back all the information
        return Response(response_data)

    except Student.DoesNotExist:
        # Student not found in database
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        

    
# ==================================================
# ADMIN DASHBOARD - Shows admin their hall statistics
# ==================================================
# This shows the admin everything about their hostel hall
@api_view(['GET'])  # Responds to GET requests
@permission_classes([AllowAny])  # Anyone can access
def admin_dashboard_data(request):
    try:
        # Step 1: Get the admin's email from the request
        admin_email = request.query_params.get("email")
        
        # Step 2: Find this admin in the database
        admin = Admin.objects.get(email=admin_email)

        # Step 3: Get all their dashboard data (including hall statistics)
        profile_data = AdminDashboardSerializer(admin).data

        # Step 4: Send back the complete dashboard
        return Response(profile_data)

    except Admin.DoesNotExist:
        # Admin not found in database
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)


# ==================================================
# BOOK ROOM - Assigns a room to a student
# ==================================================
# This is the most important function - it gives students their rooms!
@api_view(['POST'])  # Responds to POST requests
@permission_classes([AllowAny])  # Anyone can access
def book_room(request):
    # Step 1: Check if the booking request has the correct format
    serializer = BookingSerializer(data=request.data)
    
    if serializer.is_valid():  # If format is correct
       # Get the hall_id and matric number from the request
       hall_id = serializer.validated_data['hall_id']
       matric = serializer.validated_data['matriculation_number']


       try:
           # Step 2: Use a "transaction" - this means if anything goes wrong,
           # we undo ALL the changes (like a safety net)
           with transaction.atomic():
            
            # Step 3: Lock the student's record so they can't book twice at the same time
            # (Like putting a "Reserved" sign while we process their booking)
            student = Student.objects.select_for_update().get(matric_number=matric)

            # Step 4: VALIDATION - Check if the student is allowed to book
            
            # Check 1: Do they already have a room?
            if student.room:
                return Response({"error": "Student already has a room"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check 2: Did they pay their hostel fees?
            if student.payment_status != "Verified":
                return Response({"error": "Payment not verified"}, status=status.HTTP_400_BAD_REQUEST)

            # Step 5: Find an available room using our SEQUENTIAL ALGORITHM
            # This means: give them the first available room in order (like Room 101, then 102, etc.)
            room = Room.objects.select_for_update().filter(
                hall_id=hall_id,  # In the hall they selected
                current_occupants__lt=F('capacity'),  # Room is not full yet
                is_under_maintenance=False  # Room is not being repaired
            ).order_by('room_number').first()  # Get the first room in numerical order
            
            # Step 6: Check if we found an available room
            if not room:
                # No rooms available - hall is full!
                return Response({"error": "The hall is fully booked"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Step 7: EXECUTE THE BOOKING!
            
            # Add 1 to the number of students in this room
            room.current_occupants += 1
            room.save()  # Save the change to the database
            
            # Assign the room and hall to the student
            student.room = room
            student.hall_selected = room.hall
            student.save()  # Save the student's new room

            # Create an allocation record (like a receipt of this booking)
            allocation = Allocation.objects.create(
                student=student,
                room=room,
                allocation_date=timezone.now(),  # Current date and time
                status='active'  # The allocation is active
            )

            # send email to student
            if allocation:
                send_allocation_email(
                    student_email=student.email,
                    student_name=student.full_name,
                    room_details=f"{room.hall.hall_name} - Room {room.room_number}"
                )
            
            # Step 8: Send back a success message!
            return Response({
                "message": "Room booked successfully",
                "room number":room.room_number,
                "hall name":room.hall.hall_name
            }, status=status.HTTP_200_OK)
            

       except Student.DoesNotExist:
           # Student with that matric number doesn't exist
           return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
       
       except Exception as e:
           # Something unexpected went wrong
           return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # If the booking data format was wrong
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

           

    
# ==================================================
# ALLOCATION LIST VIEW - Shows student's room allocation receipt
# ==================================================
# This creates a receipt showing all the details of a student's room allocation
@api_view(['GET'])
@permission_classes([AllowAny])  # Anyone can access
def allocation_list(request):
    #  Get the matriculation number from the URL parameters
    matric_no = request.query_params.get("matriculation_number")
    
    # Make sure they provided a matric number
    if not matric_no:
        return Response({"error": "Matriculation number is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        #  Find the student's allocation using their matric number
        # First get the student, then get their allocation
        student = Student.objects.get(matric_number=matric_no)
        allocation = Allocation.objects.get(student=student, status='active')
        
        #  Create a receipt with all the important information
        reciept_data = {
            'receipt_no': f"BU-HAMS-{allocation.allocation_id}",  # unique receipt number
            'full_name': allocation.student.full_name,
            'matric_no': allocation.student.matric_number,
            'department': allocation.student.department,
            'level': allocation.student.level,
            'hall_name': allocation.student.hall_selected.hall_name,
            'room_number': allocation.room.room_number,
            'allocation_date': allocation.allocation_date,
            'status': allocation.status,
            'house_address': allocation.student.house_address,
            'gender': allocation.student.gender,
            'phone_number': allocation.student.phone_number,
            'email': allocation.student.email,
        }
        
        #  Send back the receipt data
        return Response(reciept_data)
        
    except Student.DoesNotExist:
        # If student not found
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        
    except Allocation.DoesNotExist:
        # If no allocation found for this student, return error message
        return Response({'error': 'No allocation found for this student'}, status=status.HTTP_404_NOT_FOUND)
