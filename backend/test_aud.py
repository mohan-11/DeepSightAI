import sys
sys.path.append('.')
from ml_models.detector_aud import AudioDeepfakeDetector
import numpy as np
import scipy.io.wavfile as wav

# Create empty dummy wav
wav.write('temp_uploads/dummy.wav', 22050, np.zeros(22050, dtype=np.int16))

model = AudioDeepfakeDetector('weights/audio_deepfake_detector.keras')
img_path = 'temp_uploads/dummy.wav'
with open('trace_aud.txt', 'w', encoding='utf-8') as f:
    try:
        f.write("Trying extract_features...\n")
        data = model.extract_features(img_path)
        f.write(f"Data shape: {data.shape}\n")
        f.write("Trying load_model...\n")
        model.load_model()
        f.write("Trying predict...\n")
        input_data = np.expand_dims(data, axis=0)
        pred = model.model.predict(input_data)
        f.write(f"Pred format: {pred}, Shape: {pred.shape}\n")
    except Exception as e:
        import traceback
        f.write(traceback.format_exc())
