export default function Footer() {
    return (
        <footer
            id="contact"
            className="px-8 md:px-16 py-12 border-t border-white/10 mt-16"
        >

            <div className="grid md:grid-cols-3 gap-10">

                {/* Brand */}
                <div>
                    <h2 className="text-3xl font-bold">
                        Dyslex<span className="text-cyan-300">Aid</span>
                    </h2>

                    <p className="text-gray-400 mt-3">
                        AI Powered Dyslexia Detection and Support Platform
                        helping students improve reading skills and confidence.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Quick Links
                    </h3>

                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Contact Us
                    </h3>

                    <div className="space-y-2 text-gray-400">
                        <p>📧 support@dyslexaid.com</p>
                        <p>📱 +91 89187 64609</p>
                        <p>📍 Kolkata, West Bengal, India</p>
                    </div>
                </div>

            </div>

            <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500 text-sm">
                © 2026 DyslexAid. All Rights Reserved.
            </div>

        </footer>
    );
}