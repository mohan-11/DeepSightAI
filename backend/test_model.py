import sys
sys.path.append('.')
from ml_models.detector_img import ImageDeepfakeDetector

model = ImageDeepfakeDetector('weights/deepfake_model.keras')
img_path = r'C:\Users\mohan\.gemini\antigravity\brain\9e393ebd-a97c-4f77-8b58-d532f97a2486\fake_image_test_1772901837471.png'
with open('trace.txt', 'w', encoding='utf-8') as f:
    try:
        f.write("Trying preprocess_image...\n")
        data = model.preprocess_image(img_path)
        f.write(f"Data shape: {data.shape}\n")
        f.write("Trying load_model...\n")
        model.load_model()
        f.write("Trying predict...\n")
        pred = model.model.predict(data)
        f.write(f"Pred format: {pred}, Shape: {pred.shape}\n")
    except Exception as e:
        import traceback
        f.write(traceback.format_exc())
