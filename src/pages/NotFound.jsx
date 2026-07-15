import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      <div className="text-center max-w-2xl">

        <h1 className="text-8xl md:text-9xl font-extrabold text-cyan-400">
          404
        </h1>

        <h2 className="mt-4 text-4xl font-bold">
          Oops! Page Not Found
        </h2>

        <p className="mt-6 text-lg text-gray-300">
          The page you're trying to access doesn't exist or may have been moved.
        </p>

        <p className="mt-2 text-gray-400">
          Don't worry! Let's get you back to DyslexAid.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition duration-300 font-semibold shadow-lg"
        >
          🏠 Back to Home
        </Link>

      </div>
    </div>
  );
}