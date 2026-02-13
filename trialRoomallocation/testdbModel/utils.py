from django.core.mail import send_mail

def send_allocation_email(student_email, student_name, room_details):
    subject = 'Babcock University: Room Allocation Successful'
    message = f"Hello {student_name},\n\nYour hall allocation is successful. \nRoom: {room_details}\n\nPlease login to the portal to download your e-receipt."
    
    send_mail(
        subject,
        message,
        'projecttest531@gmail.com', # From email
        [student_email],        # To email
        fail_silently=False,
    )