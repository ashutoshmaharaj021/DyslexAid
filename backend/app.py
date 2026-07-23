from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "dyslexaid_model.pkl")

model = joblib.load(MODEL_PATH)

risk_labels = {
    0: "Low Risk",
    1: "Moderate Risk",
    2: "High Risk"
}

@app.route("/")
def home():
    return jsonify({
        "message": "DyslexAid Backend is Running 🚀"
    })

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    voiceAccuracy = data["voiceAccuracy"]
    letterScore = data["letterScore"]
    wordScore = data["wordScore"]

    prediction = model.predict([
        [
            voiceAccuracy,
            letterScore,
            wordScore
        ]
    ])

    risk = risk_labels[int(prediction[0])]

    return jsonify({
        "risk": risk
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)