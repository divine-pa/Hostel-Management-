# ==================================================
# SERIALIZERS.PY - This file converts database data to JSON (and back)
# ==================================================
# Think of serializers like translators:
# They translate data from the database (which computers understand)
# into JSON format (which phones and websites understand easily)

from rest_framework import serializers
from .models import Hall,Student,Admin,Allocation,Room,Payment

# ==================================================
# HALL SERIALIZER - Converts hostel hall info to JSON
# ==================================================
# This takes info about a hostel building and makes it easy to send over the internet
class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall  # Which database table to get info from
        fields = "__all__"  # Send ALL the information about the hall

# ==================================================
# STUDENT SERIALIZER - Converts student info to JSON
# ==================================================
# This translates student information for the internet
class StudentSerializer(serializers.ModelSerializer): 

    class Meta:
        model = Student  # Get data from the Student table
        fields = "__all__"  # Send ALL student information
        extra_kwargs = {
            # Password is "write_only" - we can receive it but never send it back (for security)
            'password': {'write_only': True},
            # student_id is "read_only" - the system creates it, users can't change it
            'student_id': {'read_only': True}
        }

# ==================================================
# ADMIN SERIALIZER - Converts admin info to JSON
# ==================================================
# This translates administrator information
class AdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = Admin  # Get data from the Admin table
        fields = "__all__"  # Send ALL admin information
        extra_kwargs = {
            # Password is write only for security - we can save it but never show it
            'password':{'write_only': True}
        }

# ==================================================
# PAYMENT SERIALIZER - Converts payment info to JSON
# ==================================================
# This translates payment records
class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment  # Get data from the Payment table
        fields = '__all__'  # Send ALL payment information

# ==================================================
# LOGIN SERIALIZER - For student login
# ==================================================
# This checks that students provide their matric number and password when logging in
class LoginSerializer(serializers.Serializer):
    # The student must provide their matriculation number
    matriculation_number = serializers.CharField()
    # The student must provide their password (write_only means it won't be sent back)
    password = serializers.CharField(write_only=True)

# ==================================================
# ADMIN LOGIN SERIALIZER - For admin login
# ==================================================
# This checks that admins provide their email and password when logging in
class AdminLoginSerializer(serializers.Serializer):
    # The admin must provide their email
    email = serializers.CharField()
    # The admin must provide their password (write_only for security)
    password = serializers.CharField(write_only=True)
     
# ==================================================
# ROOM SERIALIZER - Converts room info to JSON
# ==================================================
# This translates room information
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room  # Get data from the Room table
        fields = '__all__'  # Send ALL room information

# ==================================================
# STUDENT ROOM SERIALIZER - Room info for students (no occupant names)
# ==================================================
# Shows room availability without revealing who is in each room
class StudentRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['room_id', 'room_number', 'capacity', 'current_occupants', 'room_status']

        
# ==================================================
# STUDENT DASHBOARD SERIALIZER - Special view for students
# ==================================================
# This creates a customized view of student info for their dashboard
class StudentDashboardSerializer(serializers.ModelSerializer):
    # matriculation_number: Gets the student's matric number from the database
    # source='matric_number' tells Django: "Get data from the DB column 'matric_number'"
    # read_only=True means students can see it but can't change it
    matriculation_number = serializers.CharField(source='matric_number', read_only=True)
    
    # room_details: Gets full information about the student's room
    # source='room' means get it from the room field
    # allow_null=True means it's okay if the student doesn't have a room yet
    room_details = RoomSerializer(source='room', read_only=True, allow_null=True)
    
    # hall_details: Gets full information about the selected hall
    hall_details = HallSerializer(source='hall_selected', read_only=True, allow_null=True)
    
    class Meta:
        model = Student  # Get data from Student table
        # Only send these specific fields to the student dashboard
        fields = ['full_name', 'matriculation_number', 'level', 'payment_status', 'department', 'room_details', 'hall_details']

# ==================================================
# ADMIN DASHBOARD SERIALIZERS - Special views for admins
# ==================================================

# MINI SERIALIZER - Shows basic student info in a room
# This is a smaller version that just shows who is in each room
class RoomStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student  # Get data from Student table
        # Only show these basic details (not everything about the student)
        fields = ['matric_number', 'full_name', 'level','phone_number','department']


# ROOM SERIALIZER FOR ADMIN - Shows rooms with their occupants
# This shows room details AND the list of students living in it
class AdminRoomSerializer(serializers.ModelSerializer):
    # occupants_list: Gets all students currently living in this room
    # source='student_set' gets all students whose 'room' field points to this room
    # many=True means there can be multiple students (a list)
    occupants_list = RoomStudentSerializer(source='student_set', many=True, read_only=True)

    class Meta:
        model = Room  # Get data from Room table
        fields = [
            'room_id',  # The unique room number
            'room_number',  # The room number (like "101")
            'capacity',  # How many students can fit
            'current_occupants',  # How many students are currently there
            'room_status',  # Is it available or full?
            'occupants_list',  # The list of students in the room
            'is_under_maintenance',  # Is it being repaired?
        ]

# HALL STATS SERIALIZER - Shows complete hall statistics
# This gives admins a full picture of a hostel hall
class HallStatsSerializer(serializers.ModelSerializer):
    # rooms: Get all the rooms in this hall with their occupants
    # source='room_set' gets all rooms whose 'hall' field points to this hall
    rooms = AdminRoomSerializer(source='room_set', many=True, read_only=True)
    
    # total_students_in_hall: A calculated field (we count the students)
    total_students_in_hall = serializers.SerializerMethodField()
    
    # occupancy_rate: A calculated field (shows what percentage of beds are filled)
    occupancy_rate = serializers.SerializerMethodField()

    # NEW: Add these to show maintenance impact
    rooms_under_maintenance = serializers.SerializerMethodField()
    true_available_beds = serializers.SerializerMethodField()


    class Meta:
        model = Hall  # Get data from Hall table
        fields = [
            'hall_name',  # Name of the hall
            'gender',  # Is it for males or females?
            'total_rooms',  # Total number of rooms
            'available_rooms',  # How many rooms are still empty
            'rooms_under_maintenance',  # NEW: Rooms under maintenance
            'true_available_beds',  # NEW: True available beds
            'total_students_in_hall',  # Total students in the hall (calculated)
            'occupancy_rate',  # Percentage of beds filled (calculated)
            'rooms'  # List of all rooms with their details
        ]

    # HOW TO COUNT: total students in the hall
    # This adds up all the students in all the rooms
    def get_total_students_in_hall(self, obj):
        # For each room in the hall, get its current_occupants and add them all up
        return sum(room.current_occupants for room in obj.room_set.all())

    # HOW TO CALCULATE: occupancy rate
    # This figures out what percentage of the hall is full
    def get_occupancy_rate(self, obj):
        # Step 1: Add up the capacity of all rooms to get total beds available
        total_capacity = sum(room.capacity for room in obj.room_set.all())
        
        # Step 2: Get the total number of students currently in the hall
        current_occupants = self.get_total_students_in_hall(obj)
        
        # Step 3: If there are no beds (total_capacity is 0), return "0%"
        if total_capacity == 0: return "0%"
        
        # Step 4: Calculate percentage: (students ÷ total beds) × 100
        percentage = (current_occupants / total_capacity) * 100
        
        # Step 5: Round to whole number and add "%" sign
        return f"{round(percentage)}%"

    # NEW: Show beds that are actually bookable (Not Full AND Not Broken)
    def get_true_available_beds(self, obj):
        rooms = obj.room_set.filter(is_under_maintenance=False)
        total_cap = sum(room.capacity for room in rooms)
        current = sum(room.current_occupants for room in rooms)
        return total_cap - current

    # NEW: Count rooms currently under maintenance
    def get_rooms_under_maintenance(self, obj):
        # Count how many rooms in this hall are being repaired
        return obj.room_set.filter(is_under_maintenance=True).count()

# ==================================================
# ADMIN DASHBOARD SERIALIZER - Main dashboard view
# ==================================================
# This is the top-level view that admins see when they login
class AdminDashboardSerializer(serializers.ModelSerializer):
    # hall_details: Nest the complete hall statistics inside the admin object
    # This shows the admin everything about their hall
    hall_details = HallStatsSerializer(source='hall', read_only=True)

    class Meta:
        model = Admin  # Get data from Admin table
        # Show the admin's name, email, role, and their complete hall details
        fields = ['name', 'email', 'role', 'hall_details']



# ==================================================
# BOOKING SERIALIZER - For room booking requests
# ==================================================
# This checks that the room booking request has the right information
class BookingSerializer(serializers.Serializer):
    # hall_id: Which hall does the student want to book in?
    hall_id = serializers.IntegerField()
    # room_id: Which specific room the student selected
    room_id = serializers.IntegerField()
    # matriculation_number: Which student is making the booking?
    matriculation_number = serializers.CharField()
    
# ===================================
# ALLOCATION SERIALIZER 
# ===================================
# this serilizer pulls data from the allocation table
class AllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allocation
        fields = '__all__'
