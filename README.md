# 🧠 DyslexAid

<p align="center">
AI-powered web application designed to assist in the early screening of dyslexia through interactive assessments, progress tracking, and accessibility-focused learning tools.
</p>

---

## 📌 About

DyslexAid is an AI-powered platform that helps identify potential dyslexia risk using voice, letter recognition, and word recognition assessments. It also provides personalized practice sessions, progress tracking, and dedicated dashboards for students, parents, and teachers.

The platform aims to support early intervention and improve learning experiences through accessible technology.

---

## ✨ Features

- 🔐 Secure User Authentication
- 🧠 AI-based Dyslexia Risk Prediction
- 🎙️ Voice Recognition Assessment
- 🔤 Letter Recognition Test
- 📖 Word Recognition Test
- 📊 Student Progress Dashboard
- 👨‍👩‍👧 Parent Dashboard
- 👨‍🏫 Teacher Dashboard
- 📄 Downloadable PDF Reports
- ⭐ XP & Daily Goal Tracking
- 👁️ Focus Tracking using MediaPipe
- 📱 Responsive Modern UI

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Framer Motion

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning
- Scikit-learn
- Joblib

### Database & Services
- Firebase Authentication
- Firestore Database

### Deployment
- Vercel (Frontend)

---

## 📂 Project Structure

```
DyslexAid/
│── backend/
│── public/
│── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── utils/
│── package.json
│── vite.config.js
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/DevByPawan/DyslexAid.git
cd DyslexAid
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Run Frontend

```bash
npm run dev
```

### Run Backend

```bash
python app.py
```

---

## 🤖 Machine Learning Workflow

The prediction model evaluates three assessment scores:

- Voice Accuracy
- Letter Recognition Score
- Word Recognition Score

Based on these inputs, the model classifies users into:

- 🟢 Low Risk
- 🟡 Moderate Risk
- 🔴 High Risk

---

## 🔌 API

### POST `/predict`

Predicts dyslexia risk using assessment scores.

**Request**

```json
{
  "voiceAccuracy": 92,
  "letterScore": 88,
  "wordScore": 85
}
```

**Response**

```json
{
  "prediction": "Low Risk"
}
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Dashboard
- Assessment
- Practice Module
- Parent Dashboard
- Teacher Dashboard
- AI Report

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Happy Coding! 🚀