import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    doc,
    getDoc,
    addDoc
} from "firebase/firestore";
import { generateReportPDF } from "../utils/generateReportPDF";
import toast from "react-hot-toast";

export default function TeacherDashboard() {

    const navigate = useNavigate();
    const [totalStudents, setTotalStudents] = useState(0);
    const [sharedReports, setSharedReports] = useState(0);
    const [activityCount, setActivityCount] = useState(0);
    const [recentLogs, setRecentLogs] = useState([]);
    const [teacherStudents, setTeacherStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [enteredPin, setEnteredPin] = useState("");
    const [loading, setLoading] = useState(true);
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };
    useEffect(() => {

        const fetchStats = async () => {

            // Students
            const usersSnap = await getDocs(
                collection(db, "users")
            );

            let students = 0;

            usersSnap.forEach((doc) => {
                if (doc.data().role === "student") {
                    students++;
                }
            });

            setTotalStudents(students);

            // Shared Reports
            const permissionsSnap = await getDocs(
                collection(db, "permissions")
            );

            let shared = 0;
            const allowedStudents = [];

            permissionsSnap.forEach((permissionDoc) => {

                if (permissionDoc.data().teacherAccess) {

                    shared++;

                    const student = usersSnap.docs.find(
                        (userDoc) =>
                            userDoc.id === permissionDoc.id
                    );

                    if (
                        student &&
                        student.data().role === "student"
                    ) {

                        allowedStudents.push({
                            id: student.id,
                            ...student.data()
                        });
                    }
                }
            });

            setSharedReports(shared);
            setTeacherStudents(allowedStudents);

            // Activity Logs
            const logsSnap = await getDocs(
                collection(db, "activityLogs")
            );
            const logsQuery = query(
                collection(db, "activityLogs"),
                orderBy("timestamp", "desc"),
                limit(5)
            );

            const recentLogsSnap =
                await getDocs(logsQuery);

            const logs = [];

            recentLogsSnap.forEach((doc) => {
                logs.push(doc.data());
            });

            setRecentLogs(logs);
            setActivityCount(logsSnap.size);
            setLoading(false);
        };

        fetchStats();

    }, []);

    const getBadge = (xp) => {

        if (xp >= 200)
            return "🥇 Expert Reader";

        if (xp >= 100)
            return "🥈 Skilled Reader";

        if (xp >= 50)
            return "🥉 Beginner Reader";

        return "No Badge";
    };

    const verifyTeacherPin = async () => {

        try {

            const studentDoc = await getDoc(
                doc(
                    db,
                    "users",
                    selectedStudent.id
                )
            );

            if (!studentDoc.exists()) {

                toast.error(
                    "Student not found"
                );

                return;
            }

            const studentData =
                studentDoc.data();

            if (
                enteredPin ===
                studentData.guardianPin
            ) {

                toast.success(
                    "PIN Verified"
                );

                setShowPinModal(false);
                setEnteredPin("");
                await addDoc(
                    collection(db, "activityLogs"),
                    {
                        action:
                            `Teacher downloaded report of ${selectedStudent.name}`,

                        timestamp:
                            new Date()
                    }
                );

                generateReportPDF({

                    name: selectedStudent?.name,

                    studentEmail: selectedStudent?.email,

                    parentEmail:
                        selectedStudent?.parentEmail,

                    score:
                        selectedStudent?.lastScore || 0,

                    total: 10,

                    accuracy:
                        selectedStudent?.lastAccuracy || 0,

                    confidence: Math.min(
                        95,
                        Math.max(
                            60,
                            (selectedStudent?.lastAccuracy || 0) + 10
                        )
                    ),

                    risk:
                        selectedStudent?.lastRisk ||
                        "Not Assessed",

                    xp:
                        selectedStudent?.xp || 0,

                    streak:
                        selectedStudent?.streak || 0,

                    badge: getBadge(
                        selectedStudent?.xp || 0
                    ),

                    recommendation:
                        selectedStudent.lastRisk === "High Risk"
                            ? "Immediate reading support and structured intervention recommended."
                            : selectedStudent.lastRisk === "Moderate Risk"
                                ? "Regular reading and pronunciation practice recommended."
                                : "Continue current learning activities and reading habits."
                });

            } else {

                toast.error(
                    "Incorrect Guardian PIN"
                );
            }

        } catch (error) {

            toast.error(
                "Verification Failed"
            );

            console.log(error);
        }
    };
    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">

                <div className="text-center">

                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                    <h2 className="text-white text-xl font-semibold">
                        Loading Teacher Dashboard...
                    </h2>

                </div>

            </div>

        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <div className="flex justify-between items-center mb-10">

                <h1 className="text-5xl font-bold">
                    👨‍🏫 Teacher Dashboard
                </h1>

                <button
                    onClick={handleLogout}
                    className="px-5 py-3 rounded-xl bg-red-500/20 border border-red-400/30"
                >
                    Logout
                </button>

            </div>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                    <p className="text-gray-400">
                        Total Students
                    </p>

                    <h2 className="text-5xl font-bold mt-3">
                        {totalStudents}
                    </h2>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                    <p className="text-gray-400">
                        Students Shared With Teacher
                    </p>

                    <h2 className="text-5xl font-bold mt-3">
                        {sharedReports}
                    </h2>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6">
                    <p className="text-gray-400">
                        Activity Logs
                    </p>

                    <h2 className="text-5xl font-bold mt-3">
                        {activityCount}
                    </h2>
                </div>

            </div>
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mt-8">

                <h2 className="text-2xl font-bold mb-6">
                    📜 Recent Activity Logs
                </h2>

                <div className="space-y-3">

                    {recentLogs.map((log, index) => (

                        <div
                            key={index}
                            className="bg-white/5 rounded-xl p-4"
                        >
                            {log.action}
                        </div>

                    ))}

                </div>

            </div>
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mt-8">

                <h2 className="text-2xl font-bold mb-6">
                    👨‍🎓 Students Shared With Teacher
                </h2>

                <div className="space-y-4">

                    {teacherStudents.map((student) => (

                        <div
                            key={student.id}
                            className="bg-white/5 rounded-2xl p-5"
                        >

                            <h3 className="text-xl font-bold">
                                {student.name}
                            </h3>

                            <p className="text-gray-400">
                                {student.email}
                            </p>
                            <div className="grid md:grid-cols-4 gap-4 mt-4">

                                <div>
                                    🔥 Streak: {student.streak || 0}
                                </div>

                                <div>
                                    🏆 {getBadge(student.xp || 0)}
                                </div>

                                <div>
                                    {
                                        student.lastRisk === "Low Risk" ? (
                                            <span className="text-green-400 font-bold">
                                                🟢 Low Risk
                                            </span>
                                        ) : student.lastRisk === "Moderate Risk" ? (
                                            <span className="text-yellow-400 font-bold">
                                                🟠 Moderate Risk
                                            </span>
                                        ) : student.lastRisk === "High Risk" ? (
                                            <span className="text-red-400 font-bold">
                                                🔴 High Risk
                                            </span>
                                        ) : (
                                            <span>
                                                Not Assessed
                                            </span>
                                        )
                                    }
                                </div>

                                <div>
                                    {
                                        student.lastAssessmentDate
                                            ? new Date(
                                                student.lastAssessmentDate
                                            ).toLocaleDateString()
                                            : "No Assessment"
                                    }
                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedStudent(student)
                                }
                                className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                            >
                                📄 View Report
                            </button>

                        </div>

                    ))}

                </div>

            </div>
            {selectedStudent && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-slate-900 p-8 rounded-3xl w-[600px]">

                        <h2 className="text-3xl font-bold mb-6">
                            📄 Student Report
                        </h2>

                        <div className="space-y-3">

                            <p>
                                👤 Name:
                                {" "}
                                {selectedStudent.name}
                            </p>

                            <p>
                                📧 Email:
                                {" "}
                                {selectedStudent.email}
                            </p>

                            <p>
                                🎯 Accuracy:
                                {" "}
                                {selectedStudent.lastAccuracy || 0}%
                            </p>

                            <p>
                                🧠 Risk:
                                {" "}
                                {selectedStudent.lastRisk ||
                                    "Not Assessed"}
                            </p>

                            <p>
                                🔥 Streak:
                                {" "}
                                {selectedStudent.streak || 0}
                            </p>

                            <p>
                                ⭐ XP:
                                {" "}
                                {selectedStudent.xp || 0}
                            </p>
                            <p>
                                🔤 Letter Score:
                                {" "}
                                {selectedStudent.letterScore || 0}/7
                            </p>

                            <p>
                                📝 Word Score:
                                {" "}
                                {selectedStudent.wordScore || 0}/7
                            </p>

                            <p>
                                🤖 Model:
                                Logistic Regression
                            </p>

                            <p>
                                🎯 Model Accuracy:
                                98.5%
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                setShowPinModal(true)
                            }
                            className="mt-6 mr-3 px-6 py-3 rounded-xl bg-green-500 text-black font-bold"
                        >
                            📄 Download PDF
                        </button>
                        <button
                            onClick={() =>
                                setSelectedStudent(null)
                            }
                            className="mt-6 px-6 py-3 rounded-xl bg-red-500"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}
            {showPinModal && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-slate-900 p-8 rounded-3xl w-[400px]">

                        <h2 className="text-2xl font-bold mb-4">
                            🔒 Guardian PIN Required
                        </h2>

                        <p className="text-gray-400 mb-5">
                            Enter Guardian PIN to download report
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    verifyTeacherPin();
                                }
                            }}
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white"
                        />

                        <button
                            onClick={verifyTeacherPin}
                            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                        >
                            Verify PIN
                        </button>

                    </div>

                </div>

            )}
        </div>
    );
}