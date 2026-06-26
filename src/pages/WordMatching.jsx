import { useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function WordMatching() {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const questions = [
        {
            correct: "Friend",
            options: ["Frend", "Friend", "Frind", "Freind"],
        },
        {
            correct: "Because",
            options: ["Because", "Becaus", "Beacause", "Becose"],
        },
        {
            correct: "School",
            options: ["Scool", "Skool", "Schol", "School"],
        },
        {
            correct: "Teacher",
            options: ["Techer", "Teacher", "Teachar", "Techar"],
        },
        {
            correct: "Computer",
            options: ["Computor", "Computer", "Computar", "Comptuer"],
        },
    ];
    const handleAnswer = async (answer) => {

        if (answer === questions[currentQuestion].correct) {
            setScore((prev) => prev + 1);
            toast.success("Correct! 🎉");
        } else {
            toast.error("Wrong ❌");
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {

            try {

                const user = auth.currentUser;

                if (user) {

                    await updateDoc(
                        doc(db, "users", user.uid),
                        {
                            xp: increment(20),

                            practiceWordCompleted: true
                        }
                    );


                    toast.success("+20 XP Earned 🎉");

                }

            }

            catch (error) {

                console.log(error);

            }

            setIsFinished(true);

        }
    };
    if (isFinished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-8">

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-10 text-center max-w-2xl">

                    <h1 className="text-5xl font-bold mb-6">
                        🎉 Word Matching Complete
                    </h1>

                    <p className="text-gray-400 mb-2">
                        Your Final Score
                    </p>

                    <h2 className="text-5xl font-bold text-cyan-400 mb-6">
                        {score} / {questions.length}
                    </h2>

                    <p className="text-cyan-300 text-xl">
                        {
                            score >= 4
                                ? "Excellent Performance 🌟"
                                : score >= 2
                                    ? "Good Job 👍"
                                    : "Needs More Practice 📚"
                        }
                    </p>
                    <button
                        onClick={() => {

                            setScore(0);

                            setCurrentQuestion(0);

                            setIsFinished(false);

                        }}
                        className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                    >

                        🔄 Practice Again

                    </button>

                </div>

            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                📝 Word Matching Practice
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">

                <p className="text-gray-300 mb-8 text-center text-lg">
                    Which is the correct spelling?
                </p>

                <p className="text-gray-400 mb-3">
                    Question {currentQuestion + 1} of {questions.length}
                </p>

                <div className="w-full bg-white/10 rounded-full h-3 mb-8 overflow-hidden">

                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-500"
                        style={{
                            width: `${((currentQuestion + 1) / questions.length) * 100}%`
                        }}
                    />

                </div>


                <div className="grid grid-cols-2 gap-4">

                    {questions[currentQuestion].options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="
p-6
rounded-2xl
bg-white/10
border border-white/10
hover:bg-cyan-500/20
hover:border-cyan-400
transition-all
text-2xl
font-bold
cursor-pointer
"
                        >
                            {option}
                        </button>
                    ))}

                </div>
                <div className="flex justify-between items-center mt-8">

                    <p className="text-cyan-300 text-xl font-bold">
                        Score: {score}
                    </p>

                    <p className="text-gray-300">
                        {currentQuestion + 1}/{questions.length}
                    </p>

                </div>

            </div>

        </div>
    );
}