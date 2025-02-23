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
    return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmed - {event_data['eventName']}</title>
            <style type="text/css">
                body {{
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background-color: #1e40af;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background-color: white;
                    padding: 20px;
                    border-radius: 0 0 10px 10px;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 12px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Registration Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Hello {rsvp_data.name},</p>
                    <p>Thank you for registering for <strong>{event_data['eventName']}</strong>.</p>
                    <p><strong>Event Details:</strong></p>
                    <ul>
                        <li>Date: {event_data['eventDate']}</li>
                        <li>Location: {event_data['eventLocation']}</li>
                        <li>Description: {event_data['eventDescription']}</li>
                    </ul>
                    <p>We look forward to seeing you!</p>
                </div>
                <div class="footer">
                    <p>&copy; {datetime.now().year} EventVerse. All rights reserved.</p>
                </div>
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
