import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    addDoc,
    collection,
    serverTimestamp
} from "firebase/firestore";
import toast from "react-hot-toast";


export default function Dashboard() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const [permissions, setPermissions] = useState(null);
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };
    useEffect(() => {
        const fetchUserData = async () => {

            const user = auth.currentUser;

            if (!user) return;

            const docRef = doc(db, "users", user.uid);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                setUserData(data);


            }
            const permissionRef = doc(
                db,
                "permissions",
                user.uid
            );

            const permissionSnap =
                await getDoc(permissionRef);

            if (permissionSnap.exists()) {

                setPermissions(
                    permissionSnap.data()
                );

            } else {

                await setDoc(permissionRef, {
                    parentAccess: true,
                    teacherAccess: false,
                    consentGiven: false,
                });

                setPermissions({
                    parentAccess: true,
                    teacherAccess: false,
                    consentGiven: false,
                });
            }
        };

        fetchUserData();
    }, []);

    const addLog = async (action) => {

        try {

            await addDoc(
                collection(db, "activityLogs"),
                {
                    userId: auth.currentUser.uid,
                    action,
                    timestamp: serverTimestamp(),
                }
            );

        } catch (error) {
            console.log(error);
        }
    };
    const updatePermission = async (
        field,
        value
    ) => {
        try {

            await updateDoc(
                doc(
                    db,
                    "permissions",
                    auth.currentUser.uid
                ),
                {
                    [field]: value
                }
            );

            setPermissions({
                ...permissions,
                [field]: value
            });
            await addLog(
                `${field} changed to ${value}`
            );
            toast.success(
                "Permission Updated"
            );

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const getBadge = () => {
        const xp = userData?.xp || 0;

        if (xp >= 200) return "🥇 Expert Reader";
        if (xp >= 100) return "🥈 Skilled Reader";
        if (xp >= 50) return "🥉 Beginner Reader";

        return "No Badge Yet";
    };
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

                {/* Header */}
                <div className="mb-10 flex justify-between items-start">

                    <div>
                        <h1 className="text-5xl font-bold mb-3">
                            Welcome Back {userData?.name || "User"} 👋
                        </h1>

                        <p className="text-cyan-300 text-lg mb-2">
                            {user?.email}
                        </p>

                        <p className="text-gray-300 text-lg">
                            Continue your dyslexia improvement journey.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-3 rounded-xl bg-red-500/20 border border-red-400/30 hover:bg-red-500/30"
                    >
                        Logout
                    </button>

                </div>

                {/* Top Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                        <p className="text-gray-400 mb-2">🔥 Current Streak</p>
                        <h2 className="text-4xl font-bold">
                            {userData?.streak ?? 0}
                        </h2>
                        <p className="text-gray-400 mt-2">Days</p>
                    </div>

                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                        <p className="text-gray-400 mb-2">⭐ XP Points</p>
                        <h2 className="text-4xl font-bold">
                            {userData?.xp ?? 0}
                        </h2>
                        <p className="text-gray-400 mt-2">XP Earned</p>
                        <p className="text-cyan-300 text-sm mt-2">
                            {userData?.xp < 50
                                ? `Need ${50 - (userData?.xp || 0)} XP for Beginner Badge`
                                : userData?.xp < 100
                                    ? `Need ${100 - userData.xp} XP for Skilled Badge`
                                    : userData?.xp < 200
                                        ? `Need ${200 - userData.xp} XP for Expert Badge`
                                        : "Max Badge Achieved 🚀"}
                        </p>
                    </div>

                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                        <p className="text-gray-400 mb-2">🎯 Daily Goal</p>
                        <h2 className="text-4xl font-bold">60%</h2>

                        <div className="w-full bg-white/10 h-3 rounded-full mt-4">
                            <div className="w-3/5 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400"></div>
                        </div>
                    </div>

                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                        <p className="text-gray-400 mb-2">🏆 Badges</p>
                        <h2 className="text-2xl font-bold">
                            {getBadge()}
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Achievement Level
                        </p>
                    </div>

                </div>

                {/* Main Section */}
                {/* Main Section */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* AI Screening */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">

                        <h2 className="text-3xl font-bold mb-4">
                            🧠 AI Screening
                        </h2>

                        <p className="text-gray-300 mb-4">
                            Generate your dyslexia risk report using AI.
                        </p>

                        <p className="text-cyan-300 mb-6">
                            Status: {userData?.lastRisk ?? "Not Evaluated"}
                        </p>

                        <button
                            onClick={() => navigate("/ai-screening")}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                        >
                            Start Screening
                        </button>

                    </div>

                    {/* Continue Practice */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">

                        <h2 className="text-3xl font-bold mb-4">
                            Continue Practice
                        </h2>

                        <p className="text-gray-300 mb-6">
                            Complete today's exercises and maintain your streak.
                        </p>

                        <Link
                            to="/practice"
                            className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                        >
                            Start Practice
                        </Link>

                    </div>

                    {/* Last Assessment */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">

                        <h2 className="text-2xl font-bold mb-4">
                            🧠 Last Assessment
                        </h2>

                        <p className="text-gray-300 mb-3">
                            Reading Accuracy
                        </p>

                        <h3 className="text-4xl font-bold mb-6">
                            {userData?.lastAccuracy ?? 0}%
                        </h3>

                        <span className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/20">
                            {userData?.lastRisk ?? "Not Assessed"}
                        </span>

                        <p className="text-gray-400 mt-4">
                            Last Updated:
                            {userData?.lastAssessmentDate
                                ? new Date(userData.lastAssessmentDate).toLocaleDateString()
                                : "Never"}
                        </p>

                    </div>

                </div>
                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-6">
                        🔒 Privacy Settings
                    </h2>

                    <div className="space-y-4">

                        <label className="flex gap-3">

                            <input
                                type="checkbox"
                                checked={
                                    permissions?.parentAccess || false
                                }
                                onChange={(e) =>
                                    updatePermission(
                                        "parentAccess",
                                        e.target.checked
                                    )
                                }
                            />

                            Share with Parents

                        </label>

                        <label className="flex gap-3">

                            <input
                                type="checkbox"
                                checked={
                                    permissions?.teacherAccess || false
                                }
                                onChange={(e) =>
                                    updatePermission(
                                        "teacherAccess",
                                        e.target.checked
                                    )
                                }
                            />

                            Share with Teachers

                        </label>

                    </div>

                </div>
            </div>

        </>
    );
}