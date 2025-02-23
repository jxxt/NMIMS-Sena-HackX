from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from firebase_admin import credentials, db, initialize_app
from datetime import datetime
import uuid

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
# Replace with your service account key path
cred = credentials.Certificate("../serviceAccountKey.json")
initialize_app(cred, {
    'databaseURL': 'https://event-verse-app-default-rtdb.asia-southeast1.firebasedatabase.app'
})

# Pydantic model for RSVP data


class RSVPData(BaseModel):
    event_id: str
    name: str
    email: str
    response: str


@app.post("/api/rsvp")
async def submit_rsvp(rsvp_data: RSVPData):
    try:
        # Generate a unique ID for the RSVP
        rsvp_id = str(uuid.uuid4())

        # Create the data to be stored
        data = {
            "name": rsvp_data.name,
            "email": rsvp_data.email,
            "response": rsvp_data.response,
            "timestamp": datetime.now().isoformat()
        }

        # Store in Firebase
        ref = db.reference(f'attendees/{rsvp_data.event_id}')
        ref.child(rsvp_id).set(data)

        return {
            "status": "success",
            "message": "RSVP submitted successfully",
            "rsvp_id": rsvp_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/rsvp/{event_id}")
async def get_rsvps(event_id: str):
    try:
        # Get all RSVPs for an event
        ref = db.reference(f'attendees/{event_id}')
        rsvps = ref.get()

        if rsvps is None:
            return {"attendees": []}

        return {"attendees": rsvps}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
