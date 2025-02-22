from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, initialize_app, storage
import uuid

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, but it's better to specify your frontend URL(s) for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./serviceAccountKey.json")
initialize_app(cred, {
    'storageBucket': 'event-verse-app.firebasestorage.app'  # Replace with your bucket name
})

# Upload image route
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_name = f"{uuid.uuid4()}-{file.filename}"
        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        
        # Upload image to Firebase Storage
        blob.upload_from_file(file.file, content_type=file.content_type)
        blob.make_public()

        # Return image URL
        return JSONResponse(content={"image_url": blob.public_url}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
