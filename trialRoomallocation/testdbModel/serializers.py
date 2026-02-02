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
    
