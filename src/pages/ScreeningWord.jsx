import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ScreeningWord() {

    const navigate = useNavigate();

    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    useEffect(() => {
    const progress = JSON.parse(
        localStorage.getItem("assessmentProgress")
    );

    if (progress && progress.step === "word") {
        setCurrentQuestion(progress.currentQuestion);
        setScore(progress.wordScore);
    }
}, []);

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
            options: ["Beautifull", "Beautifal", "Beautiful", "Beautifl"],
        },
        {
            correct: "Necessary",
            options: ["Necesary", "Necassary", "Necesery", "Necessary"],
        },
        {
            correct: "Wednesday",
            options: ["Wensday", "Wednesday", "Wednesdy", "Wednsday"],
        },
        {
            correct: "Different",
            options: ["Different", "Diffrent", "Diferent", "Diffarent"],
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

    const progress = JSON.parse(
        localStorage.getItem("assessmentProgress")
    );

    if (progress) {

        progress.step = "word";
        progress.wordScore = finalScore;
        progress.currentQuestion = currentQuestion + 1;

        localStorage.setItem(
            "assessmentProgress",
            JSON.stringify(progress)
        );
    }

    setCurrentQuestion((prev) => prev + 1);

} else {
            localStorage.setItem(
                "wordScore",
                finalScore
            );
            const progress = JSON.parse(
    localStorage.getItem("assessmentProgress")
);

if (progress) {

    progress.completed = true;
    progress.wordScore = finalScore;

    localStorage.setItem(
        "assessmentProgress",
        JSON.stringify(progress)
    );

}

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
text-3xl
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

                    <p>
                        {currentQuestion + 1}/{questions.length}
                    </p>

                </div>

            </div>

        </div>
    );
}