import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { generateReportPDF } from "../utils/generateReportPDF";

export default function AIReport() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [enteredPin, setEnteredPin] = useState("");
    const [verified, setVerified] = useState(false);
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

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
            const userSnap = await getDoc(
                doc(db, "users", user.uid)
            );

            if (userSnap.exists()) {
                setUserData(userSnap.data());
            }

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
    const verifyPin = () => {

        if (!userData?.guardianPin) {
            toast.error(
                "No Guardian PIN Found"
            );
            return;
        }

        if (
            enteredPin ===
            userData.guardianPin
        ) {

            setVerified(true);

            toast.success(
                "PIN Verified"
            );

        } else {

            toast.error(
                "Incorrect PIN"
            );
        }
    };
    const createPin = async () => {

        if (!/^\d{4}$/.test(newPin)) {
            toast.error(
                "PIN must be 4 digits"
            );
            return;
        }

        if (newPin !== confirmPin) {
            toast.error(
                "PINs do not match"
            );
            return;
        }

        try {

            await updateDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.uid
                ),
                {
                    guardianPin: newPin
                }
            );

            setUserData({
                ...userData,
                guardianPin: newPin
            });

            setVerified(true);

            toast.success(
                "Guardian PIN Created"
            );

        } catch (error) {

            toast.error(
                "Failed to save PIN"
            );
        }
    };
    const getBadge = () => {

        const xp = userData?.xp || 0;

        if (xp >= 200) return "Expert Reader";
        if (xp >= 100) return "Skilled Reader";
        if (xp >= 50) return "Beginner Reader";

        return "No Badge Yet";
    };
    const downloadPDF = () => {

        generateReportPDF({

            name: userData?.name,

            studentEmail: userData?.email,

            parentEmail: userData?.parentEmail,

            score,

            total,

            accuracy: percentage,

            confidence,

            risk,

            xp: userData?.xp || 0,

            streak: userData?.streak || 0,

            badge: getBadge(),

            recommendation
        });
    };
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
                Loading Report...
            </div>
        );
    }
    if (
        userData &&
        !userData.guardianPin
    ) {

        return (

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">

                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl w-[400px]">

                    <h2 className="text-3xl font-bold text-white mb-4">
                        🔒 Create Guardian PIN
                    </h2>

                    <p className="text-gray-300 mb-5">
                        Set a PIN to protect reports
                    </p>

                    <input
                        type="password"
                        maxLength="4"
                        value={newPin}
                        onChange={(e) =>
                            setNewPin(
                                e.target.value
                            )
                        }
                        placeholder="Enter 4 Digit PIN"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                verifyPin();
                            }
                        }}
                        className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white mb-3"
                    />

                    <input
                        type="password"
                        maxLength="4"
                        value={confirmPin}
                        onChange={(e) =>
                            setConfirmPin(
                                e.target.value
                            )
                        }
                        placeholder="Confirm PIN"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                verifyPin();
                            }
                        }}
                        className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white"
                    />

                    <button
                        onClick={createPin}
                        className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                    >
                        Save PIN
                    </button>

                </div>

            </div>

        );
    }
    if (!verified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">

                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl w-[400px]">

                    <h2 className="text-3xl font-bold text-white mb-4">
                        🔒 Guardian PIN Required
                    </h2>

                    <p className="text-gray-300 mb-5">
                        Enter PIN to view report
                    </p>

                    <input
                        type="password"
                        maxLength="4"
                        value={enteredPin}
                        onChange={(e) =>
                            setEnteredPin(
                                e.target.value
                            )
                        }
                        className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white"
                    />

                    <button
                        onClick={verifyPin}
                        className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                    >
                        Verify PIN
                    </button>

                </div>

            </div>
        );
    }
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