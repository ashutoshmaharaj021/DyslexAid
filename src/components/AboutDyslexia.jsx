export default function AboutDyslexia() {
    return (
        <section id="about" className="px-8 md:px-16 py-24">

            <div className="text-center mb-16">

                <h2 className="text-5xl font-bold mb-6">
                    Understanding Dyslexia
                </h2>

                <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                    Dyslexia is a learning disorder that affects reading,
                    spelling, and word recognition. Early identification
                    and support can help students improve their academic
                    performance and confidence.
                </p>

            </div>

            <div className="grid md:grid-cols-3 gap-8">

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">📖</div>

                    <h3 className="text-2xl font-bold mb-3">
                        Reading Difficulties
                    </h3>

                    <p className="text-gray-300">
                        Students may struggle with reading speed,
                        fluency and comprehension.
                    </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">✍️</div>

                    <h3 className="text-2xl font-bold mb-3">
                        Spelling Challenges
                    </h3>

                    <p className="text-gray-300">
                        Difficulty recognizing patterns can
                        lead to frequent spelling mistakes.
                    </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">🧠</div>

                    <h3 className="text-2xl font-bold mb-3">
                        Early Intervention
                    </h3>

                    <p className="text-gray-300">
                        Timely support helps students improve
                        learning outcomes and confidence.
                    </p>
                </div>

            </div>

        </section>
    );
}