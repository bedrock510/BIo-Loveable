import os
os.environ["DISPLAY"] = ""
os.environ["QT_QPA_PLATFORM"] = "offscreen"]
os.environ["OPENCV_IO_ENABLE_OPENEXR"] = "0"


def analyze_face(image_path: str) -> dict:
    """
    Analyze facial signals from a still image.
    Uses DeepFace for emotion detection and OpenCV for geometric analysis.
    Returns normalized scores between 0.0 and 1.0.
    """
    facial_stress = 0.4
    eye_fatigue = 0.3
    brow_tension = 0.3
    jaw_tension = 0.2
    skin_recovery_signal = 0.6
    asymmetry = 0.2

    try:
        from deepface import DeepFace

        result = DeepFace.analyze(
            img_path=image_path,
            actions=["emotion"],
            enforce_detection=False,
            silent=True,
        )

        emotion_scores = result[0]["emotion"]
        stress_emotions = ["angry", "fear", "disgust", "sad"]
        facial_stress = (
            sum(emotion_scores.get(e, 0) for e in stress_emotions) / 100
        )
        eye_fatigue = emotion_scores.get("sad", 0) / 100
        brow_tension = (
            emotion_scores.get("angry", 0) + emotion_scores.get("fear", 0)
        ) / 200
        jaw_tension = emotion_scores.get("disgust", 0) / 100

    except Exception:
        pass

    try:
        import cv2
        import numpy as np

        img = cv2.imread(image_path)
        if img is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            skin_variance = float(np.std(hsv[:, :, 1]))
            skin_recovery_signal = max(0.0, 1.0 - (skin_variance / 128.0))
            h, w = gray.shape
            left = gray[:, : w // 2]
            right = cv2.flip(gray[:, w // 2 :], 1)
            min_w = min(left.shape[1], right.shape[1])
            asymmetry = float(
                np.mean(
                    np.abs(
                        left[:, :min_w].astype(float)
                        - right[:, :min_w].astype(float)
                    )
                )
            ) / 255.0

    except Exception:
        pass

    return {
        "facial_stress_indicator": round(min(facial_stress * 1.5, 1.0), 3),
        "eye_fatigue": round(min(eye_fatigue, 1.0), 3),
        "brow_tension": round(min(brow_tension, 1.0), 3),
        "jaw_tension": round(min(jaw_tension, 1.0), 3),
        "skin_recovery_signal": round(skin_recovery_signal, 3),
        "facial_asymmetry": round(min(asymmetry * 2.0, 1.0), 3),
    }
