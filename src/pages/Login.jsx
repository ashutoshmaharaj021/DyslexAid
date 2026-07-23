import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
    doc,
    updateDoc,
    increment,
    getDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email first");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent 📧");
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;
            const deviceId =
                navigator.userAgent +
                navigator.language +
                window.screen.width +
                window.screen.height;

            await updateDoc(
                doc(db, "users", user.uid),
                {
                    streak: increment(1)
                }
            );

            const userDoc = await getDoc(
                doc(db, "users", user.uid)
            );

            const userData = userDoc.data();
            if (userData.role === "student") {

                const trustedDevices =
                    userData.trustedDevices || [];

                if (
                    !trustedDevices.includes(deviceId)
                ) {

                    toast(
                        "⚠️ New Device Detected"
                    );

                    await updateDoc(
                        doc(db, "users", user.uid),
                        {
                            trustedDevices: [
                                ...trustedDevices,
                                deviceId
                            ]
                        }
                    );
                }
            }
            console.log("User Data:", userData);
            console.log("Role:", userData?.role);
            toast.success("Login Successful!");

            if (userData.role === "teacher") {
                navigate("/teacher-dashboard");
            }
            else if (userData.role === "parent") {
                navigate("/parent-dashboard");
            }
            else {
                navigate("/dashboard");
            }

        } catch (error) {
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-6">

            <div className="w-full max-w-[500px] backdrop-blur-3xl bg-white/[0.08] border border-white/20 rounded-[40px] p-10 shadow-2xl shadow-cyan-500/10">

                <div className="text-center mb-10">

                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                        Welcome Back
                    </h1>

                    <p className="text-gray-300 text-base mt-2">
                        Sign in to continue your learning journey
                    </p>

                </div>

                <form onSubmit={handleLogin} className="space-y-6">

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-4 px-5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 pr-14 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-5 flex items-center text-white/50 hover:text-cyan-300 transition-colors duration-200"
                        >
                            {showPassword ? (
                                <EyeOff size={20} strokeWidth={2} />
                            ) : (
                                <Eye size={20} strokeWidth={2} />
                            )}
                        </button>

                    </div>
                    <div className="flex justify-end mt-2 mb-2">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-pink-400 text-black font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-100 transition-all duration-300"
                    >
                        Login
                    </button>

                </form>
                <p className="text-center text-gray-400 mt-8">
                    Don’t have an account?
                    <Link
                        to="/signup"
                        className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                        {" "}Sign Up
                    </Link>
                </p>

            </div>

        </div>
    );
}