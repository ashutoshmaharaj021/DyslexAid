import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

export default function AIScreening() {
    const navigate = useNavigate();
    const [showResume, setShowResume] = useState(false);
    const [savedProgress, setSavedProgress] =useState(null);

        useEffect(() => {
    const progress = localStorage.getItem("assessmentProgress");

    if (progress) {
        const parsed = JSON.parse(progress);

        if (!parsed.completed) {
            setSavedProgress(parsed);
            setShowResume(true);
        }
    }
}, []);

    const handleResume = () => {

    if (!savedProgress) return;

    switch (savedProgress.step) {

        case "voice":
            navigate("/screening-voice");
            break;

        case "letter":
            navigate("/screening-letter");
            break;

        case "word":
            navigate("/screening-word");
            break;

        default:
            navigate("/screening-voice");
    }

};

const handleStartOver = () => {

    localStorage.removeItem("assessmentProgress");

    setShowResume(false);

    navigate("/screening-voice");

};

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-8">

                <div className="max-w-4xl w-full backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-10">

                    <h1 className="text-5xl font-bold mb-4">
                        🧠 AI Dyslexia Screening
                    </h1>

                    <p className="text-xl text-gray-300 mb-8">
                        Complete a short assessment and let our AI analyze the results
                        to generate a personalized dyslexia risk report.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-10">

                        <div className="bg-white/5 rounded-2xl p-6">
                            <h3 className="text-2xl font-bold mb-3">
                                📖 Reading Test
                            </h3>

                            <p className="text-gray-300">
                                Read a short paragraph aloud.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6">
                            <h3 className="text-2xl font-bold mb-3">
                                🔤 Letter Recognition
                            </h3>

                            <p className="text-gray-300">
                                Identify commonly confused letters.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6">
                            <h3 className="text-2xl font-bold mb-3">
                                ✍️ Word Matching
                            </h3>

                            <p className="text-gray-300">
                                Detect correct spellings and words.
                            </p>
                        </div>

                    </div>

                    <div className="flex justify-between items-center">

                        <div>
                            <p className="text-cyan-300">
                                Estimated Time: 3-5 Minutes
                            </p>
                        </div>
<button
    onClick={() => {
        if (showResume) return;
        navigate("/screening-voice");
    }}
    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold text-lg"
>
                            Start Assessment
                        </button>

                    </div>
                    {showResume && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

        <div className="bg-slate-900 rounded-3xl p-8 w-[450px] border border-cyan-500">

            <h2 className="text-3xl font-bold mb-4">
                Resume Assessment?
            </h2>

            <p className="text-gray-300 mb-6">
                You have an unfinished assessment.
                Would you like to continue where you left off?
            </p>

            <div className="flex gap-4">

                <button
                    onClick={handleResume}
                    className="flex-1 py-3 rounded-xl bg-cyan-400 text-black font-bold"
                >
                    Continue
                </button>

                <button
                    onClick={handleStartOver}
                    className="flex-1 py-3 rounded-xl bg-red-500 font-bold"
                >
                    Start Over
                </button>

            </div>

        </div>

    </div>
)}

                </div>

            </div>

        </>
    );
}