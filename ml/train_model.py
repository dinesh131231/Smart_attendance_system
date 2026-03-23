import cv2
import numpy as np
import os
import json
import base64
import time

from config.config import DATASET_PATH, MODEL_PATH
from utils.face_detector import face_cascade  # ✅ import your cascade

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

def train(name, roll, images):

    # ✅ Bug 1 fix - normalize folder name
    person_name = f"{name.strip().lower()}_{roll.strip()}"
    person_path = os.path.join(DATASET_PATH, person_name)
    os.makedirs(person_path, exist_ok=True)

    # 🔥 STEP 1: SAVE NEW IMAGES
    for i, img_data in enumerate(images):
        try:
            img_data = img_data.split(",")[1]
            img_bytes = base64.b64decode(img_data)
            img_array = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

            if img is None:
                continue

            # ✅ Bug 3 fix - detect and crop face before saving
            img = cv2.equalizeHist(img)
            detected = face_cascade.detectMultiScale(img, scaleFactor=1.1, minNeighbors=4, minSize=(60, 60))

            if len(detected) == 0:
                print(f"⚠️ No face in image {i}, skipping")
                continue

            x, y, w, h = detected[0]
            face = img[y:y+h, x:x+w]             # ✅ crop face
            face = resize_with_padding(face, 200)  # ✅ then resize

            img_name = f"{int(time.time() * 1000)}.jpg"
            cv2.imwrite(os.path.join(person_path, img_name), face)

        except Exception as e:
            print("Image error:", e)

    # 🔥 STEP 2: TRAIN FROM FULL DATASET
    faces = []
    labels = []
    label_map = {}
    current_label = 0

    for person in os.listdir(DATASET_PATH):
        if "_" not in person:
            continue

        path = os.path.join(DATASET_PATH, person)
        if not os.path.isdir(path):
            continue

        label_map[current_label] = person  # ✅ Bug 2 fix - uncomment this!

        for img_name in os.listdir(path):
            if not img_name.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            img_path = os.path.join(path, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

            if img is None:
                continue

            img = resize_with_padding(img, 200)  # ✅ consistent sizing
            faces.append(img)
            labels.append(current_label)

        current_label += 1

    if len(faces) == 0:
        print("❌ No images found")
        return

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.train(faces, np.array(labels))

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    recognizer.save(MODEL_PATH)

    labels_path = os.path.join(os.path.dirname(MODEL_PATH), "labels.json")
    with open(labels_path, "w") as f:
        json.dump(label_map, f, indent=4)

    print("✅ Model trained successfully")
    print("📌 Labels:", label_map)



# import cv2
# import numpy as np
# import os
# import json
# import base64
# import time

# from config.config import DATASET_PATH, MODEL_PATH

# LABELS_PATH = "labels.json"

# def load_labels():
#     if os.path.exists(LABELS_PATH):
#         with open(LABELS_PATH, "r") as f:
#             return json.load(f)
#     return {}

# def get_or_create_label(name, roll):
#     labels = load_labels()

#     for label_id, data in labels.items():
#         if data["name"] == name and data["roll"] == roll:
#             return int(label_id)

#     new_id = len(labels)
#     labels[new_id] = {"name": name, "roll": roll}

#     with open(LABELS_PATH, "w") as f:
#         json.dump(labels, f)

#     return new_id

# def train(name, roll, images):
   
#     person_name = f"{name.strip().lower()}_{roll.strip()}"  # ✅ normalize   # 👈 unique folder
#     person_path = os.path.join(DATASET_PATH, person_name)

#     # ✅ create folder if not exists
#     os.makedirs(person_path, exist_ok=True)

#     # 🔥 STEP 1: SAVE NEW IMAGES (APPEND)
#     #existing_count = len(os.listdir(person_path))  # ✅ get once

#     for i, img_data in enumerate(images):
#         try:
#             img_data = img_data.split(",")[1]
#             img_bytes = base64.b64decode(img_data)

#             img_array = np.frombuffer(img_bytes, np.uint8)
#             img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

#             if img is None:
#                 continue

#             def resize_with_padding(img, size=200):
#                 h, w = img.shape[:2]

#                 # ✅ scale based on the larger dimension
#                 scale = size / max(h, w)
#                 new_w = int(w * scale)
#                 new_h = int(h * scale)

#                 resized = cv2.resize(img, (new_w, new_h))

#                 # ✅ create blank square canvas
#                 canvas = np.zeros((size, size), dtype=np.uint8)

#              # ✅ paste resized image in center
#                 x_offset = (size - new_w) // 2
#                 y_offset = (size - new_h) // 2
#                 canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized

#                 return canvas
#             img = resize_with_padding(img, size=200)

#             # img = cv2.resize(img, (200, 200))

#             # ✅ FIXED unique filename
#             img_name = f"{int(time.time() * 1000)}.jpg"

#             cv2.imwrite(os.path.join(person_path, img_name), img)

#         except Exception as e:
#             print("Image error:", e)

#     # 🔥 STEP 2: TRAIN FROM FULL DATASET (your old logic)
#     faces = []
#     labels = []

#     label_map = {}
#     current_label = 0

#     for person in os.listdir(DATASET_PATH):
#         if "_" not in person:   # ❌ skip old folders
#             continue

#         path = os.path.join(DATASET_PATH, person)

#         if not os.path.isdir(path):
#             continue

#         # label_map[current_label] = person

#         for img_name in os.listdir(path):
#             if not img_name.lower().endswith((".png", ".jpg", ".jpeg")):
#                 continue

#             img_path = os.path.join(path, img_name)
#             img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

#             if img is None:
#                 continue

#             img = cv2.resize(img, (200, 200))

#             faces.append(img)
#             labels.append(current_label)

#         current_label += 1

#     if len(faces) == 0:
#         print("❌ No images found")
#         return

#     recognizer = cv2.face.LBPHFaceRecognizer_create()
#     recognizer.train(faces, np.array(labels))

#     os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
#     recognizer.save(MODEL_PATH)

#     labels_path = os.path.join(os.path.dirname(MODEL_PATH), "labels.json")

#     with open(labels_path, "w") as f:
#         json.dump(label_map, f, indent=4)

#     print("✅ Model trained successfully")
#     print("📌 Labels:", label_map)





# def train():
#     faces = []
#     labels = []

#     label_map = {}
#     current_label = 0

#     # ✅ Check dataset exists
#     if not os.path.exists(DATASET_PATH):
#         print("❌ Dataset folder not found")
#         return

#     for person in os.listdir(DATASET_PATH):
#         person_path = os.path.join(DATASET_PATH, person)

#         if not os.path.isdir(person_path):
#             continue

#         # ✅ map label → real name
#         label_map[current_label] = person

#         for img_name in os.listdir(person_path):
#             img_path = os.path.join(person_path, img_name)

#             # ✅ skip non-image files
#             if not img_name.lower().endswith((".png", ".jpg", ".jpeg")):
#                 continue

#             img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

#             if img is None:
#                 continue

#             # ✅ resize for consistency (VERY IMPORTANT)
#             img = cv2.resize(img, (200, 200))

#             faces.append(img)
#             labels.append(current_label)

#         current_label += 1

#     if len(faces) == 0:
#         print("❌ No images found")
#         return

#     # ✅ create recognizer
#     recognizer = cv2.face.LBPHFaceRecognizer_create()

#     # ✅ train model
#     recognizer.train(faces, np.array(labels))

#     # ✅ ensure models folder exists
#     os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

#     # ✅ save model
#     recognizer.save(MODEL_PATH)

#     # ✅ save labels.json (with proper formatting)
#     labels_path = os.path.join(os.path.dirname(MODEL_PATH), "labels.json")

#     with open(labels_path, "w") as f:
#         json.dump(label_map, f, indent=4)

#     print("✅ Model trained successfully")
#     print("📌 Labels:", label_map)