import cv2
import keras
import numpy as np
import traceback  # For error debugging
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Initialize image analysis history (store in-memory for simplicity)
image_history = []

try:
    print("🔄 Loading EfficientNetB0 model...")
    base_model = EfficientNetB0(weights="imagenet", include_top=False, pooling='avg')

    # Add custom top layer for binary classification (fake vs. real)
    x = base_model.output
    x = Dense(1, activation='sigmoid')(x)  # Binary classification
    model = Model(inputs=base_model.input, outputs=x)

    # Compile the model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    print("✅ Model Loaded Successfully!")
except Exception as e:
    print("❌ ERROR: Model failed to load!")
    print(traceback.format_exc())

# Function to preprocess the image before passing to the model
def preprocess_image(img_path):
    try:
        print(f"📷 Loading image from {img_path}")
        img = cv2.imread(img_path)

        if img is None:
            print("❌ ERROR: Failed to load image!")
            return None

        img_resized = cv2.resize(img, (224, 224))  # EfficientNet requires 224x224
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        img_array = image.img_to_array(img_rgb)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        return img_array
    except Exception as e:
        print("❌ ERROR in image preprocessing!")
        print(traceback.format_exc())
        return None

# Function to detect if the image is fake or real using the EfficientNetB0 model
def detect_fake_image(image_path):
    try:
        img_array = preprocess_image(image_path)
        if img_array is None:
            return {"error": "Invalid image format"}

        print("🤖 Making prediction...")
        predictions = model.predict(img_array)
        confidence = float(predictions[0][0])  # Convert to Python float

        print(f"📊 Prediction Output: {confidence}")

        fake_threshold = 0.5
        result = "Fake Image" if confidence < fake_threshold else "Real Image"

        return {"result": result, "confidence": round(confidence * 100, 2)}
    except Exception as e:
        print("❌ ERROR in detect_fake_image!")
        print(traceback.format_exc())
        return {"error": "Model failed to predict"}

# API endpoint to get image analysis history
@app.route("/get_image_history", methods=["GET"])
def get_image_history():
    return jsonify({"history": image_history})

# Flask route for the home page
@app.route('/')
def home():
    return "Welcome to Vigilant-AI! Use the /analyze-image endpoint to analyze images."

# Flask route for analyzing images (POST request)
@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        print("📂 Image received...")
        file = request.files['file']

        if not file:
            print("❌ ERROR: No file received!")
            return jsonify({"error": "No file uploaded"}), 400

        file_path = "temp_image.jpg"
        file.save(file_path)
        print(f"✅ Image saved as {file_path}")

        response = detect_fake_image(file_path)

        print(f"✅ Analysis Complete: {response}")

        # Save the result to history with a timestamp
        image_history.append({
            "image_filename": file.filename,
            "result": response["result"],
            "confidence": response["confidence"],
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

        return jsonify(response)
    
    except Exception as e:
        print("❌ ERROR in /analyze-image endpoint!")
        print(traceback.format_exc())
        return jsonify({"error": "Internal Server Error"}), 500

# Flask route for analyzing images from a URL (POST request)
@app.route('/analyze-image-url', methods=['POST'])
def analyze_image_url():
    try:
        data = request.get_json()
        image_url = data.get("imageUrl")

        if not image_url:
            return jsonify({"error": "No image URL provided"}), 400

        # Download Image
        response = requests.get(image_url, stream=True)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download image"}), 400

        # Convert Image to NumPy Array
        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        img_resized = cv2.resize(img, (224, 224))
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        img_array = image.img_to_array(img_rgb)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # Run AI Analysis
        prediction = model.predict(img_array)[0][0]
        confidence = round(float(prediction) * 100, 2)
        result = "Fake Image" if prediction < 0.5 else "Real Image"

        return jsonify({"result": result, "confidence": confidence})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    print("🚀 Starting Flask server on http://127.0.0.1:5001/")
    app.run(host="127.0.0.1", debug=True, port=5001)
