import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
            }
        );

        return () => unsubscribe();

    }, []);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged Out Successfully!");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50">

            <div>
                <h1 className="text-3xl font-bold tracking-wide">
                    Dyslex<span className="text-cyan-400">Aid</span>
                </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-sm text-gray-300">
                <Link to="/">Home</Link>
                <Link to="/">About</Link>
                <Link to="/">Dashboard</Link>
                <Link to="/">Contact</Link>
            </div>

            {/* Desktop Button */}
            {user ? (
                <div className="hidden md:flex items-center gap-4">

                    <span className="text-cyan-300">
                        {user.email}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 rounded-full bg-red-500/20 border border-red-400/30"
                    >
                        Logout
                    </button>

                </div>
            ) : (

                <Link
                    to="/login"
                    className="hidden md:block px-5 py-2 rounded-full bg-cyan-400/20 border border-cyan-300/30"
                >
                    Login
                </Link>

            )}

            {/* Mobile Button */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-3xl"
            >
                ☰
            </button>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-24 left-0 w-full backdrop-blur-2xl bg-slate-900/95 border-b border-white/10 flex flex-col items-center gap-6 py-8 md:hidden">

                    <Link to="/">Features</Link>
                    <Link to="/">About</Link>
                    <Link to="/">Dashboard</Link>
                    <Link to="/">Contact</Link>

                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-full bg-cyan-400 text-black font-semibold"
                    >
                        Login
                    </Link>

                </div>
            )}

        </nav>
    );
}