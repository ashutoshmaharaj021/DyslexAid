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
import { onAuthStateChanged } from "firebase/auth";

export default function AIReport() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [enteredPin, setEnteredPin] = useState("");
    const [verified, setVerified] = useState(false);
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [mlRisk, setMlRisk] = useState("Loading...");

    const score = location.state?.score || 0;
    const total = location.state?.total || 10;

    const voiceScore =
        Number(localStorage.getItem("voiceScore")) || 0;

    const letterScore =
        Number(localStorage.getItem("letterScore")) || 0;

    const wordScore =
        Number(localStorage.getItem("wordScore")) || 0;
    const attentionScore =
        Number(localStorage.getItem("attentionScore")) || 0;

    const focusedSeconds =
        Number(localStorage.getItem("focusedSeconds")) || 0;

    const distractedSeconds =
        Number(localStorage.getItem("distractedSeconds")) || 0;
    const formatTime = (seconds) => {

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = seconds % 60;

        if (minutes === 0) {

            return `${remainingSeconds} sec`;

        }

        return `${minutes} min ${remainingSeconds} sec`;

    };


    const strengths = [];
    const improvements = [];
    let analysis = "";

    if (
        voiceScore >= 70 &&
        letterScore >= 5 &&
        wordScore >= 5
    ) {

        analysis =
            "The screening indicates strong reading fluency, accurate letter recognition, and good word identification skills. Overall dyslexia risk appears low.";

    }
    else if (
        voiceScore < 70 &&
        letterScore >= 5 &&
        wordScore >= 5
    ) {

        analysis =
            "Reading fluency challenges were observed during the voice assessment. Letter and word recognition remain strong.";

    }
    else if (
        letterScore < 5 &&
        wordScore >= 5
    ) {

        analysis =
            "Letter confusion patterns were detected. Additional letter recognition practice may be beneficial.";

    }
    else if (
        wordScore < 5 &&
        letterScore >= 5
    ) {

        analysis =
            "Word recognition difficulties were observed. Regular spelling and reading exercises are recommended.";

    }
    else {

        analysis =
            "Multiple screening indicators suggest reading and recognition difficulties. Structured support and continued monitoring are recommended.";
    }

    if (voiceScore >= 70)
        strengths.push("Reading Fluency");
    else
        improvements.push("Reading Fluency");

    if (letterScore >= 5)
        strengths.push("Letter Recognition");
    else
        improvements.push("Letter Recognition");

    if (wordScore >= 5)
        strengths.push("Word Recognition");
    else
        improvements.push("Word Recognition");

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
        onAuthStateChanged(auth, async (user) => {

            if (!user) {
                navigate("/login");
                return;
            }

            const userSnap = await getDoc(
                doc(db, "users", user.uid)
            );

            if (userSnap.exists()) {
                setUserData(userSnap.data());
            }

        });
        const getPrediction = async () => {

            try {

                const response = await fetch(
                    "https://dyslexaid-backend.onrender.com/predict",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            voiceAccuracy: voiceScore,
                            letterScore: letterScore,
                            wordScore: wordScore
                        })
                    }
                );

                const data = await response.json();

                setMlRisk(data.risk);
                const user = auth.currentUser;

                if (user) {

                    await updateDoc(
                        doc(db, "users", user.uid),
                        {
                            lastRisk: data.risk,
                            lastMlRisk: data.risk
                        }
                    );
                }

            } catch (error) {

                console.error(error);

                setMlRisk("Prediction Failed");
            }
        };

        const saveReport = async () => {

            const user = auth.currentUser;

            if (!user) {
                console.log("User not loaded yet");
                return;
            }
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


                        voiceScore,
                        letterScore,
                        wordScore,

                        lastAssessmentDate:
                            new Date().toISOString()
                    }
                );

            } catch (error) {
                console.error("Error saving report:", error);
            }
        };

        saveReport();
        getPrediction();
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

            risk: mlRisk,

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
                            {mlRisk}
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

                    <h2 className="text-2xl font-bold mb-6">
                        👀 Behavioral Analysis
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="bg-white/5 rounded-2xl p-4 text-center">

                            <p className="text-gray-400">
                                Attention Score
                            </p>

                            <h3 className="text-3xl font-bold text-cyan-400">
                                {attentionScore}%
                            </h3>

                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 text-center">

                            <p className="text-gray-400">
                                Focused Time
                            </p>

                            <h3 className="text-3xl font-bold text-green-400">
                                {formatTime(focusedSeconds)}
                            </h3>

                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 text-center">

                            <p className="text-gray-400">
                                Distracted Time
                            </p>

                            <h3 className="text-3xl font-bold text-red-400">
                                {formatTime(distractedSeconds)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                        <p className="text-gray-400">
                            Voice Accuracy
                        </p>

                        <h3 className="text-3xl font-bold text-cyan-400">
                            {voiceScore}%
                        </h3>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                        <p className="text-gray-400">
                            Letter Recognition
                        </p>

                        <h3 className="text-3xl font-bold text-pink-400">
                            {letterScore}/7
                        </h3>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                        <p className="text-gray-400">
                            Word Recognition
                        </p>

                        <h3 className="text-3xl font-bold text-green-400">
                            {wordScore}/7
                        </h3>
                    </div>

                </div>
                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        📋 AI Analysis
                    </h2>

                    <p className="text-gray-300 leading-relaxed">
                        {analysis}
                    </p>

                </div>



                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        ✅ Strength Areas
                    </h2>

                    <ul className="space-y-2 text-gray-300">
                        {
                            strengths.map((item, index) => (
                                <li key={index}>
                                    ✓ {item}
                                </li>
                            ))
                        }
                    </ul>

                </div>

                <div className="bg-white/5 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        📈 Areas for Improvement
                    </h2>

                    <ul className="space-y-2 text-gray-300">
                        {
                            improvements.length > 0 ? (
                                improvements.map((item, index) => (
                                    <li key={index}>
                                        • {item}
                                    </li>
                                ))
                            ) : (
                                <li>
                                    ✓ No major concerns detected
                                </li>
                            )
                        }
                    </ul>

                </div>

                <div className="bg-white/5 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        🤖 Why This Prediction?
                    </h2>

                    <ul className="space-y-2 text-gray-300">
                        {voiceScore < 70 && (
                            <li>• Voice reading accuracy below expected range</li>
                        )}

                        {letterScore < 5 && (
                            <li>• Letter recognition difficulties detected</li>
                        )}

                        {wordScore < 5 && (
                            <li>• Word recognition difficulties detected</li>
                        )}

                        {voiceScore >= 70 && (
                            <li>• Reading fluency is satisfactory</li>
                        )}

                        {letterScore >= 5 && (
                            <li>• Letter recognition performance is strong</li>
                        )}

                        {wordScore >= 5 && (
                            <li>• Word recognition performance is strong</li>
                        )}
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


                <div className="h-6"></div>
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