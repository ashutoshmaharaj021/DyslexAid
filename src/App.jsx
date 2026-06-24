import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import AboutDyslexia from "./components/AboutDyslexia";
import WhyDyslexAid from "./components/WhyDyslexAid";
import HowItWorks from "./components/HowItWorks";
import DashboardPreview from "./components/DashboardPreview";
import ImpactStats from "./components/ImpactStats";
import AIScreening from "./pages/AIScreening";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Practice from "./pages/Practice";
import Login from "./pages/Login";
import Assessment from "./pages/Assessment";
import LetterRecognition from "./pages/LetterRecognition";
import WordMatching from "./pages/WordMatching";
import ScreeningTest from "./pages/ScreeningTest";
import AIReport from "./pages/AIReport";
import { Toaster } from "react-hot-toast";
import GuardianPin from "./pages/GuardianPin";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ScreeningVoice from "./pages/ScreeningVoice";
import ScreeningLetter from "./pages/ScreeningLetter";
import ScreeningWord from "./pages/ScreeningWord";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutDyslexia />
      <WhyDyslexAid />
      <HowItWorks />
      <Features />
      <DashboardPreview />
      <ImpactStats />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">

      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full"></div>
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1500,
            style: {
              fontSize: "18px",
              padding: "20px",
              minWidth: "450px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
            },
            success: {
              style: {
                border: "1px solid #22c55e",
              },
            },
            error: {
              style: {
                border: "1px solid #ef4444",
              },
            },
          }}
        />

        {/* Routes */}
      </>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/practice" element={<Practice />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/teacher-dashboard"
          element={<TeacherDashboard />}
        />

        <Route
          path="/parent-dashboard"
          element={<ParentDashboard />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/guardian-pin"
          element={<GuardianPin />}
        />
        <Route path="/ai-screening" element={<AIScreening />} />
        <Route path="/screening-voice" element={<ScreeningVoice />} />
        <Route path="/screening-letter" element={<ScreeningLetter />} />
        <Route path="/screening-word" element={<ScreeningWord />} />
        <Route path="/assessment" element={<Assessment />} />

        <Route
          path="/letter-recognition"
          element={<LetterRecognition />}
        />
        <Route path="/ai-report" element={<AIReport />} />
        <Route path="/screening-test" element={<ScreeningTest />} />
        <Route
          path="/word-matching"
          element={<WordMatching />}

        />
      </Routes>
    </div>
  );
}