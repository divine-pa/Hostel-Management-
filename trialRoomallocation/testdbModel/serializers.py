from rest_framework import serializers
from .models import Hall,Student,Admin,Allocation,Room,Payment

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = "__all__" 

#student
class StudentSerializer(serializers.ModelSerializer): 

    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {
            'password': {'write_only': True},
            'student_id': {'read_only': True}
        }

class AdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = Admin
        fields = "__all__"
        extra_kwargs = {
            'password':{'write_only': True}
        }

class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    matriculation_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
     
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
#student dashboard serializer
class StudentDashboardSerializer(serializers.ModelSerializer):
    #source='matric_number' tells Django: "Get data from the DB column 'matric_number'"
    matriculation_number = serializers.CharField(source='matric_number', read_only=True)
    room_details = RoomSerializer(source='room', read_only=True, allow_null=True)
    hall_details = HallSerializer(source='hall_selected', read_only=True, allow_null=True)
    
    class Meta:
        model = Student
        fields = ['full_name', 'matriculation_number', 'level', 'payment_status', 'department', 'room_details', 'hall_details']

#admin dashboard serializer
# 1. Mini Serializer for Students (Just enough info for the Admin to see who is there)
class RoomStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['matric_number', 'full_name', 'level','phone_number','department']


# 2. Room Serializer (Includes the students above)
class AdminRoomSerializer(serializers.ModelSerializer):
    # This fetches the students currently assigned to this room
    
    occupants_list = RoomStudentSerializer(source='student_set', many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            'room_id', 
            'room_number', 
            'capacity', 
            'current_occupants', 
            'room_status', 
            'occupants_list' # <--- Now the admin can see WHO is inside
        ]

class HallStatsSerializer(serializers.ModelSerializer):
    rooms = AdminRoomSerializer(source='room_set', many=True, read_only=True)
    total_students_in_hall = serializers.SerializerMethodField()
    occupancy_rate = serializers.SerializerMethodField()

    class Meta:
        model = Hall
        fields = [
            'hall_name', 'gender', 'total_rooms', 
            'available_rooms', 'total_students_in_hall', 
            'occupancy_rate', 'rooms'
        ]

    def get_total_students_in_hall(self, obj):
        return sum(room.current_occupants for room in obj.room_set.all())

    def get_occupancy_rate(self, obj):
        total_capacity = sum(room.capacity for room in obj.room_set.all())
        current_occupants = self.get_total_students_in_hall(obj)
        
        if total_capacity == 0: return "0%"
        percentage = (current_occupants / total_capacity) * 100
        return f"{round(percentage)}%"

# ==========================================
# 4. THE TOP LAYER: The Admin Dashboard
# ==========================================
class AdminDashboardSerializer(serializers.ModelSerializer):
    # Nest the Hall stats inside the Admin object
    hall_details = HallStatsSerializer(source='hall', read_only=True)

    class Meta:
        model = Admin
        fields = ['name', 'email', 'role', 'hall_details']



#booking serializer ( for rooms)

class BookingSerializer(serializers.Serializer):
    hall_id = serializers.IntegerField()
    matriculation_number = serializers.CharField()
    
