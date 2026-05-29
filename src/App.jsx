import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

import Login from "./pages/Login";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Dashboard />
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

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}