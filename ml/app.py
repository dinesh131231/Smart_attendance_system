from flask import Flask, request, jsonify
from utils.image_preprocessor import base64_to_image
from recognize_face import recognize, load_model
from train_model import train
import os
import shutil
import base64

app = Flask(__name__)
 
DATASET_PATH = "dataset"

# delete student rout

@app.route("/delete-student/<person_name>", methods=["DELETE"])
def delete_student(person_name):
    try:
        person_path = os.path.join(DATASET_PATH, person_name)

        if not os.path.exists(person_path):
            return jsonify({"message": "Folder not found ❌"}), 404

        # 🔥 delete folder completely
        shutil.rmtree(person_path)

        return jsonify({"message": f"{person_name} deleted ✅"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# delete all

@app.route("/delete-all", methods=["DELETE"])
def delete_all():
    try:
        for person in os.listdir(DATASET_PATH):
            path = os.path.join(DATASET_PATH, person)

            if os.path.isdir(path):
                shutil.rmtree(path)

        return jsonify({"message": "All data deleted ✅"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/add-student", methods=["POST"])
def add_student():
    try:
        data = request.json

        name = data.get("name")
        images = data.get("images")

        if not name or not images:
            return jsonify({"error": "Missing data"}), 400

        # 📁 Create student folder
        student_path = os.path.join(DATASET_PATH, name)

        os.makedirs(student_path, exist_ok=True)

        saved_count = 0

        for i, img in enumerate(images):
            # remove base64 header if exists
            if "," in img:
                img = img.split(",")[1]

            img_bytes = base64.b64decode(img)

            file_path = os.path.join(student_path, f"{i}.jpg")

            with open(file_path, "wb") as f:
                f.write(img_bytes)

            saved_count += 1

        return jsonify({
            "message": f"{saved_count} images saved for {name}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ======================
# TRAIN API
# ======================


@app.route("/train", methods=["POST"])
def train_api():
    try:
        print("RAW BODY:", request.data) # 👈 add this
        print("CONTENT TYPE:", request.content_type)  # 👈 and this
        # data = request.get_json()
        data = request.get_json(silent=True)
        print("PARSED JSON:", data)

        name = data.get("name")
        roll = data.get("rollNumber")  # ✅ match frontend key
        images = data.get("images")

        if not name or not roll or not images:
            return jsonify({"error": "Missing name, roll, or images"}), 400

        train(name, roll, images)
        load_model()
        return jsonify({"message": "Model trained successfully"})
    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500
# ======================
# RECOGNIZE API
# ======================

@app.route("/recognize", methods=["POST"])
def recognize_api():

    data = request.json
    print("Received image data (first 100 chars):", data["image"][:100])

    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    image_data = data.get("image")
    frame = base64_to_image(image_data)

    results = recognize(frame)

    

    if len(results) == 0:
        return jsonify({"message": "No face detected"})

    return jsonify(results)
    


# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    app.run(port=5000, debug=True)