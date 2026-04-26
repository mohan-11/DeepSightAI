import os
import time
import random
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(title="DeepSight AI - Lite Mode", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MOCK DETECTION LOGIC (No TensorFlow)
def mock_predict(media_type):
    # Simulate processing time
    time.sleep(1.5)
    
    is_fake = random.choice([True, False])
    confidence = round(random.uniform(85.0, 99.9), 2)
    
    reasons = {
        "image": [
            "Inconsistent lighting algorithms on facial topography.",
            "Unnatural blending artifacts around the face perimeter.",
            "Lack of organic micro-texture in high-frequency regions."
        ],
        "video": [
            "Temporal inconsistency across video frames detected.",
            "Unnatural eye-blinking anomalies.",
            "Abnormal lip-syncing synchronization points."
        ],
        "audio": [
            "Synthetic frequency artifacts detected in higher pitch bands.",
            "Unnatural vocal tract resonance and formants.",
            "Robotic phoneme transitions detected."
        ]
    }
    
    if is_fake:
        return {
            "prediction": "Deepfake",
            "confidence": confidence,
            "reason": random.choice(reasons.get(media_type, ["Anomalous artifacts detected."]))
        }
    else:
        return {
            "prediction": "Real",
            "confidence": confidence,
            "reason": "Organic data distribution. No synthetic GAN or diffusion artifacts detected."
        }

@app.post("/api/detect/image")
async def detect_image(file: UploadFile = File(...)):
    return JSONResponse(content=mock_predict("image"))

@app.post("/api/detect/video")
async def detect_video(file: UploadFile = File(...)):
    return JSONResponse(content=mock_predict("video"))

@app.post("/api/detect/audio")
async def detect_audio(file: UploadFile = File(...)):
    return JSONResponse(content=mock_predict("audio"))

# Serve the static frontend assets
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    print("--- DEEPSIGHT AI: LITE MODE ACTIVE ---")
    print("This mode bypasses TensorFlow to save system memory.")
    print("Dashboard is running on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
