# EventVerse Project Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER AUTHENTICATION                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Landing Page   │
                    │    (App.jsx)     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Login Page     │
                    │  (Login.jsx)     │
                    └──────────────────┘
                              │
                              ├─► Send Magic Link to Email
                              │   (Firebase Auth)
                              │
                              ▼
                    ┌──────────────────┐
                    │ Email Verification│
                    │   & Sign In      │
                    └──────────────────┘
                              │
                              ├─► Generate eventHostId (8-digit)
                              ├─► Generate eventHostApiKey (16-char)
                              ├─► Store User Data in Firebase
                              │
                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                         HOME DASHBOARD                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Home Page      │
                    │   (Home.jsx)     │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌────────────────────┐  ┌────────────────────┐
        │  View Events       │  │  Create New Event  │
        │  Button            │  │  Button            │
        └────────────────────┘  └────────────────────┘
                    │                   │
                    │                   ▼
                    │         ┌──────────────────┐
                    │         │  Event Form      │
                    │         │  Modal           │
                    │         └──────────────────┘
                    │                   │
                    │                   ├─► Event Name
                    │                   ├─► Event Description
                    │                   ├─► Event Date
                    │                   ├─► Event Time
                    │                   ├─► Event Location (with Geoapify API)
                    │                   │
                    │                   ▼
                    │         ┌──────────────────┐
                    │         │  POST /events/   │
                    │         │  (Backend API)   │
                    │         └──────────────────┘
                    │                   │
                    │                   ├─► Generate 6-digit Event ID
                    │                   ├─► Store in Firebase DB
                    │                   │
                    │                   ▼
                    │         ┌──────────────────┐
                    │         │  Event Created   │
                    │         │  Success         │
                    │         └──────────────────┘
                    │
                    ▼

┌─────────────────────────────────────────────────────────────────┐
│                        EVENT MANAGEMENT                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  User Events     │
                    │ (UserEvents.jsx) │
                    └──────────────────┘
                              │
                              ├─► Fetch User's eventHostId
                              ├─► Query Firebase for Events
                              ├─► Filter by eventHostId
                              │
                              ▼
                    ┌──────────────────┐
                    │  Display Event   │
                    │  List            │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  View Invite     │
                    │  Button          │
                    └──────────────────┘
                              │
                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                        EVENT DETAILS PAGE                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Event Details   │
                    │(EventDetails.jsx)│
                    └──────────────────┘
                              │
                              ├─► GET /events/{eventId}
                              ├─► Fetch Event Data from Firebase
                              │
                              ▼
                    ┌──────────────────┐
                    │  Display Event   │
                    │  Information     │
                    └──────────────────┘
                              │
                    ┌─────────┴──────────┬──────────────┬────────────┐
                    │                    │              │            │
                    ▼                    ▼              ▼            ▼
        ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐  ┌──────────┐
        │  RSVP Section   │  │  Location Map   │  │ Weather  │  │ QR Code  │
        │                 │  │  (Leaflet)      │  │ Forecast │  │ Share    │
        └─────────────────┘  └─────────────────┘  └──────────┘  └──────────┘
                    │                    │              │            │
                    ▼                    ▼              ▼            ▼
        ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐  ┌──────────┐
        │ Response Buttons│  │ OpenStreetMap   │  │ Weather  │  │ Generate │
        │ - I will attend │  │ Geocoding API   │  │ API      │  │ QR Code  │
        │ - Won't join    │  │                 │  │          │  │          │
        └─────────────────┘  └─────────────────┘  └──────────┘  └──────────┘
                    │
                    ▼

┌─────────────────────────────────────────────────────────────────┐
│                          RSVP WORKFLOW                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  User Clicks     │
                    │  RSVP Button     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Show Popup      │
                    │  Modal           │
                    └──────────────────┘
                              │
                              ├─► Name Input
                              ├─► Email Input
                              │
                              ▼
                    ┌──────────────────┐
                    │  POST /api/rsvp  │
                    │  (Backend API)   │
                    └──────────────────┘
                              │
                              ├─► Store in Firebase
                              │   (attendees/{eventId})
                              │
                              ▼
                    ┌──────────────────┐
                    │  If "I will      │
                    │  attend"         │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Send Email      │
                    │  Confirmation    │
                    └──────────────────┘
                              │
                              ├─► Fetch Event Details
                              ├─► Generate HTML Email Template
                              ├─► Send via SMTP (Gmail)
                              │
                              ▼
                    ┌──────────────────┐
                    │  Success Message │
                    │  to User         │
                    └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  FastAPI Server  │
                    │  (main.py)       │
                    └──────────────────┘
                              │
                    ┌─────────┴──────────────────┐
                    │                            │
                    ▼                            ▼
        ┌────────────────────┐      ┌────────────────────┐
        │  Event Endpoints   │      │  RSVP Endpoints    │
        └────────────────────┘      └────────────────────┘
                    │                            │
                    ▼                            ▼
        POST /events/                POST /api/rsvp
        GET  /events/{eventId}       GET  /api/rsvp/{eventId}
        GET  /test-email/
                    │                            │
                    └────────────┬───────────────┘
                                 │
                                 ▼
                    ┌──────────────────────┐
                    │  Firebase Realtime   │
                    │  Database            │
                    └──────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌────────────────────┐    ┌────────────────────┐
        │  /events/          │    │  /attendees/       │
        │  {eventId}         │    │  {eventId}         │
        └────────────────────┘    └────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL API INTEGRATIONS                    │
└─────────────────────────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────┐
        │                                             │
        ▼                                             ▼
┌──────────────────┐                      ┌──────────────────┐
│  Firebase Auth   │                      │  Firebase DB     │
│  - Magic Link    │                      │  - Event Storage │
│  - Email Verify  │                      │  - User Storage  │
└──────────────────┘                      └──────────────────┘
        │                                             │
        ▼                                             ▼
┌──────────────────┐                      ┌──────────────────┐
│  Geoapify API    │                      │  Weather API     │
│  - Location      │                      │  - Forecast      │
│  - Autocomplete  │                      │  - Conditions    │
└──────────────────┘                      └──────────────────┘
        │                                             │
        ▼                                             ▼
┌──────────────────┐                      ┌──────────────────┐
│  OpenStreetMap   │                      │  SMTP Gmail      │
│  - Geocoding     │                      │  - Email Send    │
│  - Map Display   │                      │  - Confirmations │
└──────────────────┘                      └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

        User Authentication
              │
              ▼
        Generate Credentials
        (eventHostId, eventHostApiKey)
              │
              ▼
        Create Event
              │
              ▼
        Store in Firebase
        (events/{6-digit-id})
              │
              ▼
        Share Event Link
              │
              ▼
        Attendee Views Event
              │
              ▼
        Attendee Submits RSVP
              │
              ▼
        Store in Firebase
        (attendees/{eventId})
              │
              ▼
        Send Confirmation Email
        (if attending)
              │
              ▼
        Display Success Message

┌─────────────────────────────────────────────────────────────────┐
│                      ROUTING STRUCTURE                           │
└─────────────────────────────────────────────────────────────────┘

        /                   →  Home.jsx (Dashboard)
        /login              →  Login.jsx (Authentication)
        /events             →  UserEvents.jsx (Event List)
        /invite             →  Invite.jsx (Static Invite)
        /event/{eventId}    →  EventDetails.jsx (Event Page)
```
