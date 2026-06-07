import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
export default function Hero() {
    const navigate = useNavigate();
    return (
        <motion.section id="home"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 px-8 md:px-16 py-24 flex flex-col lg:flex-row items-center justify-between gap-16"
        >

            <div className="max-w-2xl">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl mb-6 text-sm text-cyan-200">
                    ✨ AI Powered Learning Support System
                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                    Helping Students

                    <span className="bg-gradient-to-r from-cyan-300 to-pink-400 bg-clip-text text-transparent">
                        {" "}Read Better
                    </span>
                </h1>

                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                    A modern dyslexia detection and support platform using AI,
                    adaptive learning, speech analysis, and personalized reading assistance.
                </p>

                <div className="flex flex-wrap gap-4">

                    <button
                        onClick={() => navigate("/signup")}
                        className="px-7 py-4 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition duration-300 shadow-2xl shadow-cyan-500/30"
                    >
                        Start Screening
                    </button>

                    <button
                        onClick={() => {
                            alert("Demo Video Coming Soon!");
                        }}
                        className="px-7 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition duration-300"
                    >
                        Watch Demo
                    </button>

                </div>

            </div>

            <div className="relative w-full max-w-md">

                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-pink-500/30 blur-2xl rounded-[40px]"></div>

                <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[40px] p-8 shadow-2xl">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h3 className="text-xl font-bold">
                                Student Analysis
                            </h3>

                            <p className="text-gray-300 text-sm">
                                AI Reading Assessment
                            </p>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-2xl">
                            📚
                        </div>

                    </div>

                    <div className="space-y-5">

                        <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Reading Accuracy</span>
                                <span>82%</span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[82%] bg-cyan-400 rounded-full"></div>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Pronunciation</span>
                                <span>76%</span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[76%] bg-pink-400 rounded-full"></div>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Focus Tracking</span>
                                <span>90%</span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[90%] bg-green-400 rounded-full"></div>
                            </div>
                        </div>

                    </div>

                    <button
                        onClick={() => {
                            if (auth.currentUser) {
                                navigate("/dashboard");
                            } else {
                                navigate("/login");
                            }
                        }}
                        className="w-full py-4 mt-8 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold cursor-pointer"
                    >
                        Generate Report
                    </button>

                </div>

            </div>

        </motion.section>
    );
}