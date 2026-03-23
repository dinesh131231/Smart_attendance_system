import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models/face_model.yml")
DATASET_PATH = os.path.join(BASE_DIR, "dataset")

CASCADE_PATH = "haarcascade_frontalface_default.xml"