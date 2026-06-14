import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [parentEmail, setParentEmail] = useState("");
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    name,
                    email: user.email,

                    role,
                    parentEmail:
                        role === "student"
                            ? parentEmail
                            : "",

                    xp: 0,
                    streak: 0,
                    badges: 0,

                    guardianPin: "",

                    trustedDevices: [],

                    createdAt: new Date(),
                }
            );
            await setDoc(
                doc(db, "permissions", user.uid),
                {
                    teacherAccess: false,
                    parentAccess: true,
                    consentGiven: false,
                }
            );
            toast.success("Account Created Successfully!");

            setEmail("");
            setPassword("");

            switch (role) {
                case "teacher":
                    navigate("/teacher-dashboard");
                    break;

                case "parent":
                    navigate("/parent-dashboard");
                    break;

                default:
                    navigate("/dashboard");
            }
        } catch (error) {
            toast.error("Invalid email");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-6">

            <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[40px] p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        Create Account
                    </h1>

                    <p className="text-gray-300">
                        Join DyslexAid Today
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none"
                    />
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
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none"
                    >
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    {role === "student" && (
                        <input
                            type="email"
                            placeholder="Parent Email"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none"
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold"
                    >
                        Sign Up
                    </button>

                </form>
                <p className="text-center text-gray-400 mt-6">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-cyan-300 hover:text-cyan-200"
                    >
                        {" "}Login
                    </Link>
                </p>

            </div>

        </div>
    );
}
