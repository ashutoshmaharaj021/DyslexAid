export default function WhyDyslexAid() {
    return (
        <section className="px-8 md:px-16 py-24">

            <div className="text-center mb-16">

                <h2 className="text-5xl font-bold mb-6">
                    Why DyslexAid?
                </h2>

                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                    DyslexAid combines artificial intelligence,
                    speech analysis, and personalized learning
                    to support students with dyslexia.
                </p>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">🤖</div>
                    <h3 className="text-2xl font-bold mb-3">
                        AI Screening
                    </h3>
                    <p className="text-gray-300">
                        Detect reading difficulties using
                        intelligent assessment tools.
                    </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">🎤</div>
                    <h3 className="text-2xl font-bold mb-3">
                        Speech Analysis
                    </h3>
                    <p className="text-gray-300">
                        Evaluate pronunciation and reading
                        fluency through voice input.
                    </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">📈</div>
                    <h3 className="text-2xl font-bold mb-3">
                        Progress Tracking
                    </h3>
                    <p className="text-gray-300">
                        Monitor improvement through
                        personalized performance reports.
                    </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold mb-3">
                        Personalized Learning
                    </h3>
                    <p className="text-gray-300">
                        Adaptive exercises tailored
                        to each student's needs.
                    </p>
                </div>

            </div>

        </section>
    );
}