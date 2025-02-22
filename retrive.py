from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from firebase_admin import credentials, initialize_app, storage
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./serviceAccountKey.json")
initialize_app(cred, {
    'storageBucket': 'event-verse-app.firebasestorage.app'  # Replace with your bucket name
})

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
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
        raise HTTPException(status_code=500, detail=str(e))
