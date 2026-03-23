import base64
import numpy as np
import cv2


def to_gray(frame):
    return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

def base64_to_image(image_data):

    # ✅ remove header if exists
    if "," in image_data:
        image_data = image_data.split(",")[1]

    # ✅ decode full string (NOT index)
    img_bytes = base64.b64decode(image_data)

    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    return img