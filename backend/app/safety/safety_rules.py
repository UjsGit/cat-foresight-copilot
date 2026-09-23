from typing import Dict, Any, Optional
from datetime import datetime

class SafetyRules:
    """
    Deterministic safety overrides and evaluation logic.
    """

    @staticmethod
    def evaluate_seatbelt(seatbelt_status: str, machine_speed: float, machine_state: str) -> Optional[Dict[str, Any]]:
        if seatbelt_status.lower() == "unfastened" and (machine_speed > 0.5 or machine_state in ["operating", "reversing"]):
            return {
                "triggered": True,
                "severity": "CRITICAL",
                "risk_score": 95.0,
                "title": "STOP — SEATBELT UNFASTENED IN MOTION",
                "concise_reason": f"Machine movement detected ({machine_speed:.1f} km/h) without operator seatbelt latch.",
                "recommended_action": "Bring machine to an immediate stop and latch safety harness."
            }
        return None

    @staticmethod
    def evaluate_reversing_proximity(
        machine_direction: str,
        proximity_distance: Optional[float],
        nearby_person_count: int,
        machine_speed: float,
        rainfall_mm: float,
        visibility_meters: float
    ) -> Optional[Dict[str, Any]]:
        is_reversing = machine_direction.lower() == "reverse" or machine_speed < -0.1
        
        if proximity_distance is not None and nearby_person_count > 0:
            # Distance threshold is dynamically extended in rain or low visibility
            hazard_threshold = 7.5 if (rainfall_mm > 2.0 or visibility_meters < 400.0) else 5.0
            
            if proximity_distance <= 5.0 and is_reversing:
                weather_note = "Rain has reduced visibility." if rainfall_mm > 0 else f"Visibility is {visibility_meters:.0f}m."
                return {
                    "triggered": True,
                    "severity": "CRITICAL",
                    "risk_score": 92.0 if proximity_distance <= 4.5 else 82.0,
                    "title": "STOP — PERSON IN REAR HAZARD ZONE",
                    "concise_reason": f"Person detected {proximity_distance:.1f} m behind while reversing at {abs(machine_speed):.1f} km/h. {weather_note}",
                    "recommended_action": "Stop safely, verify the rear zone, and proceed only after clear."
                }
            elif proximity_distance <= hazard_threshold:
                return {
                    "triggered": True,
                    "severity": "WARNING",
                    "risk_score": 58.0,
                    "title": "CAUTION — PEDESTRIAN IN PROXIMITY BUFFER",
                    "concise_reason": f"Person detected {proximity_distance:.1f} m away. Speed is {machine_speed:.1f} km/h.",
                    "recommended_action": "Reduce speed below 3 km/h and maintain spotter visual contact."
                }
        return None

    @staticmethod
    def evaluate_thermal_risk(hydraulic_temp: float, coolant_temp: float) -> Optional[Dict[str, Any]]:
        if hydraulic_temp > 98.0 or coolant_temp > 102.0:
            return {
                "triggered": True,
                "severity": "CRITICAL",
                "risk_score": 85.0,
                "title": "OVERHEAT ALERT — REDUCE LOAD IMMEDIATELY",
                "concise_reason": f"Hydraulic oil temperature at {hydraulic_temp:.1f}°C (Limit: 95°C).",
                "recommended_action": "Reduce cycle intensity, park on level ground, and allow 3-5 min idle cooldown."
            }
        elif hydraulic_temp > 90.0:
            return {
                "triggered": True,
                "severity": "WARNING",
                "risk_score": 48.0,
                "title": "HYDRAULIC TEMPERATURE ELEVATED",
                "concise_reason": f"Hydraulic temperature at {hydraulic_temp:.1f}°C under heavy slope work.",
                "recommended_action": "Monitor temperature trend. Transition to Economy mode if feasible."
            }
        return None
