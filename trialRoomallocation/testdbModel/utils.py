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
# SEND RECEIPT EMAIL  (with PDF attachment)
# ==================================================
# Generates the PDF receipt and emails it as an attachment to the student
# This function should ALWAYS be called inside a try/except block
# so that email/SMTP failures never crash or rollback the booking
def send_receipt_email(student_email, student_name, matric_number,
                       hall_name, room_number, receipt_no,
                       transaction_id, amount_paid, date,
                       department='', level='', email=''):
    """
    Generate a PDF receipt and send it as an email attachment.
    If the PDF generation fails, a text-only fallback email is sent instead.
    """
    # Build the context dict for the HTML template
    context = {
        'student_name': student_name,
        'matric_number': matric_number,
        'hall_name': hall_name,
        'room_number': room_number,
        'receipt_no': receipt_no,
        'transaction_id': transaction_id,
        'amount_paid': amount_paid,
        'date': date,
        'department': department,
        'level': level,
        'email': email,
    }

    # Generate the PDF
    pdf_bytes = generate_receipt_pdf(context)

    if not pdf_bytes:
        # Fallback: send a plain-text email if PDF generation fails
        print(f"Could not generate PDF for {matric_number}, sending text-only email")
        send_mail(
            'Babcock University: Room Allocation Successful',
            f"Hello {student_name},\n\n"
            f"Your hall allocation is successful.\n"
            f"Hall: {hall_name}\nRoom: {room_number}\n"
            f"Receipt No: {receipt_no}\n\n"
            f"Please login to the portal to download your e-receipt.",
            'projecttest531@gmail.com',
            [student_email],
            fail_silently=False,
        )
        return

    # Build email with PDF attachment using Django's EmailMessage
    email = EmailMessage(
        subject='Babcock University: Room Allocation Receipt',
        body=(
            f"Hello {student_name},\n\n"
            f"Your hall allocation is successful! "
            f"Please find your official e-receipt attached.\n\n"
            f"Hall: {hall_name}\n"
            f"Room: {room_number}\n"
            f"Receipt No: {receipt_no}\n\n"
            f"Please present this receipt at the porter's lodge "
            f"to access your room.\n\n"
            f"— Babcock University HAMS"
        ),
        from_email='projecttest531@gmail.com',
        to=[student_email],
    )

    # Attach the PDF file named Receipt_[Matric_Number].pdf
    email.attach(
        filename=f"Receipt_{matric_number}.pdf",
        content=pdf_bytes,
        mimetype='application/pdf'
    )

    email.send(fail_silently=False)
    print(f"Receipt email with PDF sent to {student_email}")

