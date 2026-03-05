import librosa
import numpy as np


def analyze_audio(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    
    # Pitch analysis
    f0, voiced_flag, _ = librosa.pyin(
        y, fmin=librosa.note_to_hz('C2'),
        fmax=librosa.note_to_hz('C7')
    )
    f0_clean = f0[~np.isnan(f0)]
    pitch_stability = 1.0 - min(float(np.std(f0_clean)) / 100, 1.0) if len(f0_clean) > 0 else 0.5
    
    # Energy
    rms = librosa.feature.rms(y=y)[0]
    vocal_energy = float(np.mean(rms)) * 10
    vocal_energy = min(vocal_energy, 1.0)
    
    # Spectral centroid — cognitive engagement proxy
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    cognitive_engagement = min(float(np.mean(centroid)) / 4000, 1.0)
    
    # Zero crossing rate — vocal tension
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    vocal_strain = min(float(np.mean(zcr)) * 10, 1.0)
    
    # Speech rate via onset detection
    onsets = librosa.onset.onset_detect(y=y, sr=sr)
    duration = librosa.get_duration(y=y, sr=sr)
    speech_rate = min(len(onsets) / max(duration, 1) / 5, 1.0)
    
    # Stress indicator composite
    vocal_stress = min((vocal_strain * 0.5) + ((1 - pitch_stability) * 0.5), 1.0)
    
    return {
        "vocal_stress_indicator": round(vocal_stress, 3),
        "pitch_stability": round(pitch_stability, 3),
        "vocal_energy": round(vocal_energy, 3),
        "speech_rate_indicator": round(speech_rate, 3),
        "vocal_strain": round(vocal_strain, 3),
        "cognitive_engagement": round(cognitive_engagement, 3)
    }
