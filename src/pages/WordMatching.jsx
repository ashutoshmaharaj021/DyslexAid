import { useState } from "react";
import toast from "react-hot-toast";

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
            options: ["Becaus", "Because", "Beacause", "Becose"],
        },
        {
            correct: "School",
            options: ["Scool", "School", "Skool", "Schol"],
        },
        {
            correct: "Teacher",
            options: ["Techer", "Teacher", "Teachar", "Teachar"],
        },
        {
            correct: "Computer",
            options: ["Computor", "Computer", "Computar", "Comptuer"],
        },
    ];
    const handleAnswer = (answer) => {

        if (answer === questions[currentQuestion].correct) {
            setScore((prev) => prev + 1);
            toast.success("Correct! 🎉");
        } else {
            toast.error("Wrong ❌");
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setIsFinished(true);
        }
    };
    if (isFinished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-8">

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-10 text-center max-w-xl">

                    <h1 className="text-5xl font-bold mb-6">
                        🎉 Word Matching Complete
                    </h1>

                    <h2 className="text-3xl mb-4">
                        Score: {score} / {questions.length}
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

                </div>

            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                Word Matching 📝
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 max-w-2xl">

                <p className="text-gray-300 mb-6">
                    Select the correct spelling:
                </p>

                <div className="grid grid-cols-2 gap-4">

                    {questions[currentQuestion].options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="p-4 rounded-2xl bg-white/10"
                        >
                            {option}
                        </button>
                    ))}

                </div>
                <p className="mt-8 text-cyan-300 text-xl">
                    Score: {score}
                </p>
                <p className="mt-4 text-gray-300">
                    Question {currentQuestion + 1} / {questions.length}
                </p>

            </div>

        </div>
    );
}