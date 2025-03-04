from fastapi import Query
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
import random
import uuid
import firebase_admin
from firebase_admin import credentials, db
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from typing import Optional
import logging
from email.utils import formataddr
from datetime import datetime
import qrcode
from io import BytesIO
import base64


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ================== Environment Variables ==================
# In production, use proper environment variables
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "host.eventverse@gmail.com"
# Use App Password for security
SENDER_PASSWORD = "rfzh vpvy jsmm qsgj"
FIREBASE_URL = "https://event-verse-app-default-rtdb.asia-southeast1.firebasedatabase.app"

# ================== Firebase Initialization ==================
try:
    cred = credentials.Certificate("../serviceAccountKey.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': FIREBASE_URL
    })
    logger.info("Firebase initialized successfully")
except Exception as e:
    logger.error(f"Firebase initialization failed: {e}")
    raise

# ================== FastAPI Initialization ==================
app = FastAPI(title="EventVerse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== Models ==================


class Event(BaseModel):
    eventName: str
    eventDescription: str
    eventDate: str  # ISO 8601 format
    eventLocation: str
    eventHostId: str
    eventHostApiKey: str
    eventStatus: str = Field(default="incomplete")


class RSVPData(BaseModel):
    event_id: str
    name: str
    email: EmailStr  # Email validation
    response: str

# ================== Email Template ==================


def get_email_template(event_data: dict, rsvp_data: RSVPData) -> str:
    # Parse ISO 8601 datetime
    event_datetime = datetime.fromisoformat(event_data['eventDate'])
    event_date = event_datetime.strftime("%d %b %Y")  # e.g., 23 Feb 2025
    event_time = event_datetime.strftime("%I:%M %p")  # e.g., 08:00 AM

    return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmed - {event_data['eventName']}</title>
            <style type="text/css">
                body {{
                    margin: 0;
                    padding: 0;
                    min-width: 100%;
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    background-color: #f5f5f5;
                    color: #333333;
                }}
                .wrapper {{
                    width: 100%;
                    table-layout: fixed;
                    background-color: #f5f5f5;
                    padding: 40px 0;
                }}
                .main {{
                    width: 100%;
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    margin: 0 auto;
                }}
                .header {{
                    background-color: #1e40af;
                    padding: 30px;
                    color: #ffffff;
                    border-radius: 8px 8px 0 0;
                }}
                .content {{
                    padding: 30px;
                }}
                .details-box {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }}
                .footer {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 0 0 8px 8px;
                    font-size: 12px;
                    color: #666666;
                }}
                .success-badge {{
                    background-color: #22c55e;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 15px;
                    font-size: 14px;
                    display: inline-block;
                    margin-bottom: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <table class="main" width="100%">
                    <tr>
                        <td class="header">
                            <table width="100%">
                                <tr>
                                    <td style="color: #ffffff;">
                                        <h1 style="margin: 0;">Registration Confirmed!</h1>
                                        <p style="margin: 10px 0 0 0;">You're all set for {event_data['eventName']}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <div class="success-badge">✓ Registration Complete</div>
                                        <h2 style="color: #1e40af; margin-top: 0;">Thank you for registering!</h2>
                                        <p>Your registration for {event_data['eventName']} has been confirmed. We look forward to seeing you there!</p>
                                        <div class="details-box">
                                            <table width="100%">
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <strong>📅 Event Date:</strong><br>
                                                        {event_date}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <strong>⏰ Event Time:</strong><br>
                                                        {event_time}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <strong>📍 Location:</strong><br>
                                                        {event_data['eventLocation']}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <strong>📝 Description:</strong><br>
                                                        {event_data['eventDescription']}
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <table width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0;">
                                            This is an automated email, please do not reply.<br>
                                            © {datetime.now().year} EventVerse. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
    """

# ================== Email Sender ==================


async def send_confirmation_email(event_data: dict, rsvp_data: RSVPData) -> bool:
    try:
        # Create the email
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = rsvp_data.email
        msg["Subject"] = f"Registration Confirmed - {event_data['eventName']}"

        # Attach HTML content
        html_content = get_email_template(event_data, rsvp_data)
        msg.attach(MIMEText(html_content, "html"))

        # # Generate QR Code and attach it as an inline image
        # qr_base64 = generate_qr_code(rsvp_data)
        # qr_img_cid = "qr_code_cid"
        # qr_img_html = f'<img src="data:image/png;base64,{qr_base64}" alt="QR Code" style="width:200px;height:200px;">'

        # # Add QR code in email body
        # html_content_with_qr = html_content.replace("</body>", f"<h3>Your Event QR Code:</h3>{qr_img_html}</body>")
        # msg.attach(MIMEText(html_content_with_qr, "html"))

        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Secure connection
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, rsvp_data.email, msg.as_string())
        server.quit()

        logger.info(f"Email sent successfully to {rsvp_data.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False

# ================== Utility Functions ==================


def generate_unique_event_id() -> str:
    ref = db.reference('events')
    while True:
        event_id = str(random.randint(100000, 999999))
        if not ref.child(event_id).get():
            return event_id

# ================== API Endpoints ==================


@app.get("/test-email/")
async def test_email(email: str = Query(..., description="Email address to send the test email to")):
    try:
        # Create a simple email content
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = email
        msg["Subject"] = "Test Email from EventVerse API"

        # Simple email body
        body = "This is a test email from the EventVerse API. If you received this, the email functionality is working!"
        msg.attach(MIMEText(body, "plain"))

        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Secure connection
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, email, msg.as_string())
        server.quit()

        logger.info(f"Test email sent successfully to {email}")
        return {"status": "success", "message": "Test email sent successfully"}
    except Exception as e:
        logger.error(f"Failed to send test email: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to send test email: {e}")


@app.post("/events/")
async def create_event(event: Event):
    try:
        event_id = generate_unique_event_id()
        ref = db.reference('events')
        event_data = event.dict()
        ref.child(event_id).set(event_data)
        return {"eventId": event_id, "message": "Event created successfully"}
    except Exception as e:
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create event: {str(e)}")


@app.get("/events/{eventId}")
async def fetch_event(eventId: str):
    try:
        event_ref = db.reference(f'events/{eventId}')
        event_data = event_ref.get()

        if not event_data:
            raise HTTPException(status_code=404, detail="Event not found")

        return {"eventId": eventId, "eventDetails": event_data}
    except Exception as e:
        logger.error(f"Error fetching event: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch event: {str(e)}")


@app.post("/api/rsvp")
async def submit_rsvp(rsvp_data: RSVPData):
    try:
        # Store RSVP in Firebase
        ref = db.reference(f'attendees/{rsvp_data.event_id}')
        ref.child(rsvp_data.email.replace('.', ',')).set({
            "name": rsvp_data.name,
            "email": rsvp_data.email,
            "response": rsvp_data.response,
            "timestamp": datetime.now().isoformat()
        })

        # Only send email for positive responses
        if rsvp_data.response == "I will attend":
            # Fetch event details for email
            event_ref = db.reference(f'events/{rsvp_data.event_id}')
            event_data = event_ref.get()

            if not event_data:
                raise HTTPException(status_code=404, detail="Event not found")

            # Send confirmation email
            email_sent = await send_confirmation_email(event_data, rsvp_data)

            if email_sent:
                return {
                    "status": "success",
                    "message": "RSVP submitted and confirmation email sent",
                    "emailSent": True
                }
            else:
                return {
                    "status": "partial_success",
                    "message": "RSVP submitted but failed to send confirmation email",
                    "emailSent": False
                }
        else:
            # For negative responses, just return success without email
            return {
                "status": "success",
                "message": "RSVP submitted successfully",
                "emailSent": False
            }

    except Exception as e:
        logger.error(f"Error submitting RSVP: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to submit RSVP: {str(e)}")


@app.get("/api/rsvp/{event_id}")
async def get_rsvps(event_id: str):
    try:
        ref = db.reference(f'attendees/{event_id}')
        rsvps = ref.get()
        return {"attendees": rsvps or []}
    except Exception as e:
        logger.error(f"Error fetching RSVPs: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch RSVPs: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

def generate_qr_code(rsvp_data: RSVPData) -> str:
    # Data to encode in the QR code
    qr_data = f"Name: {rsvp_data.name}\nEmail: {rsvp_data.email}\nEvent ID: {rsvp_data.event_id}"
    
    # Generate QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    # Save the QR Code image to a BytesIO stream
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return qr_base64
