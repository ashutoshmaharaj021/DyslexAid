import { useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function LetterRecognition() {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const questions = [
        {
            letter: "d",
            correct: "d",
            options: ["b", "d", "p", "q"],
        },
        {
            letter: "b",
            correct: "b",
            options: ["d", "b", "p", "q"],
        },
        {
            letter: "p",
            correct: "p",
            options: ["b", "d", "p", "q"],
        },
        {
            letter: "q",
            correct: "q",
            options: ["b", "d", "p", "q"],
        },
        {
            letter: "w",
            correct: "w",
            options: ["m", "w", "n", "u"],
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
                            xp: increment(15),

                            practiceLetterCompleted: true
                        }
                    );



                    toast.success("+15 XP Earned 🎉");

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

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-10 text-center max-w-xl">

                    <h1 className="text-5xl font-bold mb-6">
                        🎉 Assessment Complete
                    </h1>
                    <h2 className="text-6xl font-bold text-cyan-300 mb-6">
                        {Math.round((score / questions.length) * 100)}%
                    </h2>
                    <h2 className="text-3xl mb-4">
                        Score: {score} / {questions.length}
                    </h2>

                    <div className="flex flex-col items-center gap-4 mt-6">

                        <p className="text-cyan-300 text-2xl font-semibold">
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
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold cursor-pointer"
                        >
                            Play Again
                        </button>

                    </div>

                </div>

            </div>
        );
    }
    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                Letter Recognition 🔤
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">

                <p className="text-gray-300 mb-6">
                    Identify the correct letter shown below:
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
                <div className="bg-white/5 rounded-3xl p-10 text-center mb-8">

                    <p className="text-gray-400 mb-4">
                        Find this letter
                    </p>

                    <div className="text-8xl font-bold text-cyan-300">
                        {questions[currentQuestion].letter}
                    </div>

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
text-4xl
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