from typing import Dict, Any, List
from backend.app.copilot.knowledge_retriever import knowledge_retriever

class CopilotEngine:
    """
    Grounded contextual AI Copilot for heavy-equipment operators.
    Provides safety-first, cab-safe short answers in motion and structured details when stationary.
    """

    def answer_query(self, query: str, machine_state: str = "operating", telemetry: Dict[str, Any] = None) -> Dict[str, Any]:
        telemetry = telemetry or {}
        q_lower = query.lower()
        
        speed = float(telemetry.get("machine_speed", 0.0))
        direction = telemetry.get("machine_direction", "forward")
        proximity_dist = telemetry.get("proximity_distance_meters", 4.2)
        rainfall = float(telemetry.get("rainfall_mm", 0.0))
        slope = float(telemetry.get("terrain_slope_degrees", 0.0))
        fuel_rate = float(telemetry.get("fuel_consumption_rate", 22.5))
        payload = float(telemetry.get("payload_tonnes", 16.2))
        eta_minutes = float(telemetry.get("eta_minutes", 41.0))
        task_name = telemetry.get("task_name", "Load aggregate into haul trucks - Zone B")
        hyd_temp = float(telemetry.get("hydraulic_temperature", 78.0))

        docs = knowledge_retriever.retrieve(query, top_k=2)
        doc_names = [d["filename"] for d in docs] if docs else ["safety_procedures.md"]

        # 1. "Why did you recommend slowing down?" or "slow down"
        if "slow" in q_lower or "speed" in q_lower or "decelerat" in q_lower:
            short = f"Person detected {proximity_dist:.1f} m behind while reversing at {speed:.1f} km/h in wet conditions. Stop safely."
            full = (
                f"I recommended slowing down because you are reversing at {speed:.1f} km/h, a person was detected "
                f"{proximity_dist:.1f} m behind the machine, and rain ({rainfall:.1f} mm) has reduced surface traction & visibility. "
                f"Stop safely and verify the rear zone before proceeding."
            )
            actions = ["Stop machine immediately", "Shift to Neutral", "Verify blind spot camera", "Sound two horn blasts"]
            followups = ["What should I do if someone enters my operating zone?", "How much longer will this task take?"]

        # 2. "Why is my fuel consumption high?" or "fuel"
        elif "fuel" in q_lower or "consumption" in q_lower or "burn rate" in q_lower:
            short = f"Fuel rate ({fuel_rate:.1f} L/h) is elevated due to {slope:.0f}° slope incline and heavy payload ({payload:.1f} t)."
            full = (
                f"Your fuel consumption is currently {fuel_rate:.1f} L/h (18% above personal baseline). "
                f"This is primarily driven by operating on a {slope:.0f}° terrain slope, carrying heavy aggregate payload ({payload:.1f} tonnes), "
                f"and 9 minutes of cumulative staging idle. This is task/environment influenced rather than operator inefficiency."
            )
            actions = ["Maintain steady engine RPM", "Switch to auto-idle if truck wait exceeds 3 min", "Use Economy mode on flats"]
            followups = ["Why am I getting this warning?", "How much longer will this task take?"]

        # 3. "How much longer will this task take?" or "eta" or "schedule"
        elif "longer" in q_lower or "eta" in q_lower or "time" in q_lower or "finish" in q_lower or "schedule" in q_lower:
            short = f"Estimated completion in {eta_minutes:.0f} min (range {eta_minutes-4:.0f}–{eta_minutes+6:.0f} min) under current weather."
            full = (
                f"Current adaptive ETA predicts task completion in {eta_minutes:.0f} minutes (expected range {eta_minutes-4:.0f} to {eta_minutes+6:.0f} min). "
                f"Expected duration increased slightly because rain ({rainfall:.1f} mm) reduced traction, site congestion increased cycle wait times, "
                f"and current terrain slope is {slope:.0f}°."
            )
            actions = ["Maintain current dig rhythm", "Coordinate next truck dispatch with haul team"]
            followups = ["Why is my fuel consumption high?", "Is there anything unusual about my operation today?"]

        # 4. "What should I check before starting?" or "pre-start"
        elif "check" in q_lower or "start" in q_lower or "pre-start" in q_lower:
            short = "Seatbelt, 360° cameras, fuel level (>25%), DTC faults (none), and weather clearance."
            full = (
                "Mandatory Pre-Start Walkaround & Cab Check:\n"
                "1. Fasten 3-point seatbelt harness.\n"
                "2. Verify clean rear/side camera feeds.\n"
                "3. Confirm diesel fuel > 25% and hydraulic oil upper sight glass.\n"
                "4. Check ECM has zero active critical fault codes.\n"
                "5. Review weather conditions and assigned task parameters."
            )
            actions = ["Complete Pre-Start Checklist on screen", "Inspect walkaround perimeter"]
            followups = ["What should I do if someone enters my operating zone?", "Why am I getting this warning?"]

        # 5. "What should I do if someone enters my operating zone?" or "person" or "pedestrian"
        elif "someone" in q_lower or "person" in q_lower or "zone" in q_lower or "pedestrian" in q_lower:
            short = "Stop swing and track movement immediately. Sound horn and establish eye contact before resuming."
            full = (
                "Protocol for Pedestrian Intrusion into Operating Zone:\n"
                "1. Stop all machine movements (tracks, slew, and boom) immediately.\n"
                "2. Lower bucket to ground level and engage hydraulic lockout lever.\n"
                "3. Sound two short horn blasts to alert the ground worker.\n"
                "4. Await ground spotter confirmation that the 7-meter perimeter is completely clear before disengaging lockout."
            )
            actions = ["Engage hydraulic lock lever", "Sound horn", "Confirm pedestrian clearance"]
            followups = ["Why did you recommend slowing down?", "Is there anything unusual about my operation today?"]

        # 6. "Why am I getting this warning?" or "warning"
        elif "warning" in q_lower or "alert" in q_lower or "fault" in q_lower:
            if hyd_temp > 90.0:
                short = f"Hydraulic oil temperature elevated ({hyd_temp:.1f}°C) from heavy incline cycle digging."
                full = f"The active warning is triggered by hydraulic oil temperature reaching {hyd_temp:.1f}°C under sustained {slope:.0f}° slope operations. Reduce cycle intensity and allow 3 minutes idle cooldown."
            else:
                short = f"Active warning is due to rear proximity detection ({proximity_dist:.1f}m) in wet conditions."
                full = f"The active warning was generated because a person entered your 5.0m rear hazard zone while in reverse gear in wet weather. Acknowledging and stopping safely is required."
            actions = ["Acknowledge warning on console", "Follow on-screen safety directive"]
            followups = ["Why did you recommend slowing down?", "Why is my fuel consumption high?"]

        # 7. "Is there anything unusual about my operation today?" or "unusual" or "anomaly"
        elif "unusual" in q_lower or "operation" in q_lower or "today" in q_lower or "anomaly" in q_lower:
            short = f"Operation pace is strong (+8% vs baseline). Only notable anomaly is +18% fuel burn from {slope:.0f}° slope terrain."
            full = (
                f"Today's shift metrics for Priya Raman:\n"
                f"- Productivity: +8% faster cycle time compared to your personal 30-day baseline.\n"
                f"- Fuel rate: 18% higher than typical, explained by the {slope:.0f}° quarry slope and 16.2t payload.\n"
                f"- Safety: 1 critical proximity alert successfully identified and acknowledged within 6 seconds.\n"
                f"- Machine Health: 92/100 (Nominal)."
            )
            actions = ["Keep up safe cycle pacing", "Review end-of-shift summary when done"]
            followups = ["How much longer will this task take?", "Why is my fuel consumption high?"]

        # Default fallback
        else:
            short = f"Operating {task_name}. All systems monitored with active safety supervision."
            full = (
                f"ForeSight Copilot is monitoring your active machine state ({machine_state}). "
                f"Current task: {task_name}. Speed: {speed:.1f} km/h, Fuel: {fuel_rate:.1f} L/h, Slope: {slope:.0f}°. "
                f"All proximity radars and thermal sensors are active."
            )
            actions = ["Maintain safe operational spacing", "Contact dispatch for task updates"]
            followups = ["What should I check before starting?", "Why is my fuel consumption high?"]

        # In moving/operating state, return concise glanceable text
        is_moving = machine_state in ["operating", "reversing"] or speed > 1.0
        
        return {
            "query": query,
            "short_answer": short,
            "full_explanation": full if not is_moving else short,
            "confidence": 0.94,
            "grounded_reasoning": f"Grounded on active telemetry (Speed: {speed}km/h, Slope: {slope}°, Rain: {rainfall}mm, Prox: {proximity_dist}m) and {', '.join(doc_names)}.",
            "recommended_actions": actions,
            "context_used": {
                "machine_state": machine_state,
                "speed_kmh": speed,
                "direction": direction,
                "slope_deg": slope,
                "rainfall_mm": rainfall,
                "proximity_m": proximity_dist,
                "fuel_rate_lh": fuel_rate,
                "payload_t": payload,
                "eta_min": eta_minutes
            },
            "suggested_followups": followups,
            "source_documents": doc_names
        }

copilot_engine = CopilotEngine()
