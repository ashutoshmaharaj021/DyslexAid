import { useState } from "react";

export default function Assessment() {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                Reading Assessment 📖
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">

                <h2 className="text-2xl font-bold mb-4">
                    Read the paragraph below:
                </h2>

                <p className="text-gray-300 leading-8 text-lg mb-8">
                    The quick brown fox jumps over the lazy dog.
                    Reading regularly helps improve fluency,
                    comprehension, and confidence. Practice every day
                    to strengthen your reading skills.
                </p>

                <div className="flex gap-4">

                    <button
                        onClick={() => setIsRecording(true)}
                        className="px-6 py-3 rounded-2xl bg-green-500 text-black font-bold"
                    >
                        🎤 Start Recording
                    </button>

                    <button
                        onClick={() => setIsRecording(false)}
                        className="px-6 py-3 rounded-2xl bg-red-500 text-black font-bold"
                    >
                        ⏹ Stop Recording
                    </button>

                </div>

                <p className="mt-6 text-cyan-300">
                    Status: {isRecording ? "Recording..." : "Not Recording"}
                </p>

                <button
                    className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                >
                    Submit Assessment
                </button>

            </div>

        </div>
    );
}