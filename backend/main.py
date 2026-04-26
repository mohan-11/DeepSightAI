import os
import time
import random
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(title="Deepfake Detection API", version="1.0.0")

# Enable CORS (if testing separate dev servers in the future)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.ml_models.detector_img import ImageDeepfakeDetector
from backend.ml_models.detector_vid import VideoDeepfakeDetector
from backend.ml_models.detector_aud import AudioDeepfakeDetector

# Paths to the actual weights 
# (Make sure to place deepfake_model.keras and audio_deepfake_detector.keras here)
# Paths to the actual weights 
IMAGE_VIDEO_MODEL_PATH = os.path.join(os.path.dirname(__file__), "weights", "deepfake_model.keras")
AUDIO_MODEL_PATH = os.path.join(os.path.dirname(__file__), "weights", "audio_deepfake_model.keras")

# Initialize models
print("Starting Application and loading models...")
image_model = ImageDeepfakeDetector(IMAGE_VIDEO_MODEL_PATH)
image_model.load_model()

video_model = VideoDeepfakeDetector(IMAGE_VIDEO_MODEL_PATH)
video_model.load_model()

audio_model = AudioDeepfakeDetector(AUDIO_MODEL_PATH)
audio_model.load_model()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

from typing import Any

async def handle_media_upload(file: UploadFile, model: Any):
    try:
        # Create a unique filename to prevent collisions and save
        ext = file.filename.split('.')[-1]
        temp_filepath = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.{ext}")
        
        # Save file to disk
        content = await file.read()
        with open(temp_filepath, "wb") as f:
            f.write(content)
            
        # Run inference using the loaded model
        result = model.predict(temp_filepath)
        
        # Cleanup
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
            
        return result
        
    except Exception as e:
        print(f"Error processing upload: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error analyzing media.")


@app.post("/api/detect/image")
async def detect_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Expected image.")
    result = await handle_media_upload(file, image_model)
    return JSONResponse(content=result)

@app.post("/api/detect/video")
async def detect_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Expected video.")
    result = await handle_media_upload(file, video_model)
    return JSONResponse(content=result)

@app.post("/api/detect/audio")
async def detect_audio(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Expected audio.")
    result = await handle_media_upload(file, audio_model)
    return JSONResponse(content=result)

# Serve the static frontend assets
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"API is running on http://0.0.0.0:{port}")
    # NOTE: reload=True is disabled intentionally.
    # With reload=True, uvicorn re-imports the entire app on every file change,
    # which re-initializes TF models and causes inconsistent prediction states.
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
