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
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Practice from "./pages/Practice";
import Login from "./pages/Login";
import Assessment from "./pages/Assessment";
import LetterRecognition from "./pages/LetterRecognition";
import WordMatching from "./pages/WordMatching";

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
        <Route path="/signup" element={<Signup />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route
          path="/letter-recognition"
          element={<LetterRecognition />}
        />
        <Route
          path="/word-matching"
          element={<WordMatching />}
        />
      </Routes>
    </div>
  );
}