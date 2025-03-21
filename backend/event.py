from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import random
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin SDK
cred = credentials.Certificate("../serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://event-verse-app-default-rtdb.asia-southeast1.firebasedatabase.app'
})

# FastAPI instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Allows all origins. Change to specific domains in production.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)

# Pydantic model for request validation


class Event(BaseModel):
    eventName: str
    eventDescription: str
    eventDate: str  # ISO 8601 format (e.g., 2025-03-15T18:00:00Z)
    eventLocation: str
    eventHostId: str
    eventHostApiKey: str
    eventStatus: str = Field(default="incomplete")

# Function to generate a unique 6-digit event ID


def generate_unique_event_id():
    ref = db.reference('events')
    while True:
        # Generate a 6-digit random number as event ID
        event_id = str(random.randint(100000, 999999))

        # Check if event ID already exists
        existing_event = ref.child(event_id).get()

        if not existing_event:
            return event_id  # Return if unique

# POST endpoint to create an event


@app.post("/events/")
async def create_event(event: Event):
    try:
        # Generate a unique event ID
        event_id = generate_unique_event_id()

        # Reference to Firebase Realtime Database
        ref = db.reference('events')

        # Convert Pydantic model to dictionary
        event_data = event.dict()

        # Save event data to Firebase
        ref.child(event_id).set(event_data)

        return {"eventId": event_id, "message": "Event created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# GET endpoint to fetch event details by eventId


@app.get("/events/{eventId}")
async def fetch_event(eventId: str):
    try:
        # Reference to the event in Firebase Realtime Database
        event_ref = db.reference(f'events/{eventId}')
        event_data = event_ref.get()

        # Check if event exists
        if event_data:
            return {"eventId": eventId, "eventDetails": event_data}
        else:
            raise HTTPException(status_code=404, detail="Event not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True)
