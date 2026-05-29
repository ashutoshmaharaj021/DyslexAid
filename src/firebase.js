import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDukFgu-9IOWequGuyX8SzY1hKA5r4PynE",
    authDomain: "dyslexaid-fa29f.firebaseappcom",
    projectId: "dyslexaid-fa29f",
    storageBucket: "dyslexaid-fa29f.firebasestorage.app",
    messagingSenderId: "1077588092913",
    appId: "1:1077588092913:web:130ff9db7ab6448af38650"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);