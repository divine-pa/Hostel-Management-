import os
import requests
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
import io, uuid, string, random, secrets
from xhtml2pdf import pisa

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


#generating transaction id
def generate_transaction_id():
    random_code =''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    return f"BU-{random_code}"


# ==================================================
# GENERATE RECEIPT PDF  (returns bytes in memory)
# ==================================================
# Uses xhtml2pdf to convert the Django HTML template into a PDF file
# Returns the PDF bytes, or None if generation failed
def generate_receipt_pdf(context):
    """
    Render receipt_template.html with the given context dict and
    return the resulting PDF as raw bytes (ready to attach to an email).
    """
    # Step 1: Render the HTML template with context data
    html_string = render_to_string('testdbModel/receipt_template.html', context)

    # Step 2: Create an in-memory buffer to hold the PDF
    buffer = io.BytesIO()

    # Step 3: Convert HTML to PDF using xhtml2pdf
    pisa_status = pisa.CreatePDF(io.StringIO(html_string), dest=buffer)

    if pisa_status.err:
        print(f"PDF generation error: {pisa_status.err}")
        return None

    # Step 4: Get the PDF bytes and close the buffer
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


# ==================================================
# SEND RECEIPT EMAIL  (via Brevo API)
# ==================================================
# Renders the receipt HTML template and sends it to the student
# using the Brevo transactional email API (https://brevo.com).
# This function should ALWAYS be called inside a try/except block
# so that email/API failures never crash or rollback the booking.
def send_receipt_email(student_email, student_name, matric_number,
                       hall_name, room_number, receipt_id,
                       transaction_id, amount, date,
                       department='', level='', recipient_email=''):
    """
    Render the receipt HTML template and send it via the Brevo API.
    If template rendering fails, a simple HTML fallback is sent instead.
    """
    # Build the context dict for the HTML template
    context = {
        'student_name': student_name,
        'matric_number': matric_number,
        'hall_name': hall_name,
        'room_number': room_number,
        'receipt_no': receipt_id,
        'transaction_id': transaction_id,
        'amount_paid': amount,
        'date': date,
        'department': department,
        'level': level,
        'email': recipient_email,
    }

    # Render the receipt HTML template to use as the email body
    try:
        html_content = render_to_string('testdbModel/receipt_template.html', context)
    except Exception as e:
        # Fallback: build a simple HTML email if template rendering fails
        print(f"Template rendering failed for {matric_number}: {e}")
        html_content = (
            f"<h2>Room Allocation Receipt</h2>"
            f"<p>Hello {student_name},</p>"
            f"<p>Your hall allocation is successful!</p>"
            f"<p><strong>Hall:</strong> {hall_name}<br>"
            f"<strong>Room:</strong> {room_number}<br>"
            f"<strong>Receipt No:</strong> {receipt_id}<br>"
            f"<strong>Transaction ID:</strong> {transaction_id}<br>"
            f"<strong>Amount Paid:</strong> {amount}</p>"
            f"<p>Please login to the portal to download your e-receipt.</p>"
            f"<p>— Babcock University HAMS</p>"
        )

    # THE BREVO API BYPASS
    api_key = os.environ.get('BREVO_API_KEY')
    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }

    payload = {
        # This MUST be the exact email you verified on Brevo
        "sender": {
            "name": "Babcock Hostel Allocations",
            "email": "projecttest531@gmail.com"
        },
        # This is dynamic! It will send to whatever email the student signed up with.
        "to": [
            {"email": student_email, "name": student_name}
        ],
        "subject": "Room Allocation Receipt - Babcock University",
        "htmlContent": html_content
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Brevo API Response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Brevo API failed: {e}")

