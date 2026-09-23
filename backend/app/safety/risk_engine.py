from typing import Dict, Any, Optional
from datetime import datetime
from backend.app.safety.safety_rules import SafetyRules

class RiskEngine:
    """
    Combines deterministic safety rules with multivariate contextual risk scoring.
    """

    def evaluate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        seatbelt_status = data.get("seatbelt_status", "fastened")
        machine_speed = float(data.get("machine_speed", 0.0))
        machine_direction = data.get("machine_direction", "neutral")
        machine_state = data.get("machine_state", "idle")
        proximity_distance = data.get("proximity_distance_meters")
        nearby_person_count = int(data.get("nearby_person_count", 0))
        nearby_vehicle_count = int(data.get("nearby_vehicle_count", 0))
        visibility_meters = float(data.get("visibility_meters", 1500.0))
        rainfall_mm = float(data.get("rainfall_mm", 0.0))
        terrain_slope = float(data.get("terrain_slope_degrees", 0.0))
        hydraulic_temp = float(data.get("hydraulic_temperature", 75.0))
        coolant_temp = float(data.get("coolant_temperature", 85.0))

        # 1. Check Deterministic Overrides
        # A. Seatbelt override
        sb_override = SafetyRules.evaluate_seatbelt(seatbelt_status, machine_speed, machine_state)
        if sb_override:
            return self._format_alert(sb_override, data)

        # B. Reversing & Proximity override
        rev_override = SafetyRules.evaluate_reversing_proximity(
            machine_direction, proximity_distance, nearby_person_count, machine_speed, rainfall_mm, visibility_meters
        )
        if rev_override and rev_override["severity"] == "CRITICAL":
            return self._format_alert(rev_override, data)

        # C. Thermal override
        therm_override = SafetyRules.evaluate_thermal_risk(hydraulic_temp, coolant_temp)
        if therm_override and therm_override["severity"] == "CRITICAL":
            return self._format_alert(therm_override, data)

        # 2. Contextual Continuous Risk Scoring
        # Baseline environmental risk
        env_risk = 0.0
        if rainfall_mm > 0:
            env_risk += min(20.0, rainfall_mm * 1.8)
        if visibility_meters < 800:
            env_risk += min(25.0, (800 - visibility_meters) / 30.0)
        if terrain_slope > 6.0:
            env_risk += min(15.0, (terrain_slope - 6.0) * 1.8)

        # Kinetic & Proximity risk
        prox_risk = 0.0
        if proximity_distance is not None and nearby_person_count > 0:
            if proximity_distance < 12.0:
                prox_risk += (12.0 - proximity_distance) * 4.5
            if machine_direction == "reverse":
                prox_risk *= 1.4

        if nearby_vehicle_count > 0 and (proximity_distance or 20) < 15.0:
            prox_risk += 12.0

        total_risk = min(100.0, env_risk + prox_risk + (5.0 if machine_state == "operating" else 0.0))

        # Determine band
        if rev_override:
            return self._format_alert(rev_override, data)
        elif therm_override:
            return self._format_alert(therm_override, data)
        elif total_risk >= 60.0:
            return {
                "severity": "CRITICAL",
                "risk_score": round(total_risk, 1),
                "title": "ELEVATED CONTEXTUAL RISK ZONE",
                "concise_reason": f"Combined risk from rain ({rainfall_mm:.1f}mm), low visibility, and {nearby_person_count} nearby worker(s).",
                "recommended_action": "Reduce travel speed, increase horn cadence, and verify site exclusion zone.",
                "contextual_evidence": self._build_context(data),
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                "acknowledged": False
            }
        elif total_risk >= 30.0:
            return {
                "severity": "WARNING",
                "risk_score": round(total_risk, 1),
                "title": "CAUTION — ADVERSE SITE CONDITIONS",
                "concise_reason": f"Wet surface and slope ({terrain_slope:.1f}°) require extended braking buffers.",
                "recommended_action": "Maintain moderate throttle and keep bucket close to ground level.",
                "contextual_evidence": self._build_context(data),
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                "acknowledged": False
            }
        else:
            return {
                "severity": "INFO",
                "risk_score": round(max(5.0, total_risk), 1),
                "title": "ALL SYSTEMS NOMINAL",
                "concise_reason": "No critical proximity, terrain, or thermal hazards detected.",
                "recommended_action": "Continue normal planned operations.",
                "contextual_evidence": self._build_context(data),
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                "acknowledged": True
            }

    def _format_alert(self, rule_res: Dict[str, Any], raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "severity": rule_res["severity"],
            "risk_score": rule_res["risk_score"],
            "title": rule_res["title"],
            "concise_reason": rule_res["concise_reason"],
            "recommended_action": rule_res["recommended_action"],
            "contextual_evidence": self._build_context(raw_data),
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "acknowledged": False
        }

    def _build_context(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "speed_kmh": data.get("machine_speed", 0.0),
            "direction": data.get("machine_direction", "neutral"),
            "proximity_meters": data.get("proximity_distance_meters"),
            "rainfall_mm": data.get("rainfall_mm", 0.0),
            "visibility_m": data.get("visibility_meters", 1500.0),
            "slope_deg": data.get("terrain_slope_degrees", 0.0),
            "person_count": data.get("nearby_person_count", 0),
            "seatbelt": data.get("seatbelt_status", "fastened")
        }

risk_engine = RiskEngine()
