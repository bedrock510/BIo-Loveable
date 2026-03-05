import numpy as np


def fuse_scores(facial_scores, audio_scores, self_report=None):
    
    def agreement_boost(face_val, audio_val, weight=1.2):
        avg = (face_val + audio_val) / 2
        agreement = 1 - abs(face_val - audio_val)
        return min(avg * (1 + (agreement * (weight - 1))), 1.0)
    
    def weighted_blend(face_val, audio_val, face_weight=0.6, audio_weight=0.4):
        return (face_val * face_weight) + (audio_val * audio_weight)
    
    # Agreement confidence score
    pairs = [
        (facial_scores["facial_stress_indicator"], audio_scores["vocal_stress_indicator"]),
        (facial_scores["eye_fatigue"], 1 - audio_scores["vocal_energy"]),
        (facial_scores["brow_tension"], audio_scores["vocal_strain"])
    ]
    agreement_score = float(np.mean([1 - abs(f - a) for f, a in pairs]))
    
    biosignal_scores = {
        "stress_load": float(round(agreement_boost(
            facial_scores["facial_stress_indicator"],
            audio_scores["vocal_stress_indicator"]
        ), 3)),
        
        "nervous_system_balance": float(round(1.0 - agreement_boost(
            (facial_scores["brow_tension"] + facial_scores["jaw_tension"]) / 2,
            audio_scores["vocal_strain"]
        ), 3)),
        
        "recovery_capacity": float(round(1.0 - weighted_blend(
            (facial_scores["eye_fatigue"] + (1 - facial_scores["skin_recovery_signal"])) / 2,
            1.0 - audio_scores["vocal_energy"]
        ), 3)),
        
        "breath_stability": float(round(weighted_blend(
            facial_scores["skin_recovery_signal"],
            audio_scores["pitch_stability"],
            face_weight=0.4, audio_weight=0.6
        ), 3)),
        
        "cognitive_fluency": float(round(weighted_blend(
            1.0 - facial_scores["facial_asymmetry"],
            audio_scores["cognitive_engagement"]
        ), 3)),
        
        "emotional_variability": float(round(weighted_blend(
            facial_scores["facial_stress_indicator"],
            audio_scores["speech_rate_indicator"]
        ), 3)),
        
        "vocal_strength_stability": float(round(
            audio_scores["pitch_stability"] * (1 - audio_scores["vocal_strain"]), 3
        )),
        
        "facial_tension_load": float(round((
            facial_scores["brow_tension"] +
            facial_scores["jaw_tension"] +
            facial_scores["eye_fatigue"]
        ) / 3, 3))
    }
    
    # Apply self-report modifiers if provided
    if self_report:
        stress_level = self_report.get("stress_level_1_10", 5) / 10
        sleep_hours = self_report.get("sleep_hours_avg", 7)
        sleep_modifier = max(0, (7 - sleep_hours) / 7)
        
        biosignal_scores["stress_load"] = float(round(
            min((biosignal_scores["stress_load"] * 0.7) + (stress_level * 0.3), 1.0), 3
        ))
        biosignal_scores["recovery_capacity"] = float(round(
            min((biosignal_scores["recovery_capacity"] * 0.7) + (sleep_modifier * 0.3), 1.0), 3
        ))
    
    flags = {
        "possible_sleep_debt_pattern": bool(
            biosignal_scores["recovery_capacity"] < 0.4 and
            biosignal_scores["facial_tension_load"] > 0.6
        ),
        "possible_high_sympathetic_tone": bool(
            biosignal_scores["stress_load"] > 0.65 and
            biosignal_scores["nervous_system_balance"] < 0.4
        ),
        "possible_low_recovery_pattern": bool(
            biosignal_scores["recovery_capacity"] < 0.35 and
            biosignal_scores["vocal_strength_stability"] < 0.4
        )
    }
    
    return biosignal_scores, flags, round(agreement_score, 3)
