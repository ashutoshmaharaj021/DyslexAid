import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export default function Practice() {
    const [xp, setXp] = useState(0);
    const [practiceVoiceCompleted, setPracticeVoiceCompleted] = useState(false);
    const [practiceLetterCompleted, setPracticeLetterCompleted] = useState(false);
    const [practiceWordCompleted, setPracticeWordCompleted] = useState(false);

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

                const data = docSnap.data();

                setXp(data.xp || 0);

                setPracticeVoiceCompleted(
                    data.practiceVoiceCompleted || false
                );

                setPracticeLetterCompleted(
                    data.practiceLetterCompleted || false
                );

                setPracticeWordCompleted(
                    data.practiceWordCompleted || false
                );

            }
        };

        fetchXP();
    }, []);

    const exercises = [
        {
            title: "Voice Reading",
            description: "Read a short paragraph and answer questions.",
            xp: 10,
            route: "/assessment",
            completed: practiceVoiceCompleted
        },
        {
            title: "Letter Recognition",
            description: "Identify similar-looking letters and words.",
            xp: 15,
            route: "/letter-recognition",
            completed: practiceLetterCompleted
        },
        {
            title: "Word Matching",
            description: "Practice pronunciation and fluency.",
            xp: 20,
            route: "/word-matching",
            completed: practiceWordCompleted
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

                        {exercise.completed ? (

                            <div className="w-full py-3 rounded-2xl bg-green-500 text-center font-bold text-white">

                                ✅ Completed

                            </div>

                        ) : (

                            <button
                                onClick={() => navigate(exercise.route)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                            >

                                Start Exercise

                            </button>

                        )}

                    </div>
                ))}

            </div>

        </div>
    );
}