import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function GuardianPin() {
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    const savePin = async () => {
        if (pin.length !== 4) {
            toast.error("PIN must be 4 digits");
            return;
        }

        try {
            await updateDoc(
                doc(db, "users", auth.currentUser.uid),
                {
                    guardianPin: pin,
                }
            );

            toast.success("PIN Saved");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white/10 p-8 rounded-3xl">
                <h1 className="text-white text-2xl mb-4">
                    Set Guardian PIN
                </h1>

                <input
                    type="password"
                    maxLength="4"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full p-4 rounded-xl"
                    placeholder="Enter 4 Digit PIN"
                />

                <button
                    onClick={savePin}
                    className="mt-4 w-full bg-cyan-400 p-3 rounded-xl"
                >
                    Save PIN
                </button>
            </div>
        </div>
    );
}