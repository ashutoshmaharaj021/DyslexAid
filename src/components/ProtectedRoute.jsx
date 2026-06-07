import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {

    const [user, setUser] = useState(undefined);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
            }
        );

        return () => unsubscribe();

    }, []);

    if (user === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">

                <div className="text-center">

                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                    <h2 className="text-white text-xl font-semibold">
                        Loading DyslexAid...
                    </h2>

                </div>

            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}