import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Assessment() {
    const navigate = useNavigate();

    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");

    const recognitionRef = useRef(null);

    const paragraph =
        "Children enjoy reading books and learning new words every day. Reading carefully helps improve understanding confidence and communication skills.";

    const startRecording = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {

            let text = "";

            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript + " ";
            }

            setTranscript(text);
        };

        recognition.start();

        recognitionRef.current = recognition;

        setIsRecording(true);
    };

    const stopRecording = () => {

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        setIsRecording(false);
    };

    const calculateAccuracy = () => {

        const originalWords =
            paragraph.toLowerCase().split(" ");

        const spokenWords =
            transcript.toLowerCase().split(" ");

        let correct = 0;

        originalWords.forEach((word) => {

            if (spokenWords.includes(word)) {
                correct++;
            }

        });

        return Math.round(
            (correct / originalWords.length) * 100
        );
    };
const submitAssessment = () => {

    const accuracy = calculateAccuracy();

    // Existing code
    localStorage.setItem(
        "voiceScore",
        accuracy
    );

    // New assessment progress object
    localStorage.setItem(
        "assessmentProgress",
        JSON.stringify({
            step: "letter",
            voiceScore: accuracy,
            letterScore: 0,
            wordScore: 0,
            currentQuestion: 0,
            completed: false
        })
    );

    navigate("/screening-letter");
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8">

            <h1 className="text-5xl font-bold mb-6">
                🎤 Voice Reading Screening
            </h1>

            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">

                <h2 className="text-2xl font-bold mb-4">
                    Read the paragraph below:
                </h2>

                <p className="text-gray-300 leading-8 text-lg mb-8">
                    Children enjoy reading books and learning new words every day. Reading carefully helps improve understanding confidence and communication skills.
                </p>

                <div className="flex gap-4 flex-wrap">

                    <button
                        onClick={startRecording}
                        className="px-6 py-3 rounded-2xl bg-green-500 text-black font-bold"
                    >
                        🎤 Start Recording
                    </button>

                    <button
                        onClick={stopRecording}
                        className="px-6 py-3 rounded-2xl bg-red-500 text-black font-bold"
                    >
                        ⏹ Stop Recording
                    </button>

                </div>

                <p className="mt-6 text-cyan-300 font-semibold">
                    Status: {isRecording ? "Recording..." : "Not Recording"}
                </p>

                <div className="mt-6">

                    <h3 className="text-xl font-bold mb-3">
                        Recognized Speech:
                    </h3>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[120px] text-gray-300">
                        {transcript || "No speech detected yet"}
                    </div>

                </div>

                <button
                    onClick={submitAssessment}
                    className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                >
                    Submit Assessment
                </button>

            </div>

        </div>
    );
}