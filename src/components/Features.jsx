const features = [
    {
        title: "Dyslexia Detection",
        desc: "AI-based reading analysis.",
        icon: "🧠",
    },
    {
        title: "Personalized Support",
        desc: "Adaptive learning exercises.",
        icon: "📘",
    },
    {
        title: "Speech Assistance",
        desc: "Text-to-speech support.",
        icon: "🎤",
    },
    {
        title: "Progress Tracking",
        desc: "Monitor student improvement.",
        icon: "📈",
    },
];

export default function Features() {
    return (
        <section className="px-8 md:px-16 py-20">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-4">
                    Smart Features
                </h2>

                <p className="text-gray-400">
                    AI powered learning tools for dyslexia support.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-6 hover:-translate-y-2 transition duration-300"
                    >
                        <div className="text-5xl mb-5">
                            {feature.icon}
                        </div>

                        <h3 className="text-2xl font-semibold mb-3">
                            {feature.title}
                        </h3>

                        <p className="text-gray-300 text-sm">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}