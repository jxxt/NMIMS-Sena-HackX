import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from firebase_admin import credentials, initialize_app, storage
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app
app = FastAPI()

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./serviceAccountKey.json")
initialize_app(cred, {
    'storageBucket': 'event-verse-app.firebasestorage.app'  # Replace with your bucket name
})

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Retrieve all uploaded images
@app.get("/get-all-images/")
async def get_all_images():
    try:
        bucket = storage.bucket()
        blobs = list(bucket.list_blobs())

        if not blobs:
            raise HTTPException(status_code=404, detail="No images found")

        image_urls = [blob.public_url for blob in blobs]
        return JSONResponse(content={"image_urls": image_urls}, status_code=200)

    except Exception as e:
        logging.error(f"Error retrieving images: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Upload an image
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        bucket = storage.bucket()

        # Generate unique filename
        file_name = f"{file.filename}"
        blob = bucket.blob(file_name)
        
        logging.info(f"Uploading file: {file_name}")

        # Upload image to Firebase Storage
        blob.upload_from_file(file.file, content_type=file.content_type)
        blob.make_public()

        logging.info(f"File uploaded successfully: {blob.public_url}")

        # Return image URL
        return JSONResponse(content={"image_url": blob.public_url}, status_code=200)
    
    except Exception as e:
        logging.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))