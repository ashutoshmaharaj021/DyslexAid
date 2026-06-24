import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ScreeningLetter() {
    const navigate = useNavigate();

    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        {
            letter: "d",
            correct: "d",
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
        {
            letter: "n",
            correct: "n",
            options: ["m", "n", "u", "w"],
        },
        {
            letter: "saw",
            correct: "saw",
            options: ["was", "saw", "swa", "sav"],
        },
        {
            letter: "no",
            correct: "no",
            options: ["on", "no", "mo", "do"],
        },
        {
            letter: "tap",
            correct: "tap",
            options: ["pat", "tap", "pta", "tap"],
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
                "letterScore",
                finalScore
            );

            toast.success(
                "Letter Screening Completed 🎉"
            );

            navigate("/screening-word");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                🔤 Letter Recognition Screening
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">

                <p className="text-gray-300 mb-6">
                    Identify the correct letter shown below:
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