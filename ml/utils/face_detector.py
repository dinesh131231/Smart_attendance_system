import cv2
from config.config import CASCADE_PATH

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + CASCADE_PATH
)

def detect_faces(gray):

    # ✅ improve lighting (VERY IMPORTANT)
    gray = cv2.equalizeHist(gray)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,   # ✅ better detection
        minNeighbors=4,
        minSize=(60, 60)
    )

    print("Faces found:", len(faces))  # debug

    return faces