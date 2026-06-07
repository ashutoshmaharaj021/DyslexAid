import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export default function Practice() {
    const [xp, setXp] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchXP = async () => {
            const user = auth.currentUser;

            if (!user) return;

            const docSnap = await getDoc(
                doc(db, "users", user.uid)
            );

            if (docSnap.exists()) {
                setXp(docSnap.data().xp || 0);
            }
        };

        fetchXP();
    }, []);
    const handleExerciseComplete = async (rewardXp) => {
        if (completedExercises.includes(rewardXp)) {
            alert("Exercise already completed!");
            return;
        }
        try {


            const user = auth.currentUser;

            console.log(user);

            await updateDoc(
                doc(db, "users", user.uid),
                {
                    xp: increment(rewardXp)
                }
            );
            setXp((prev) => prev + rewardXp);
            setCompletedExercises([
                ...completedExercises,
                rewardXp
            ]);
            alert(`+${rewardXp} XP Earned! 🎉`);

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };
    const exercises = [
        {
            title: "Voice Reading",
            description: "Read a short paragraph and answer questions.",
            xp: 10,
            route: "/assessment"
        },
        {
            title: "Letter Recognition",
            description: "Identify similar-looking letters and words.",
            xp: 15,
            route: "/letter-recognition"
        },
        {
            title: "Word Matching",
            description: "Practice pronunciation and fluency.",
            xp: 20,
            route: "/word-matching"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-4">
                Practice Zone 📚
            </h1>
            <p className="text-cyan-300 text-xl mb-8">
                Current XP: {xp}
            </p>

            <p className="text-gray-300 mb-10">
                Complete exercises to earn XP and maintain your streak.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {exercises.map((exercise, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6"
                    >
                        <h2 className="text-2xl font-bold mb-3">
                            {exercise.title}
                        </h2>

                        <p className="text-gray-300 mb-4">
                            {exercise.description}
                        </p>

                        <p className="text-cyan-300 mb-6">
                            Reward: {exercise.xp} XP
                        </p>

                        <button
                            onClick={() => navigate(exercise.route)}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                        >
                            Start Exercise
                        </button>
                        <button
                            onClick={() => handleExerciseComplete(exercise.xp)}
                            disabled={completedExercises.includes(exercise.xp)}
                            className="w-full mt-3 py-3 rounded-2xl border border-cyan-400 text-cyan-300 font-bold disabled:opacity-50"
                        >
                            {completedExercises.includes(exercise.xp)
                                ? "Completed ✅"
                                : "Complete Exercise"}
                        </button>
                    </div>
                ))}

            </div>

        </div>
    );
}