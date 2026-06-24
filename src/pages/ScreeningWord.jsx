import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ScreeningWord() {

    const navigate = useNavigate();

    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        {
            correct: "Friend",
            options: ["Frend", "Friend", "Freind", "Frind"],
        },
        {
            correct: "Because",
            options: ["Beacuse", "Because", "Becuse", "Becoz"],
        },
        {
            correct: "Receive",
            options: ["Recieve", "Receive", "Receve", "Receeve"],
        },
        {
            correct: "Beautiful",
            options: ["Beautifull", "Beautiful", "Beautifal", "Beautifl"],
        },
        {
            correct: "Necessary",
            options: ["Necesary", "Necessary", "Necassary", "Necesery"],
        },
        {
            correct: "Wednesday",
            options: ["Wensday", "Wednesday", "Wednesdy", "Wednsday"],
        },
        {
            correct: "Different",
            options: ["Diffrent", "Different", "Diferent", "Diffarent"],
        },
    ];

    const handleAnswer = (answer) => {

        let finalScore = score;

        if (answer === questions[currentQuestion].correct) {
            finalScore = score + 1;
            setScore(finalScore);
            toast.success("Correct! 🎉");
        } else {
            toast.error("Wrong ❌");
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            localStorage.setItem(
                "wordScore",
                finalScore
            );

            const voiceScore =
                Number(localStorage.getItem("voiceScore")) || 0;

            const letterScore =
                Number(localStorage.getItem("letterScore")) || 0;

            const wordScore = finalScore;

            const finalPredictionScore = Math.round(
                (
                    voiceScore +
                    (letterScore * 100 / 7) +
                    (wordScore * 100 / 7)
                ) / 3
            );

            toast.success(
                "Screening Completed 🎉"
            );

            navigate("/ai-report", {
                state: {
                    score: finalPredictionScore,
                    total: 100
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                📝 Word Recognition Screening
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto">

                <p className="text-gray-300 mb-6">
                    Choose the correct spelling:
                </p>

                <div className="w-full bg-white/10 h-3 rounded-full mb-6">

                    <p className="text-gray-400 mt-2 mb-6">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400"
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
                            className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-cyan-500/20 transition-all"
                        >
                            {option}
                        </button>
                    ))}

                </div>

                <div className="flex justify-between mt-8">

                    <p className="text-cyan-300 font-bold">
                        Score: {score}
                    </p>

                    <p>
                        {currentQuestion + 1}/{questions.length}
                    </p>

                </div>

            </div>

        </div>
    );
}