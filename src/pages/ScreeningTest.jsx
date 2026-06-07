import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
    // LETTER RECOGNITION
    {
        type: "Letter Recognition",
        question: "Which letter is shown?",
        display: "d",
        options: ["b", "d", "p", "q"],
        answer: "d",
    },
    {
        type: "Letter Recognition",
        question: "Which letter is shown?",
        display: "p",
        options: ["b", "d", "p", "q"],
        answer: "p",
    },
    {
        type: "Letter Recognition",
        question: "Which letter is shown?",
        display: "q",
        options: ["b", "d", "p", "q"],
        answer: "q",
    },
    {
        type: "Letter Recognition",
        question: "Which letter is shown?",
        display: "b",
        options: ["b", "d", "p", "q"],
        answer: "b",
    },
    {
        type: "Letter Recognition",
        question: "Which letter is shown?",
        display: "m",
        options: ["n", "m", "w", "h"],
        answer: "m",
    },

    // WORD RECOGNITION
    {
        type: "Word Recognition",
        question: "Choose the correct spelling",
        options: ["Frend", "Friend", "Freind", "Frind"],
        answer: "Friend",
    },
    {
        type: "Word Recognition",
        question: "Choose the correct spelling",
        options: ["Scool", "School", "Schol", "Skool"],
        answer: "School",
    },
    {
        type: "Word Recognition",
        question: "Choose the correct spelling",
        options: ["Beautifull", "Beautiful", "Beautifal", "Beautifool"],
        answer: "Beautiful",
    },
    {
        type: "Word Recognition",
        question: "Choose the correct spelling",
        options: ["Elefant", "Elephant", "Elephent", "Eliphant"],
        answer: "Elephant",
    },
    {
        type: "Word Recognition",
        question: "Choose the correct spelling",
        options: ["Becuse", "Because", "Beacuse", "Becoz"],
        answer: "Because",
    },
    {
        type: "Reading Comprehension",
        question: "The cat sat on the mat. What was the cat sitting on?",
        options: ["Chair", "Mat", "Table", "Bed"],
        answer: "Mat",
    },

    {
        type: "Reading Comprehension",
        question: "Ali went to school by bus. How did Ali go to school?",
        options: ["Car", "Bus", "Train", "Bike"],
        answer: "Bus",
    },

    {
        type: "Reading Comprehension",
        question: "The sun rises in the east. Where does the sun rise?",
        options: ["West", "North", "East", "South"],
        answer: "East",
    },

    {
        type: "Reading Comprehension",
        question: "Birds can fly in the sky. What can birds do?",
        options: ["Swim", "Fly", "Drive", "Cook"],
        answer: "Fly",
    },

    {
        type: "Reading Comprehension",
        question: "A dog barked loudly. What animal barked?",
        options: ["Cat", "Dog", "Cow", "Goat"],
        answer: "Dog",
    },
    {
        type: "Pattern Recognition",
        question: "CAT, BAT, MAT, ?",
        options: ["RAT", "DOG", "SUN", "PEN"],
        answer: "RAT",
    },

    {
        type: "Pattern Recognition",
        question: "2, 4, 6, ?",
        options: ["7", "8", "9", "10"],
        answer: "8",
    },

    {
        type: "Pattern Recognition",
        question: "A, B, C, ?",
        options: ["D", "E", "F", "G"],
        answer: "D",
    },

    {
        type: "Pattern Recognition",
        question: "APPLE, APLE, APPLE, ?",
        options: ["APPLE", "APPEL", "APLLE", "APPLEE"],
        answer: "APPLE",
    },

    {
        type: "Pattern Recognition",
        question: "RED, BLUE, RED, ?",
        options: ["GREEN", "BLUE", "BLACK", "WHITE"],
        answer: "BLUE",
    },
];

export default function ScreeningTest() {
    const navigate = useNavigate();

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);

    const handleAnswer = (selected) => {
        let updatedScore = score;

        if (selected === questions[current].answer) {
            updatedScore += 1;
            setScore(updatedScore);
        }

        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            navigate("/ai-report", {
                state: {
                    score: updatedScore,
                    total: questions.length,
                },
            });
        }
    };

    const q = questions[current];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8 flex items-center justify-center">

            <div className="max-w-3xl w-full backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">

                {/* Progress */}
                <div className="w-full bg-white/10 h-3 rounded-full mb-6">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400"
                        style={{
                            width: `${((current + 1) / questions.length) * 100}%`,
                        }}
                    />
                </div>

                <p className="text-cyan-300 mb-3">
                    Question {current + 1} of {questions.length}
                </p>

                <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 text-sm mb-6">
                    {q.type}
                </span>

                <h2 className="text-3xl font-bold mb-8">
                    {q.question}
                </h2>

                {q.display && (
                    <div className="text-center text-8xl font-bold mb-10">
                        {q.display}
                    </div>
                )}

                <div className="grid gap-4">
                    {q.options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all"
                        >
                            {option}
                        </button>
                    ))}
                </div>

            </div>

        </div>
    );
}