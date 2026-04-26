"""
diagnose_models.py
------------------
Run this script from the backend/ directory to check what your models output.

    python diagnose_models.py

It prints the RAW model outputs and tells you clearly whether the label
convention (fake vs real) is correct.
"""

import os
import sys
import numpy as np
import tensorflow as tf

WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")
IMAGE_VIDEO_MODEL = os.path.join(WEIGHTS_DIR, "deepfake_model.keras")
AUDIO_MODEL       = os.path.join(WEIGHTS_DIR, "audio_deepfake_model.keras")

# ─── Image / Video model ────────────────────────────────────────────────────
print("\n======= IMAGE / VIDEO MODEL =======")
if not os.path.exists(IMAGE_VIDEO_MODEL):
    print(f"  ❌ Not found: {IMAGE_VIDEO_MODEL}")
else:
    model = tf.keras.models.load_model(IMAGE_VIDEO_MODEL)
    print(f"  ✅ Loaded: {IMAGE_VIDEO_MODEL}")
    print(f"  Input shape:  {model.input_shape}")
    print(f"  Output shape: {model.output_shape}")
    
    # Feed random noise — just to see output range
    dummy = np.random.rand(1, 224, 224, 3).astype(np.float32)
    out = model.predict(dummy, verbose=0)
    print(f"  Random-noise output: {out}")
    
    # Feed all-zeros (very 'blank' image)
    zeros = np.zeros((1, 224, 224, 3), dtype=np.float32)
    out2 = model.predict(zeros, verbose=0)
    print(f"  All-zeros  output:   {out2}")
    
    print("""
  ─ How to read this:
    • If output shape is (1, 1) → sigmoid binary output
        - Raw value near 1.0 → model says FAKE (class 1)
        - Raw value near 0.0 → model says REAL (class 0)
    • If output shape is (1, 2) → softmax two-class output
        - output[0][1] near 1.0 → model says FAKE
        - output[0][0] near 1.0 → model says REAL
    
    ⚠️  If predictions are INVERTED (real shown as fake), the model was
       trained with flipped labels (0=FAKE, 1=REAL).
       In that case, open detector_img.py / detector_vid.py and change:
           is_fake = prediction > 0.5
       to:
           is_fake = prediction < 0.5
""")

# ─── Audio model ─────────────────────────────────────────────────────────────
print("\n======= AUDIO MODEL =======")
if not os.path.exists(AUDIO_MODEL):
    print(f"  ❌ Not found: {AUDIO_MODEL}")
else:
    amodel = tf.keras.models.load_model(AUDIO_MODEL)
    print(f"  ✅ Loaded: {AUDIO_MODEL}")
    print(f"  Input shape:  {amodel.input_shape}")
    print(f"  Output shape: {amodel.output_shape}")
    
    # Feed random noise — mfcc.flatten() → 40*174 = 6960 features
    expected_features = 40 * 174  # = 6960
    dummy_audio = np.random.rand(1, expected_features).astype(np.float32)
    out3 = amodel.predict(dummy_audio, verbose=0)
    print(f"  Random-noise output: {out3}")
    
    print("""
  ─ How to read this:
    • If output shape is (1, 1) → sigmoid binary output
        - Raw value near 1.0 → model says FAKE
        - Raw value near 0.0 → model says REAL
    
    ⚠️  If predictions are INVERTED, open detector_aud.py and change:
           is_fake = prediction > 0.5
       to:
           is_fake = prediction < 0.5
""")

print("\n✅ Diagnosis complete. Use the notes above to confirm label convention.")
