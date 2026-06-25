import { useEffect, useRef, useState } from "react";
import {
    FilesetResolver,
    FaceDetector
} from "@mediapipe/tasks-vision";

export default function FocusTracker() {

    const videoRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

    const [faceDetected, setFaceDetected] =
        useState(false);
    const [focusedSeconds, setFocusedSeconds] =
        useState(0);
    const [distractedSeconds, setDistractedSeconds] =
        useState(0);

    useEffect(() => {

        let stream;
        let detector;
        let animationFrameId;

        const startCamera = async () => {

            try {

                stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true
                    });

                if (videoRef.current) {

                    videoRef.current.srcObject =
                        stream;

                }
            }

            catch (error) {

                console.error(
                    "Camera Error:",
                    error
                );

            }

        };
        const initializeDetector = async () => {

            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            detector = await FaceDetector.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                    },
                    runningMode: "VIDEO",
                }
            );

        };
        const detectFaces = () => {

            if (
                !detector ||
                !videoRef.current ||
                videoRef.current.readyState < 2
            ) {

                animationFrameId =
                    requestAnimationFrame(detectFaces);

                return;

            }

            const nowInMs = performance.now();

            if (
                lastVideoTimeRef.current !==
                videoRef.current.currentTime
            ) {

                lastVideoTimeRef.current =
                    videoRef.current.currentTime;

                const detections =
                    detector.detectForVideo(
                        videoRef.current,
                        nowInMs
                    );

                setFaceDetected(
                    detections.detections.length > 0
                );

            }

            animationFrameId =
                requestAnimationFrame(detectFaces);

        };

        const init = async () => {

            await initializeDetector();

            await startCamera();

            detectFaces();

        };

        init();
        return () => {

            if (animationFrameId) {

                cancelAnimationFrame(
                    animationFrameId
                );

            }

            if (stream) {

                stream
                    .getTracks()
                    .forEach(
                        track => track.stop()
                    );

            }

        };

    }, []);
    useEffect(() => {

        const interval = setInterval(() => {

            if (faceDetected) {

                setFocusedSeconds(prev => prev + 1);

            }

            else {

                setDistractedSeconds(prev => prev + 1);

            }

        }, 1000);

        return () => clearInterval(interval);

    }, [faceDetected]);

    return (

        <div className="fixed bottom-5 right-5">

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-48 rounded-xl border border-cyan-500"
            />

            <div className="mt-2 text-center">

                {
                    faceDetected
                        ? (
                            <p className="text-green-400 font-bold">
                                ✅ Face Detected
                            </p>
                        )
                        : (
                            <p className="text-red-400 font-bold">
                                ❌ No Face
                            </p>
                        )
                }

            </div>
            <div className="mt-3 text-sm text-gray-300">

                <p>
                    🎯 Focused :
                    {" "}
                    {focusedSeconds}s
                </p>

                <p>
                    ⚠ Distracted :
                    {" "}
                    {distractedSeconds}s
                </p>

            </div>

        </div>

    );

}