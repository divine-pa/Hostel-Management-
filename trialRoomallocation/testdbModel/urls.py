from django.urls import path
from .views import get_student,get_admin,get_hall,get_payment,student_login,admin_login

urlpatterns = [
    path('student/', get_student), #path for student data 
    path('admin/', get_admin),
    path('hall/', get_hall),
    path('payment/', get_payment),
    path('student/login/', student_login),
    path('admin/login/', admin_login),
]  