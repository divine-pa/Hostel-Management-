# ==================================================
# URLS.PY - This file maps website addresses to functions
# ==================================================
# Think of this like a phone directory:
# When someone visits a web address (URL), this file tells Django
# which function (view) should handle that request

from django.urls import path
from .views import get_student,get_admin,get_hall,get_payment,student_login,admin_login,student_dashboard,admin_dashboard_data,book_room,allocation_list,toggle_maintenance,allocation_graph

# List of all the URLs (web addresses) available in our API
urlpatterns = [
    # STUDENT ENDPOINTS
    # When someone goes to "api/student/", call the get_student function
    path('student/', get_student), 
    
    # ADMIN ENDPOINTS
    # When someone goes to "api/admin/", call the get_admin function
    path('admin/', get_admin),
    
    # HALL ENDPOINTS
    # When someone goes to "api/hall/", call the get_hall function
    path('hall/', get_hall),
    
    # PAYMENT ENDPOINTS
    # When someone goes to "api/payment/", call the get_payment function
    path('payment/', get_payment),
    
    # LOGIN ENDPOINTS
    # When a student tries to login at "api/student/login/", call student_login
    path('student/login/', student_login),
    
    # When an admin tries to login at "api/admin/login/", call admin_login
    path('admin/login/', admin_login),
    
    # DASHBOARD ENDPOINTS
    # When a student wants to see their dashboard at "api/student/dashboard/"
    path('student/dashboard/', student_dashboard),
    
    # When an admin wants to see their dashboard at "api/admin/dashboard/"
    path('admin/dashboard/', admin_dashboard_data),
    
    # BOOKING ENDPOINT
    # When a student wants to book a room at "api/bookRoom/"
    path('bookRoom/',book_room),

    # ALLOCATION ENDPOINT
    # When a student wants to see their allocation at "api/allocation/"
    path('allocation/',allocation_list),

    # ROOM MAINTENANCE ENDPOINT
    # When an admin toggles room maintenance status at "api/rooms/<room_id>/toggle-maintenance/"
    path('rooms/<int:room_id>/toggle-maintenance/', toggle_maintenance),

    path('allocation-graph/', allocation_graph),
]  