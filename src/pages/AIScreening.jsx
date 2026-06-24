import { useNavigate } from "react-router-dom";

export default function AIScreening() {
    const navigate = useNavigate();

    return (
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
                        onClick={() => navigate("/screening-voice")}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold text-lg"
                    >
                        Start Assessment
                    </button>

                </div>

            </div>

        </div>
    );
}