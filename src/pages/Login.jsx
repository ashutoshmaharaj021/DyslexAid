import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Login Successful!");
            navigate("/");

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-6">

            <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[40px] p-8 shadow-2xl">

                <div className="text-center mb-8">

                    <h1 className="text-4xl font-bold text-white mb-3">
                        Welcome Back
                    </h1>

                    <p className="text-gray-300">
                        Login to DyslexAid
                    </p>

                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none"
                    />

                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                    >
                        Login
                    </button>

                </form>
                <p className="text-center text-gray-400 mt-6">
                    Don’t have an account?
                    <Link
                        to="/signup"
                        className="text-cyan-300 hover:text-cyan-200"
                    >
                        {" "}Sign Up
                    </Link>
                </p>

            </div>

        </div>
    );
}