import cv2
import os
import json
import numpy as np

from utils.image_preprocessor import to_gray
from utils.face_detector import detect_faces
from config.config import MODEL_PATH

recognizer = cv2.face.LBPHFaceRecognizer_create()

def resize_with_padding(img, size=200):
    h, w = img.shape[:2]
    scale = size / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)
    resized = cv2.resize(img, (new_w, new_h))
    canvas = np.zeros((size, size), dtype=np.uint8)
    x_offset = (size - new_w) // 2
    y_offset = (size - new_h) // 2
    canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
    return canvas

def load_model():
    if os.path.exists(MODEL_PATH):
        recognizer.read(MODEL_PATH)
    else:
        print("⚠️ Model not found")

def load_labels():
    if os.path.exists("models/labels.json"):
        with open("models/labels.json", "r") as f:
            label_map = json.load(f)
        return {int(k): v for k, v in label_map.items()}
    return {}

load_model()

THRESHOLD = 100  # ✅ lowered from 110
label_map = load_labels()

def recognize(frame):
    # frame = cv2.flip(frame, 1)  # ✅ flip first
    gray = to_gray(frame)       # ✅ then convert

    faces = detect_faces(gray)
    print("Faces found:", len(faces))

    # label_map = load_labels()
    results = []

    for (x, y, w, h) in faces:
        face = gray[y:y+h, x:x+w]
        face = resize_with_padding(face, 200)  # ✅ match training resize
        # face = cv2.GaussianBlur(face, (5, 5), 0)

        label, confidence = recognizer.predict(face)
        print("Label:", label, "Confidence:", confidence)

        if confidence > THRESHOLD:
            results.append({
                "label": "Unknown",
                "confidence": float(confidence),
                "valid": False
            })
        else:
            name = label_map.get(label, "Unknown")
            results.append({
                "label": name,
                "confidence": float(confidence),
                "valid": True
            })

    return results




# import cv2
# import os
# import json

# from utils.image_preprocessor import to_gray
# from utils.face_detector import detect_faces
# from config.config import MODEL_PATH

# recognizer = cv2.face.LBPHFaceRecognizer_create()

# # 🔄 load model
# def load_model():
#     if os.path.exists(MODEL_PATH):
#         recognizer.read(MODEL_PATH)
#     else:
#         print("⚠️ Model not found")


# # 🔄 load labels dynamically (IMPORTANT)
# def load_labels():
#     if os.path.exists("models/labels.json"):
#         with open("models/labels.json", "r") as f:
#             label_map = json.load(f)

#         # convert keys to int
#         return {int(k): v for k, v in label_map.items()}
    
#     return {}


# load_model()


# def recognize(frame):
#     gray = to_gray(frame)
#     frame = cv2.flip(frame, 1)  # fix webcam mirror

#     faces = detect_faces(gray)  # ✅ already correct

#     print("Faces found:", len(faces))  # ✅ ADD HERE

#     label_map = load_labels()
#     results = []

#     for (x, y, w, h) in faces:

#         face = gray[y:y+h, x:x+w]
#         face = cv2.resize(face, (200, 200))
#         face = cv2.GaussianBlur(face, (5, 5), 0)

#         # ✅ ADD THESE DEBUG LINES HERE
#         label, confidence = recognizer.predict(face)
#         print("Label:", label, "Confidence:", confidence)

        

#         # if confidence > 120:
#         #     results.append({
#         #         "label": "Unknown",
#         #         "confidence": float(confidence)
#         #     })
#         # else:
#         #     name = label_map.get(label, "Unknown")
#         #     results.append({
#         #         "label": name,
#         #         "confidence": float(confidence
#         #         )
#         #     })
#         THRESHOLD = 110   # strict (lower = better accuracy)

#         if confidence > THRESHOLD:
#             results.append({
#                 "label": "Unknown",
#                 "confidence": float(confidence),
#                 "valid": False   # ❌ not reliable
#             })
#         else:
#             name = label_map.get(label, "Unknown")

#             results.append({
#                 "label": name,
#                 "confidence": float(confidence),
#                 "valid": True    # ✅ reliable
#             })

#     return results