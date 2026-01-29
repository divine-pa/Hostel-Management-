# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

 
class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=11, blank=True, null=True)
    hall = models.ForeignKey('Hall', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin'


class Allocation(models.Model):
    allocation_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('Student', models.DO_NOTHING)
    room = models.ForeignKey('Room', models.DO_NOTHING)
    allocation_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=True, null=True)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'allocation'
        unique_together = (('student', 'status'),)


class Hall(models.Model):
    hall_id = models.AutoField(primary_key=True)
    hall_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=6)
    total_rooms = models.IntegerField()
    available_rooms = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hall'


class Log(models.Model):
    log_id = models.AutoField(primary_key=True)
    action = models.CharField(max_length=255)
    user_role = models.CharField(max_length=7)
    user_id = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'log'


class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    matric_number = models.ForeignKey('Student', models.DO_NOTHING, db_column='matric_number', to_field='matric_number')
    payment_reference = models.CharField(unique=True, max_length=100)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateTimeField(blank=True, null=True)
    payment_status = models.CharField(max_length=8, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment'


class Receipt(models.Model):
    receipt_id = models.AutoField(primary_key=True)
    matric_number = models.ForeignKey('Student', models.DO_NOTHING, db_column='matric_number', to_field='matric_number')
    student_name = models.CharField(max_length=100)
    payment_reference = models.CharField(max_length=100)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateTimeField()
    verified = models.IntegerField(blank=True, null=True)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'receipt'


class Room(models.Model):
    room_id = models.AutoField(primary_key=True)
    hall = models.ForeignKey(Hall, models.DO_NOTHING)
    room_number = models.CharField(max_length=20)
    capacity = models.IntegerField()
    current_occupants = models.IntegerField()
    room_status = models.CharField(max_length=11, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'room'
        unique_together = (('hall', 'room_number'),)


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    matric_number = models.CharField(unique=True, max_length=20)
    full_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    department = models.CharField(max_length=100, blank=True, null=True)
    level = models.CharField(max_length=10, blank=True, null=True)
    gender = models.CharField(max_length=6)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    parent_phone = models.CharField(max_length=20, blank=True, null=True)
    house_address = models.TextField(blank=True, null=True)
    denomination = models.CharField(max_length=50, blank=True, null=True)
    payment_status = models.CharField(max_length=8, blank=True, null=True)
    hall_selected = models.ForeignKey(Hall, models.DO_NOTHING, db_column='hall_selected', blank=True, null=True)
    room = models.ForeignKey(Room, models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student'
