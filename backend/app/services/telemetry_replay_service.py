import asyncio
import json
from typing import Dict, Any, List, Set
from fastapi import WebSocket
from datetime import datetime
from backend.app.safety.risk_engine import risk_engine
from backend.app.ml.task_eta_model import task_eta_service
from backend.app.ml.anomaly_model import anomaly_service

class TelemetryReplayService:
    def __init__(self):
        self.active_websockets: Set[WebSocket] = set()
        self.current_stage = 1
        self.is_paused = False
        self.tick_counter = 0
        
        # In-memory active machine state
        self.state: Dict[str, Any] = self._get_stage_state(1)

    async def register(self, websocket: WebSocket):
        await websocket.accept()
        self.active_websockets.add(websocket)
        # Send immediate current state
        await websocket.send_json({"type": "STATE_UPDATE", "data": self.get_current_snapshot()})

    def unregister(self, websocket: WebSocket):
        self.active_websockets.discard(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        dead = []
        for ws in self.active_websockets:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for d in dead:
            self.active_websockets.discard(d)

    def set_stage(self, stage: int):
        self.current_stage = max(1, min(6, stage))
        self.state = self._get_stage_state(self.current_stage)
        return self.get_current_snapshot()

    def next_stage(self):
        next_s = (self.current_stage % 6) + 1
        return self.set_stage(next_s)

    def pause(self, paused: bool):
        self.is_paused = paused
        return {"paused": self.is_paused, "stage": self.current_stage}

    def reset(self):
        return self.set_stage(1)

    def acknowledge_critical_alert(self):
        self.state["alert"]["acknowledged"] = True
        self.state["telemetry"]["machine_state"] = "parked"
        self.state["telemetry"]["machine_speed"] = 0.0
        self.state["telemetry"]["machine_direction"] = "neutral"
        return self.get_current_snapshot()

    def get_current_snapshot(self) -> Dict[str, Any]:
        # Recalculate dynamic safety alert & ETA for snapshot
        t = self.state["telemetry"]
        safety_eval = risk_engine.evaluate(t)
        
        # Maintain acknowledged state if previously clicked
        if self.state.get("alert", {}).get("acknowledged", False):
            safety_eval["acknowledged"] = True

        eta_res = task_eta_service.predict_eta(t)
        anomaly_res = anomaly_service.evaluate_telemetry(t, operator_id=t.get("operator_id", "OP-001"), task_id=t.get("task_id", "TASK-101"))

        self.state["alert"] = safety_eval
        self.state["eta"] = eta_res
        self.state["anomaly"] = anomaly_res
        self.state["current_stage"] = self.current_stage
        self.state["is_paused"] = self.is_paused
        return self.state

    def _get_stage_state(self, stage: int) -> Dict[str, Any]:
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        
        base_t = {
            "timestamp": now_str,
            "shift_id": "SHIFT-2026-0923-01",
            "operator_id": "OP-001",
            "operator_name": "Priya Raman",
            "machine_id": "CAT-EX-336",
            "machine_name": "Cat 336 Hydraulic Excavator",
            "machine_type": "Excavator",
            "task_id": "TASK-101",
            "task_name": "Load aggregate into haul trucks - Zone B",
            "engine_hours": 3414.2,
            "engine_rpm": 1820.0,
            "engine_load": 62.0,
            "fuel_level": 82.5,
            "fuel_consumption_rate": 18.5,
            "hydraulic_temperature": 74.0,
            "coolant_temperature": 82.0,
            "hydraulic_pressure": 240.0,
            "machine_speed": 4.5,
            "machine_direction": "forward",
            "machine_state": "operating",
            "idle_time_seconds": 120.0,
            "cycle_time_seconds": 41.5,
            "payload_tonnes": 14.5,
            "bucket_load_percent": 80.5,
            "number_of_cycles": 8,
            "operating_mode": "Productivity",
            "site_zone": "Zone B (Quarry Face)",
            "terrain_slope_degrees": 2.0,
            "vibration": 0.28,
            "ambient_temperature": 26.0,
            "rainfall_mm": 0.0,
            "visibility_meters": 1800.0,
            "wind_speed": 12.0,
            "seatbelt_status": "fastened",
            "proximity_distance_meters": 22.0,
            "nearby_person_count": 0,
            "nearby_vehicle_count": 1,
            "fault_code": "NONE",
            "machine_health_score": 92.0,
            "task_progress_percent": 28.0,
            "site_congestion": 0.2
        }

        # Stage 1: Shift Start & Initial Baseline ETA
        if stage == 1:
            base_t.update({
                "task_progress_percent": 10.0,
                "number_of_cycles": 3,
                "terrain_slope_degrees": 1.0,
                "rainfall_mm": 0.0,
                "visibility_meters": 2000.0,
                "machine_speed": 2.0,
                "fuel_consumption_rate": 17.8
            })
            stage_desc = "Stage 1: Shift Started — Pre-start checks verified. Baseline ETA: 32 min (28–37 min range)."

        # Stage 2: Normal Operation Progress
        elif stage == 2:
            base_t.update({
                "task_progress_percent": 42.0,
                "number_of_cycles": 12,
                "terrain_slope_degrees": 2.5,
                "rainfall_mm": 0.0,
                "visibility_meters": 1800.0,
                "machine_speed": 4.8,
                "fuel_consumption_rate": 18.2
            })
            stage_desc = "Stage 2: Normal Telemetry — Steady cycle pace, healthy machine vitals, normal aggregate loading."

        # Stage 3: Weather Worsens & Adaptive ETA Jump
        elif stage == 3:
            base_t.update({
                "task_progress_percent": 55.0,
                "number_of_cycles": 16,
                "terrain_slope_degrees": 12.0,
                "rainfall_mm": 8.5,
                "visibility_meters": 280.0,
                "wind_speed": 32.0,
                "machine_speed": 3.2,
                "site_congestion": 0.65,
                "fuel_consumption_rate": 21.2
            })
            stage_desc = "Stage 3: Weather Worsens — Rain starts, visibility falls, 12° slope. Adaptive ETA updates to 41 min."

        # Stage 4: Reversing Critical Safety Hazard
        elif stage == 4:
            base_t.update({
                "task_progress_percent": 68.0,
                "number_of_cycles": 19,
                "terrain_slope_degrees": 6.0,
                "rainfall_mm": 6.0,
                "visibility_meters": 240.0,
                "machine_speed": 7.0,
                "machine_direction": "reverse",
                "machine_state": "reversing",
                "proximity_distance_meters": 4.2,
                "nearby_person_count": 1,
                "nearby_vehicle_count": 1
            })
            stage_desc = "Stage 4: Critical Safety Event — Person at 4.2m while reversing at 7 km/h in rain. Immediate STOP alert."

        # Stage 5: Fuel Anomaly (+18%) & Explainable Attribution
        elif stage == 5:
            base_t.update({
                "task_progress_percent": 82.0,
                "number_of_cycles": 23,
                "terrain_slope_degrees": 12.0,
                "payload_tonnes": 16.8,
                "rainfall_mm": 4.0,
                "visibility_meters": 450.0,
                "machine_speed": 3.8,
                "machine_direction": "forward",
                "machine_state": "operating",
                "fuel_consumption_rate": 22.8, # +18% vs 18.5 baseline
                "idle_time_seconds": 540.0, # 9 minutes
                "engine_rpm": 1950.0,
                "proximity_distance_meters": 18.0,
                "nearby_person_count": 0
            })
            stage_desc = "Stage 5: Explainable Anomaly — Fuel rate +18% above baseline explained by 12° slope, payload, and idle."

        # Stage 6: Shift Completion & Debrief
        else: # stage == 6
            base_t.update({
                "task_progress_percent": 100.0,
                "number_of_cycles": 28,
                "machine_speed": 0.0,
                "machine_direction": "neutral",
                "machine_state": "parked",
                "terrain_slope_degrees": 0.0,
                "proximity_distance_meters": 35.0,
                "nearby_person_count": 0,
                "fuel_consumption_rate": 2.8
            })
            stage_desc = "Stage 6: Shift Concluded — 7/8 tasks done, +8% productivity, 1 critical alert acknowledged, training assigned."

        return {
            "stage_id": stage,
            "stage_description": stage_desc,
            "telemetry": base_t,
            "alert": {},
            "eta": {},
            "anomaly": {}
        }

telemetry_replay_service = TelemetryReplayService()
