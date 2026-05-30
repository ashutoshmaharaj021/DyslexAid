export default function HowItWorks() {
    const steps = [
        {
            icon: "👤",
            title: "Register",
            desc: "Students create an account and access the platform."
        },
        {
            icon: "📝",
            title: "Assessment",
            desc: "Complete reading and recognition exercises."
        },
        {
            icon: "🤖",
            title: "AI Analysis",
            desc: "AI evaluates performance and identifies difficulties."
        },
        {
            icon: "📈",
            title: "Improvement",
            desc: "Receive personalized recommendations and track progress."
        }
    ];

    return (
        <section id="dashboard" className="px-8 md:px-16 py-24">

            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">
                    How It Works
                </h2>

                <p className="text-gray-300 text-lg">
                    A simple 4-step process to support students.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 text-center hover:-translate-y-3 hover:scale-105 transition duration-300"
                    >
                        <div className="text-6xl mb-4">
                            {step.icon}
                        </div>

                        <h3 className="text-2xl font-bold mb-3">
                            {step.title}
                        </h3>

                        <p className="text-gray-300">
                            {step.desc}
                        </p>
                    </div>
                ))}

            </div>

        </section>
    );
}