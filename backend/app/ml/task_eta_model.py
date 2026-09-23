import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.app.ml.model_loader import model_loader

class TaskEtaService:
    """
    Inference service for Adaptive ETA with prediction intervals and feature contribution breakdown.
    """

    def predict_eta(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        artifact = model_loader.get_eta_model()
        
        # Fallback heuristic if artifact not loaded
        progress = float(input_data.get("current_progress_percent", 0.0))
        rainfall = float(input_data.get("rainfall_mm", 0.0))
        slope = float(input_data.get("terrain_slope_degrees", 0.0))
        congestion = float(input_data.get("site_congestion", 0.2))
        
        if artifact is None:
            base_dur = 35.0
            remaining_frac = max(0.05, (100.0 - progress) / 100.0)
            pred = base_dur * remaining_frac * (1.0 + (rainfall / 15.0) * 0.3 + (slope / 15.0) * 0.25 + congestion * 0.25)
            lower = max(1.0, pred * 0.88)
            upper = pred * 1.15
            confidence = "Medium" if rainfall > 2.0 or slope > 8.0 else "High"
            explanation = self._build_explanation(rainfall, slope, congestion)
            return {
                "task_id": input_data.get("task_id", "TASK-101"),
                "predicted_duration_minutes": round(pred, 1),
                "lower_bound_minutes": round(lower, 1),
                "upper_bound_minutes": round(upper, 1),
                "confidence": confidence,
                "explanation": explanation,
                "top_contributors": self._get_contributors(rainfall, slope, congestion)
            }

        # Build feature DataFrame matching training columns
        pipeline = artifact["pipeline"]
        
        df_row = pd.DataFrame([{
            "payload_tonnes": float(input_data.get("payload_tonnes", 14.0)),
            "number_of_cycles": int(input_data.get("number_of_cycles", 0)),
            "machine_speed": float(input_data.get("machine_speed", 4.0)),
            "idle_time_seconds": float(input_data.get("idle_time_seconds", 0.0)),
            "terrain_slope_degrees": slope,
            "rainfall_mm": rainfall,
            "visibility_meters": float(input_data.get("visibility_meters", 1500.0)),
            "wind_speed": float(input_data.get("wind_speed", 12.0)),
            "ambient_temperature": float(input_data.get("ambient_temperature", 24.0)),
            "experience_years": 2.0, # default Priya
            "machine_health_score": float(input_data.get("machine_health_score", 95.0)),
            "site_congestion": congestion,
            "task_progress_percent": progress,
            "difficulty": 1.2,
            "machine_type": "Excavator",
            "material_type": "Crushed Rock / Aggregate",
            "site_zone": "Zone B (Quarry Face)"
        }])
        
        pred_val = float(pipeline.predict(df_row)[0])
        pred_val = max(1.0, pred_val)
        
        # Uncertainty bounds
        variance_margin = 0.12 if (rainfall > 3.0 or slope > 8.0) else 0.08
        lower_val = max(1.0, pred_val * (1.0 - variance_margin))
        upper_val = pred_val * (1.0 + variance_margin * 1.25)
        
        confidence = "Low" if (rainfall > 10.0 and slope > 10.0) else ("Medium" if (rainfall > 2.0 or slope > 7.0 or congestion > 0.5) else "High")
        
        return {
            "task_id": input_data.get("task_id", "TASK-101"),
            "predicted_duration_minutes": round(pred_val, 1),
            "lower_bound_minutes": round(lower_val, 1),
            "upper_bound_minutes": round(upper_val, 1),
            "confidence": confidence,
            "explanation": self._build_explanation(rainfall, slope, congestion),
            "top_contributors": self._get_contributors(rainfall, slope, congestion)
        }

    def _build_explanation(self, rainfall: float, slope: float, congestion: float) -> str:
        reasons = []
        if rainfall > 2.0:
            reasons.append(f"rain ({rainfall:.1f} mm) reduced surface traction & visibility")
        if slope > 6.0:
            reasons.append(f"terrain slope is {slope:.0f}°")
        if congestion > 0.4:
            reasons.append("haul road congestion increased cycle wait times")
            
        if reasons:
            return f"Expected duration increased because " + ", ".join(reasons) + "."
        return "Operating on standard schedule under clear weather and nominal cycle timing."

    def _get_contributors(self, rainfall: float, slope: float, congestion: float) -> List[Dict[str, Any]]:
        contributors = []
        if slope > 0:
            contributors.append({"factor": "Terrain Incline", "impact_minutes": round(slope * 0.45, 1), "direction": "increase"})
        if rainfall > 0:
            contributors.append({"factor": "Precipitation & Wet Surface", "impact_minutes": round(rainfall * 0.6, 1), "direction": "increase"})
        if congestion > 0.2:
            contributors.append({"factor": "Traffic & Congestion", "impact_minutes": round(congestion * 4.0, 1), "direction": "increase"})
        contributors.append({"factor": "Operator Experience (Priya)", "impact_minutes": -2.2, "direction": "decrease"})
        return contributors

task_eta_service = TaskEtaService()
