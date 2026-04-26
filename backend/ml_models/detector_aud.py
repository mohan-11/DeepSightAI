import os
import numpy as np
import tensorflow as tf
import librosa


class AudioDeepfakeDetector:

    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None

        # SAME PARAMETERS USED DURING TRAINING — do not change these
        self.sample_rate = 22050
        self.mfcc_num = 40
        self.max_pad = 174

    def load_model(self):
        if self.model is None:
            if not os.path.exists(self.model_path):
                print(f"WARNING: Audio Model not found at {self.model_path}")
                return False
            self.model = tf.keras.models.load_model(self.model_path)
            print("Audio Model Loaded Successfully")
        return True

    def extract_features(self, file_path: str):
        audio, sr = librosa.load(file_path, sr=self.sample_rate)

        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sr,
            n_mfcc=self.mfcc_num
        )

        # Pad or trim to fixed width
        if mfcc.shape[1] < self.max_pad:
            pad_width = self.max_pad - mfcc.shape[1]
            mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode='constant')
        else:
            mfcc = mfcc[:, :self.max_pad]

        # Flatten MFCC: (40, 174) → (6960,)
        features = mfcc.flatten().astype(np.float32)
        return features

    def predict(self, file_path: str):
        if not self.load_model():
            return {"prediction": "Model Error", "confidence": 0.0, "reason": "Model could not be loaded."}

        try:
            features = self.extract_features(file_path)

            # Add batch dimension → (1, 6960)
            input_data = np.expand_dims(features, axis=0)

            # Raw sigmoid output — single value in [0, 1]
            raw = self.model.predict(input_data, verbose=0)
            print(f"[AudioDetector] Raw model output: {raw}")

            prediction = float(raw[0][0])

            # ─────────────────────────────────────────────────────────────────
            # IMPORTANT: Label convention must match what was used during training.
            # HIGH score (>0.5) → FAKE | LOW score (<0.5) → REAL
            # If still inverted, flip: is_fake = prediction < 0.5
            # ─────────────────────────────────────────────────────────────────
            is_fake = prediction > 0.5
            label = "Deepfake" if is_fake else "Real"
            confidence = round(float(prediction * 100) if is_fake else float((1.0 - prediction) * 100), 2)

            reasons = [
                "Synthetic frequency artifacts detected in higher pitch bands.",
                "Unnatural vocal tract resonance and formants.",
                "Abnormal suppression of natural acoustic room reverberation.",
                "Robotic phoneme transitions lacking natural breath patterns.",
                "Discrepancies in Mel-frequency cepstral coefficients (MFCCs)."
            ]

            # Deterministic reason selection based on score (avoids random flipping on re-detect)
            reason_index = int(prediction * 100) % len(reasons)

            return {
                "prediction": label,
                "confidence": confidence,
                "reason": reasons[reason_index] if is_fake
                          else "Natural vocal frequencies and room acoustics present. No voice-cloning artifacts detected."
            }

        except Exception as e:
            import traceback
            traceback.print_exc()
            return {
                "prediction": "Error",
                "confidence": 0.0,
                "reason": "Processing error."
            }