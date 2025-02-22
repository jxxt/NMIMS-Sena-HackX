from fastapi import FastAPI, HTTPException
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://event-verse-app-default-rtdb.asia-southeast1.firebasedatabase.app'
})

# FastAPI instance
app = FastAPI()

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
