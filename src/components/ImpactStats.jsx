export default function ImpactStats() {
    const stats = [
        { value: "95%", label: "Detection Accuracy" },
        { value: "500+", label: "Assessments Completed" },
        { value: "120+", label: "Students Supported" },
        { value: "38%", label: "Average Improvement" },
    ];

    return (
        <section className="px-8 md:px-16 py-24">

            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">
                    Project Impact
                </h2>

                <p className="text-gray-300 text-lg">
                    Measuring the effectiveness of DyslexAid.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 hover:scale-105 transition duration-300"
                    >
                        <h3 className="text-5xl font-bold text-cyan-300 mb-3">
                            {stat.value}
                        </h3>

                        <p className="text-gray-300">
                            {stat.label}
                        </p>
                    </div>
                ))}

            </div>

        </section>
    );
}