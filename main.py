import os
import requests
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from flask_cors import CORS
import datetime

# Enable CORS for all routes
load_dotenv()

# Flask App
app = Flask(__name__, template_folder="templates")
CORS(app, origins="http://127.0.0.1:5000")  # Allow only frontend to access the API

# Hugging Face API URL & Token
HF_API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")  # Store token in .env

HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}

# Initialize history for fact-checking (store in-memory for simplicity)
fact_history = []

# Function to check facts using Hugging Face API
def check_fact_with_api(claim: str):
    payload = {"inputs": f"Analyze this statement: {claim}.\n Check if it is true or not .Give your analysis and reasoning. "}
    response = requests.post(HF_API_URL, headers=HEADERS, json=payload)

    if response.status_code == 200:
        return response.json()[0]["generated_text"]
    else:
        return f"Error: {response.status_code}, {response.text}"

# Serve the frontend
@app.route("/")
def index():
    return render_template("index.html")

# API Endpoint to check a fact
@app.route("/check_fact", methods=["GET"])
def check_fact():
    claim = request.args.get("claim")
    if not claim:
        return jsonify({"error": "No claim provided"}), 400

    result = check_fact_with_api(claim)

    # Add the fact-check result to history
    fact_history.append({
        "claim": claim,
        "analysis": result,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    return jsonify({"claim": claim, "analysis": result})

# API Endpoint to get fact-checking history
@app.route("/get_fact_history", methods=["GET"])
def get_fact_history():
    return jsonify({"history": fact_history})

# Run Flask App
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
