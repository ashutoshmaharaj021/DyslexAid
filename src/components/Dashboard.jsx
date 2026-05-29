export default function Dashboard() {
    return (
        <section className="px-8 md:px-16 py-24 flex flex-col lg:flex-row gap-10 items-center">

            <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Real-Time
                    <span className="text-cyan-300">
                        {" "}Student Dashboard
                    </span>
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    Teachers and parents can monitor student performance,
                    reading patterns, and AI recommendations.
                </p>

                <ul className="space-y-4 text-gray-200">
                    <li>✔ Reading Speed Monitoring</li>
                    <li>✔ AI-Based Error Detection</li>
                    <li>✔ Personalized Recommendations</li>
                    <li>✔ Multi-language Support</li>
                </ul>
            </div>

            <div className="flex-1 w-full">
                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[40px] p-8 shadow-2xl">

                    <div className="grid grid-cols-2 gap-6">

                        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
                            <p className="text-gray-400 mb-2">
                                Students Tested
                            </p>

                            <h3 className="text-4xl font-bold">
                                124
                            </h3>
                        </div>

                        <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
                            <p className="text-gray-400 mb-2">
                                Improvement
                            </p>

                            <h3 className="text-4xl font-bold">
                                +38%
                            </h3>
                        </div>

                        <div className="bg-white/10 rounded-3xl p-6 border border-white/10 col-span-2">

                            <p className="text-gray-400 mb-4">
                                Weekly Activity
                            </p>

                            <div className="flex items-end justify-between h-40 gap-4">

                                {[40, 70, 55, 90, 60, 100, 80].map((height, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-400 to-pink-400"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </section>
    );
}