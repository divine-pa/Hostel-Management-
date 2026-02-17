# ==================================================
# MODELS.PY - This file tells Django what information to store in the database
# ==================================================
# Think of this as creating different boxes (tables) to organize student hostel information
# Each "class" below is like a different box/folder to keep different types of information

from django.db import models 

 
# ==================================================
# ADMIN MODEL - Stores information about hostel administrators
# ==================================================
# This is like a box that stores information about people who manage the hostel
class Admin(models.Model):
    # admin_id: A unique number given to each admin (like a serial number)
    admin_id = models.AutoField(primary_key=True)
    
    # name: The admin's full name (like "John Doe")
    name = models.CharField(max_length=100)
    
    # email: The admin's email address (must be unique - no two admins can have same email)
    email = models.CharField(unique=True, max_length=100)
    
    # password: Secret code the admin uses to login
    password = models.CharField(max_length=255)
    
    # role: What type of admin they are (like "manager" or "supervisor")
    role = models.CharField(max_length=11, blank=True, null=True)
    
    # hall: Which hostel hall this admin is in charge of (connects to Hall box)
    hall = models.ForeignKey('Hall', models.DO_NOTHING, blank=True, null=True)
    
    # created_at: When this admin account was first created
    created_at = models.DateTimeField(blank=True, null=True)
    
    # updated_at: When this admin's information was last changed
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin'


# ==================================================
# ALLOCATION MODEL - Stores room assignment records
# ==================================================
# This is like a receipt that shows which student got which room
class Allocation(models.Model):
    # allocation_id: A unique number for each room assignment
    allocation_id = models.AutoField(primary_key=True)
    
    # student: Which student got the room (connects to Student box)
    student = models.ForeignKey('Student', models.DO_NOTHING)
    
    # room: Which room was given to the student (connects to Room box)
    room = models.ForeignKey('Room', models.DO_NOTHING)
    
    # allocation_date: When the student was given the room
    allocation_date = models.DateTimeField(blank=True, null=True)
    
    # status: Is the allocation "active" or "cancelled"?
    status = models.CharField(max_length=9, blank=True, null=True)
    
    # receipt: The payment receipt for this room (connects to Receipt box)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    
    # created_at: When this allocation record was first created
    created_at = models.DateTimeField(blank=True, null=True)
    
    # updated_at: When this allocation was last changed
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'allocation'
        unique_together = (('student', 'status'),)  # One student can't have two active allocations


# ==================================================
# HALL MODEL - Stores information about hostel buildings
# ==================================================
# This is like a box that stores info about each hostel building
class Hall(models.Model):
    # hall_id: A unique number for each hostel hall
    hall_id = models.AutoField(primary_key=True)
    
    # hall_name: The name of the hostel (like "Hall A" or "Peace Hall")
    hall_name = models.CharField(max_length=100)
    
    # gender: Is this hall for "male" or "female" students?
    gender = models.CharField(max_length=6)
    
    # total_rooms: How many rooms are in this hall altogether
    total_rooms = models.IntegerField()
    
    # available_rooms: How many rooms are still empty and can be given to students
    available_rooms = models.IntegerField()
    
    # created_at: When this hall was first added to the system
    created_at = models.DateTimeField(blank=True, null=True)
    
    # updated_at: When this hall's information was last changed
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hall'


# ==================================================
# LOG MODEL - Keeps a record of important actions
# ==================================================
# This is like a diary that writes down everything important that happens
class Log(models.Model):
    # log_id: A unique number for each log entry
    log_id = models.AutoField(primary_key=True)
    
    # action: What happened? (like "Student logged in" or "Room allocated")
    action = models.CharField(max_length=255)
    
    # user_role: Was it a "student" or "admin" who did this? (Now stores email)
    user_role = models.CharField(max_length=100)
    
    # user_id: The ID number of the person who did this action
    user_id = models.IntegerField(blank=True, null=True)
    
    # description: More details about what happened
    description = models.TextField(blank=True, null=True)
    
    # timestamp: Exactly when this happened (date and time)
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'log'
        ordering = ['-timestamp']


# ==================================================
# PAYMENT MODEL - Stores payment information
# ==================================================
# This is like a box that keeps track of money students paid
class Payment(models.Model):
    # payment_id: A unique number for each payment
    payment_id = models.AutoField(primary_key=True)
    
    # matric_number: Which student made this payment (connects to Student box)
    matric_number = models.ForeignKey('Student', models.DO_NOTHING, db_column='matric_number', to_field='matric_number')
    
    # payment_reference: A special code for this payment (like a transaction number)
    payment_reference = models.CharField(unique=True, max_length=100)
    
    # amount_paid: How much money the student paid (in naira)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    
    # date_paid: When the student made the payment
    date_paid = models.DateTimeField(blank=True, null=True)
    
    # payment_status: Is the payment "verified" or "pending"?
    payment_status = models.CharField(max_length=8, blank=True, null=True)
    
    # created_at: When this payment record was first created
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment'


# ==================================================
# RECEIPT MODEL - Stores uploaded payment receipts
# ==================================================
# This is like a box that keeps the pictures of payment receipts students upload
class Receipt(models.Model):
    # receipt_id: A unique number for each receipt
    receipt_id = models.AutoField(primary_key=True)
    
    # matric_number: Which student uploaded this receipt (connects to Student box)
    matric_number = models.ForeignKey('Student', models.DO_NOTHING, db_column='matric_number', to_field='matric_number')
    
    # student_name: The name of the student (saved for easy reference)
    student_name = models.CharField(max_length=100)
    
    # payment_reference: The transaction number on the receipt
    payment_reference = models.CharField(max_length=100)
    
    # amount_paid: How much money was paid according to the receipt
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    
    # date_paid: When the payment was made according to the receipt
    date_paid = models.DateTimeField()
    
    # verified: Has an admin checked and approved this? (1 = yes, 0 = no)
    verified = models.IntegerField(blank=True, null=True)
    
    # file_path: Where the receipt image is saved on the computer
    file_path = models.CharField(max_length=255, blank=True, null=True)
    
    # created_at: When this receipt was uploaded
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'receipt'


# ==================================================
# ROOM MODEL - Stores information about individual rooms
# ==================================================
# This is like a box that stores info about each bedroom in the hostel
class Room(models.Model):
    # room_id: A unique number for each room
    room_id = models.AutoField(primary_key=True)
    
    # hall: Which hostel building is this room in? (connects to Hall box)
    hall = models.ForeignKey(Hall, models.DO_NOTHING)
    
    # room_number: The room number (like "101" or "A23")
    room_number = models.CharField(max_length=20)
    
    # capacity: How many students can fit in this room (like 2 or 4)
    capacity = models.IntegerField()
    
    # current_occupants: How many students are currently living in this room
    current_occupants = models.IntegerField()
    
    # room_status: Is the room "available" or "full"?
    room_status = models.CharField(max_length=11, blank=True, null=True)
    
    # created_at: When this room was first added to the system
    created_at = models.DateTimeField(blank=True, null=True)
    
    # updated_at: When this room's information was last changed
    updated_at = models.DateTimeField(blank=True, null=True)
    
    # is_under_maintenance: Is the room being repaired? (True = yes, False = no)
    is_under_maintenance = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'room'
        unique_together = (('hall', 'room_number'),)  # Each hall can't have duplicate room numbers


# ==================================================
# STUDENT MODEL - Stores all student information
# ==================================================
# This is like a big box that stores everything about each student
class Student(models.Model):
    # student_id: A unique number for each student
    student_id = models.AutoField(primary_key=True)
    
    # matric_number: The student's matriculation number (like "CSC/2020/001")
    matric_number = models.CharField(unique=True, max_length=20)
    
    # full_name: The student's complete name
    full_name = models.CharField(max_length=100)
    
    # email: The student's email address (must be unique)
    email = models.CharField(unique=True, max_length=100)
    
    # password: Secret code the student uses to login
    password = models.CharField(max_length=255)
    
    # department: Which department the student belongs to (like "Computer Science")
    department = models.CharField(max_length=100, blank=True, null=True)
    
    # level: What year is the student in? (like "100" or "200")
    level = models.CharField(max_length=10, blank=True, null=True)
    
    # gender: Is the student "male" or "female"?
    gender = models.CharField(max_length=6)
    
    # phone_number: The student's phone number
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # parent_phone: Phone number of student's parent or guardian
    parent_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # house_address: Where the student's family lives
    house_address = models.TextField(blank=True, null=True)
    
    # denomination: Student's religious denomination (like "Christian" or "Muslim")
    denomination = models.CharField(max_length=50, blank=True, null=True)
    
    # payment_status: Has the student paid? ("Verified" or "Pending")
    payment_status = models.CharField(max_length=8, blank=True, null=True)
    
    # hall_selected: Which hostel hall did the student choose? (connects to Hall box)
    hall_selected = models.ForeignKey(Hall, models.DO_NOTHING, db_column='hall_selected', blank=True, null=True)
    
    # room: Which room is the student living in? (connects to Room box)
    room = models.ForeignKey(Room, models.DO_NOTHING, blank=True, null=True)
    
    # created_at: When this student account was first created
    created_at = models.DateTimeField(blank=True, null=True)
    
    # updated_at: When this student's information was last changed
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student'
