import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { generateReportPDF } from "../utils/generateReportPDF";
import toast from "react-hot-toast";

export default function ParentDashboard() {

    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [showReport, setShowReport] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [enteredPin, setEnteredPin] = useState("");

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    useEffect(() => {

        const fetchData = async () => {

            const currentUser = auth.currentUser;

            if (!currentUser) return;

            const usersSnap = await getDocs(
                collection(db, "users")
            );

            let linkedStudent = null;

            usersSnap.forEach((doc) => {

                const data = doc.data();

                if (
                    data.role === "student" &&
                    data.parentEmail === currentUser.email
                ) {
                    linkedStudent = data;
                }
            });

            if (linkedStudent) {
                setUserData(linkedStudent);
            }
        };

        fetchData();

    }, []);

    const getBadge = () => {

        const xp = userData?.xp || 0;

        if (xp >= 200) return "🥇 Expert Reader";
        if (xp >= 100) return "🥈 Skilled Reader";
        if (xp >= 50) return "🥉 Beginner Reader";

        return "No Badge Yet";
    };
    const verifyParentPin = () => {

        if (
            enteredPin ===
            userData?.guardianPin
        ) {

            setShowPinModal(false);

            setShowReport(true);

            setEnteredPin("");

        } else {

            toast.error(
                "Incorrect Guardian PIN"
            );
        }
    };

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">

                <div className="text-center">

                    <h1 className="text-3xl font-bold mb-4">
                        No Linked Student Found
                    </h1>

                    <p className="text-gray-400">
                        Ask the student to enter your email during signup.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <div className="flex justify-between items-center mb-10">

                <h1 className="text-5xl font-bold">
                    👨‍👩‍👧 Parent Dashboard
                </h1>

                <button
                    onClick={handleLogout}
                    className="px-5 py-3 rounded-xl bg-red-500/20 border border-red-400/30 hover:bg-red-500/30"
                >
                    Logout
                </button>

            </div>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mb-8">

                <h2 className="text-3xl font-bold mb-4">
                    👦 Linked Student
                </h2>

                <p className="text-xl">
                    Name: {userData?.name}
                </p>

                <p className="text-gray-400 mt-2">
                    Email: {userData?.email}
                </p>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">

                    <p className="text-gray-400">
                        🔥 Current Streak
                    </p>

                    <h2 className="text-5xl font-bold mt-3">
                        {userData?.streak || 0}
                    </h2>

                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">

                    <p className="text-gray-400">
                        ⭐ XP Earned
                    </p>

                    <h2 className="text-5xl font-bold mt-3">
                        {userData?.xp || 0}
                    </h2>

                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">

                    <p className="text-gray-400">
                        🏆 Badge
                    </p>

                    <h2 className="text-xl font-bold mt-3">
                        {getBadge()}
                    </h2>

                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">

                    <p className="text-gray-400">
                        🧠 Risk Level
                    </p>

                    <h2 className="text-2xl font-bold mt-3">
                        {userData?.lastRisk || "Not Assessed"}
                    </h2>

                </div>

            </div>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mt-8">

                <h2 className="text-3xl font-bold mb-4">
                    📋 Child Progress Summary
                </h2>

                <p className="text-gray-300 mb-2">
                    Current Streak: {userData?.streak || 0} Days
                </p>

                <p className="text-gray-300 mb-2">
                    Total XP Earned: {userData?.xp || 0}
                </p>

                <p className="text-gray-300 mb-2">
                    Badge Level: {getBadge()}
                </p>

                <p className="text-gray-300">
                    Risk Status: {userData?.lastRisk || "Not Assessed"}
                </p>

            </div>
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mt-8">

                <h2 className="text-3xl font-bold mb-4">
                    📄 Latest Assessment
                </h2>

                <p className="mb-2">
                    Accuracy:
                    {" "}
                    {userData?.lastAccuracy || 0}%
                </p>

                <p className="mb-2">
                    Risk:
                    {" "}
                    {userData?.lastRisk || "Not Assessed"}
                </p>

                <p>
                    Last Updated:
                    {" "}
                    {userData?.lastAssessmentDate
                        ? new Date(
                            userData.lastAssessmentDate
                        ).toLocaleDateString()
                        : "Never"}
                </p>
                <button
                    onClick={() =>
                        setShowPinModal(true)
                    }
                    className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                >
                    📄 View Child Report
                </button>
            </div>
            {showPinModal && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-slate-900 p-8 rounded-3xl w-[400px]">

                        <h2 className="text-2xl font-bold mb-4">
                            🔒 Guardian PIN Required
                        </h2>

                        <input
                            type="password"
                            maxLength="4"
                            value={enteredPin}
                            onChange={(e) =>
                                setEnteredPin(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    verifyParentPin();
                                }
                            }}
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white"
                        />

                        <button
                            onClick={verifyParentPin}
                            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                        >
                            Verify PIN
                        </button>

                    </div>

                </div>

            )}
            {showReport && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-slate-900 p-8 rounded-3xl w-[650px]">

                        <h2 className="text-3xl font-bold mb-6">
                            📄 Child Assessment Report
                        </h2>

                        <div className="space-y-3">

                            <p>
                                👤 Name:
                                {" "}
                                {userData?.name}
                            </p>

                            <p>
                                📧 Email:
                                {" "}
                                {userData?.email}
                            </p>

                            <p>
                                🎯 Accuracy:
                                {" "}
                                {userData?.lastAccuracy || 0}%
                            </p>

                            <p>
                                🧠 Risk:
                                {" "}
                                {userData?.lastRisk || "Not Assessed"}
                            </p>

                            <p>
                                🔥 Streak:
                                {" "}
                                {userData?.streak || 0}
                            </p>

                            <p>
                                ⭐ XP:
                                {" "}
                                {userData?.xp || 0}
                            </p>

                        </div>
                        <button
                            onClick={() => {

                                generateReportPDF({

                                    name: userData?.name,

                                    studentEmail:
                                        userData?.email,

                                    parentEmail:
                                        auth.currentUser?.email,

                                    score:
                                        userData?.lastScore || 0,

                                    total: 10,

                                    accuracy:
                                        userData?.lastAccuracy || 0,

                                    confidence: Math.min(
                                        95,
                                        Math.max(
                                            60,
                                            (userData?.lastAccuracy || 0) + 10
                                        )
                                    ),

                                    risk:
                                        userData?.lastRisk ||
                                        "Not Assessed",

                                    xp:
                                        userData?.xp || 0,

                                    streak:
                                        userData?.streak || 0,

                                    badge:
                                        getBadge(),

                                    recommendation:
                                        "Parent Access Copy"
                                });

                            }}
                            className="mt-6 mr-3 px-6 py-3 rounded-xl bg-green-500 text-black font-bold"
                        >
                            📄 Download PDF
                        </button>

                        <button
                            onClick={() =>
                                setShowReport(false)
                            }
                            className="mt-6 px-6 py-3 rounded-xl bg-red-500"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}
        </div>
    );
}