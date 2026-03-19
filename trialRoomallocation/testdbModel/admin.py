# ==================================================
# ADMIN.PY - This file sets up the Django Admin Panel
# ==================================================
# The Django admin panel is a special website page where you can:
# - View all your database tables
# - Add, edit, or delete records
# - It's like a control panel for your database

from django.contrib import admin
from .models import Student, Room, Hall, Allocation, Payment, Log, Admin

admin.site.register(Student)
admin.site.register(Room)
admin.site.register(Hall)
admin.site.register(Allocation)
admin.site.register(Payment)
admin.site.register(Log)
admin.site.register(Admin)

# Register your models here.
# To see a model in the admin panel, you need to register it here
# For example: admin.site.register(Student)
# Right now, no models are registered, so the admin panel won't show anything
