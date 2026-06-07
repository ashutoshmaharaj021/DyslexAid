import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function AIReport() {
    const location = useLocation();
    const navigate = useNavigate();

    const score = location.state?.score || 0;
    const total = location.state?.total || 10;

    const percentage = Math.round((score / total) * 100);
    const confidence = Math.min(
        95,
        Math.max(60, percentage + 10)
    );

    let risk = "";
    let color = "";
    let recommendation = "";

    if (percentage >= 80) {
        risk = "Low Risk";
        color = "text-green-400";
        recommendation =
            "Keep practicing regularly and continue building reading confidence.";
    } else if (percentage >= 50) {
        risk = "Moderate Risk";
        color = "text-yellow-400";
        recommendation =
            "Regular reading, spelling and letter-recognition exercises are recommended.";
    } else {
        risk = "High Risk";
        color = "text-red-400";
        recommendation =
            "Additional support and structured dyslexia-focused practice may be beneficial.";
    }
    useEffect(() => {

        const saveReport = async () => {

            const user = auth.currentUser;

            if (!user) return;

            try {

                await updateDoc(
                    doc(db, "users", user.uid),
                    {
                        lastScore: score,
                        lastAccuracy: percentage,
                        lastRisk: risk,
                        lastAssessmentDate: new Date().toISOString()
                    }
                );

            } catch (error) {
                console.error("Error saving report:", error);
            }
        };

        saveReport();

    }, []);
    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("DyslexAid AI Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Score: ${score}/${total}`, 20, 40);
        doc.text(`Accuracy: ${percentage}%`, 20, 50);
        doc.text(`Confidence: ${confidence}%`, 20, 60);
        doc.text(`Risk Level: ${risk}`, 20, 70);

        doc.text("Recommendation:", 20, 90);
        doc.text(recommendation, 20, 100);

        doc.save("DyslexAid_Report.pdf");
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8 flex items-center justify-center">

            <div className="max-w-4xl w-full backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-10">

                <h1 className="text-5xl font-bold mb-8 text-center">
                    🧠 AI Dyslexia Report
                </h1>

                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white/5 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 mb-2">
                            Score
                        </p>

                        <h2 className="text-4xl font-bold">
                            {score}/{total}
                        </h2>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 mb-2">
                            Accuracy
                        </p>

                        <h2 className="text-4xl font-bold">
                            {percentage}%
                        </h2>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 text-center">

                        <p className="text-gray-400 mb-2">
                            Confidence
                        </p>

                        <h2 className="text-4xl font-bold text-cyan-400">
                            {confidence}%
                        </h2>

                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 mb-2">
                            Risk Level
                        </p>

                        <h2 className={`text-3xl font-bold ${color}`}>
                            {risk}
                        </h2>
                    </div>


                </div>
                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        📊 Screening Performance
                    </h2>

                    <div className="w-full bg-white/10 h-4 rounded-full">

                        <div
                            className="h-4 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400"
                            style={{
                                width: `${percentage}%`
                            }}
                        />

                    </div>

                    <p className="text-gray-300 mt-4">
                        Overall Assessment Score: {percentage}%
                    </p>

                </div>
                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        📋 AI Analysis
                    </h2>

                    <p className="text-gray-300 leading-relaxed">
                        Based on the screening assessment, the AI model
                        evaluated your responses and generated a preliminary
                        dyslexia risk assessment.
                    </p>

                </div>



                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        ✅ Strength Areas
                    </h2>

                    <ul className="space-y-3 text-gray-300">

                        <li>✓ Word Recognition</li>

                        <li>✓ Pattern Matching</li>

                        <li>✓ Visual Identification</li>

                    </ul>

                </div>

                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        📈 Areas for Improvement
                    </h2>

                    <ul className="space-y-3 text-gray-300">

                        <li>• Letter Confusion Reduction</li>

                        <li>• Reading Fluency</li>

                        <li>• Spelling Accuracy</li>

                    </ul>

                </div>

                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        💡 Recommendation
                    </h2>

                    <p className="text-gray-300">
                        {recommendation}
                    </p>

                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={downloadPDF}
                        className="px-8 py-4 rounded-2xl bg-green-500 text-black font-bold"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                    >
                        Back to Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/practice")}
                        className="px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/10"
                    >
                        Start Practice
                    </button>

                </div>

            </div>

        </div>
    );
}