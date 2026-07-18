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

                    <div className="relative">

    <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none pr-14"
    />

    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
    >
        {showPassword ? "🙈" : "👁️"}
    </button>

</div>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </button>

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