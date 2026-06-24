from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("../dyslexaid_model.pkl")

risk_labels = {
    0: "Low Risk",
    1: "Moderate Risk",
    2: "High Risk"
}

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

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
    app.run(debug=True)