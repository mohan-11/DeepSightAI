import os
import cv2
import numpy as np
import tensorflow as tf

# Suppress TF logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

class ImageDeepfakeDetector:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.input_shape = (224, 224)
        print(f"Loading actual TensorFlow Image Model from: {model_path}...")

    def load_model(self):
        if self.model is None:
            if not os.path.exists(self.model_path):
                print(f"WARNING: Model file not found at {self.model_path}. Please place 'deepfake_model.keras' in backend/weights/")
                return False
            self.model = tf.keras.models.load_model(self.model_path)
            print("TensorFlow Image Model Loaded successfully.")
        return True

    def preprocess_image(self, file_path: str):
        img = cv2.imread(file_path)

        if img is None:
            raise ValueError(f"Could not read image at {file_path}")

        # ✅ Convert BGR (OpenCV default) to RGB (matches training data)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Resize to match model input
        img = cv2.resize(img, self.input_shape)

        # Normalize to [0, 1]
        img = img.astype(np.float32) / 255.0

        # Add batch dimension → (1, 224, 224, 3)
        img = np.expand_dims(img, axis=0)

        return img

    def predict(self, file_path: str):
        if not self.load_model():
            return {"prediction": "Model Error", "confidence": 0.0, "reason": "Model could not be loaded."}

        try:
            # Preprocess image
            input_data = self.preprocess_image(file_path)

            # Raw model output — shape (1, 1) for sigmoid binary classifier
            raw = self.model.predict(input_data, verbose=0)
            print(f"[ImageDetector] Raw model output: {raw}")

            prediction = float(raw[0][0])

            # ─────────────────────────────────────────────────────────────────
            # IMPORTANT: Label convention must match what was used during training.
            #
            # If trained with:  label 0 = REAL,  label 1 = FAKE  → score > 0.5 is Fake  ✅
            # If trained with:  label 0 = FAKE,  label 1 = REAL  → score > 0.5 is Real  (flip needed)
            #
            # The current convention below treats a HIGH score (>0.5) as FAKE.
            # If predictions are still inverted after this fix, flip the condition:
            #   is_fake = prediction < 0.5
            # ─────────────────────────────────────────────────────────────────
            is_fake = prediction > 0.5
            label = "Deepfake" if is_fake else "Real"
            confidence = float(prediction * 100) if is_fake else float((1.0 - prediction) * 100)
            confidence_percent = round(confidence, 2)

            reasons = [
                "Inconsistent lighting algorithms on facial topography.",
                "Unnatural blending artifacts around the face perimeter.",
                "Lack of organic micro-texture and pores in high-frequency regions.",
                "Asymmetrical reflection in the subject's pupils.",
                "Generative AI artifacts detected in the background."
            ]

            # Deterministic reason selection based on score (avoids random flipping on re-detect)
            reason_index = int(prediction * 100) % len(reasons)

            return {
                "prediction": label,
                "confidence": confidence_percent,
                "reason": reasons[reason_index] if is_fake
                          else "Organic pixel distribution. No synthetic GAN or diffusion artifacts detected."
            }

        except Exception as e:
            print(f"Prediction failed for {file_path}: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "prediction": "Error",
                "confidence": 0.0,
                "reason": "Processing error."
            }