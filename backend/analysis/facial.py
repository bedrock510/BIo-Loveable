import cv2
import numpy as np


def analyze_face(image_path):
    # Lazy import to avoid TensorFlow initialization at module load time
    from deepface import DeepFace
    
    # DeepFace emotion analysis
    result = DeepFace.analyze(
        img_path=image_path,
        actions=['emotion', 'age'],
        enforce_detection=False
    )
    
    emotions = result[0].get('dominant_emotion')
    emotion_scores = result[0].get('emotion', {})
    
    # Map emotions to stress/fatigue indicators
    stress_emotions = ['angry', 'fear', 'disgust', 'sad']
    facial_stress = sum(emotion_scores.get(e, 0) for e in stress_emotions) / 100
    
    # OpenCV landmark analysis
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Skin tone uniformity via color variance
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin_variance = float(np.std(hsv[:,:,1]))
    skin_recovery_signal = max(0, 1 - (skin_variance / 128))
    
    # Basic symmetry check via left/right half comparison
    h, w = gray.shape
    left = gray[:, :w//2]
    right = cv2.flip(gray[:, w//2:], 1)
    min_w = min(left.shape[1], right.shape[1])
    asymmetry = float(np.mean(np.abs(
        left[:, :min_w].astype(float) - right[:, :min_w].astype(float)
    ))) / 255
    
    return {
        "facial_stress_indicator": round(min(facial_stress * 1.5, 1.0), 3),
        "eye_fatigue": round(emotion_scores.get('sad', 0) / 100, 3),
        "brow_tension": round((emotion_scores.get('angry', 0) + emotion_scores.get('fear', 0)) / 200, 3),
        "jaw_tension": round(emotion_scores.get('disgust', 0) / 100, 3),
        "skin_recovery_signal": round(skin_recovery_signal, 3),
        "facial_asymmetry": round(min(asymmetry * 2, 1.0), 3)
    }
