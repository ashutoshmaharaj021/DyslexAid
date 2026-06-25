import { useEffect, useRef, useState } from "react";
import {
    FilesetResolver,
    FaceLandmarker
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
    const [headDirection, setHeadDirection] =
        useState("Focused");

    useEffect(() => {

        let stream;
        let faceLandmarker;
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

        const initializeLandmarker = async () => {

            const vision =
                await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

            faceLandmarker =
                await FaceLandmarker.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath:
                                "/models/face_landmarker.task"
                        },

                        runningMode: "VIDEO",

                        numFaces: 1,

                        outputFaceBlendshapes: true,

                        outputFacialTransformationMatrixes: true
                    }
                );

            console.log(
                "✅ FaceLandmarker Ready"
            );

        };

        const detectFaces = () => {

            if (
                !faceLandmarker ||
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

                const results =
                    faceLandmarker.detectForVideo(
                        videoRef.current,
                        nowInMs
                    );
                console.log(results.facialTransformationMatrixes);

                if (results.faceLandmarks.length > 0) {

                    const matrix =
                        results.facialTransformationMatrixes[0].data;

                    const yaw = matrix[2];
                    const pitch = matrix[6];

                    if (yaw < -0.12) {

                        setHeadDirection("👈 Looking Left");

                    }
                    else if (yaw > 0.12) {

                        setHeadDirection("👉 Looking Right");

                    }
                    else if (pitch > 0.15) {

                        setHeadDirection("⬇ Looking Down");

                    }
                    else if (pitch < -0.15) {

                        setHeadDirection("⬆ Looking Up");

                    }
                    else {

                        setHeadDirection("🎯 Focused");

                    }

                }


                const hasFace = results.faceLandmarks.length > 0;

                setFaceDetected(hasFace);

                if (!hasFace) {
                    setHeadDirection("❌ No Face");
                }

            }

            animationFrameId =
                requestAnimationFrame(detectFaces);

        };

        const init = async () => {

            await initializeLandmarker();

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

                <p className="font-bold text-cyan-400 mb-2">
                    {headDirection}
                </p>

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