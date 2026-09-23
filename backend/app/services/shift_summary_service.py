from sqlalchemy.orm import Session
from typing import Dict, Any, List
from backend.app.models import Shift, Operator, Machine, Incident, SafetyEvent
from backend.app.services.training_service import training_service

class ShiftSummaryService:
    @staticmethod
    def get_summary(db: Session, operator_id: str = "OP-001") -> Dict[str, Any]:
        operator = db.query(Operator).filter(Operator.operator_id == operator_id).first()
        op_name = operator.name if operator else "Priya Raman"
        
        machine = db.query(Machine).filter(Machine.machine_id == "CAT-EX-336").first()
        mach_name = machine.model_name if machine else "Cat 336 Hydraulic Excavator"

        # Fetch incidents
        incidents = db.query(Incident).filter(Incident.operator_id == operator_id).all()
        crit_count = len(incidents)
        ack_count = sum(1 for inc in incidents if "Acknowledged" in inc.status)

        # Notable timeline events
        events = [
            {
                "timestamp": "08:30:00",
                "type": "SHIFT_START",
                "title": "Shift Commenced & Pre-Start Verified",
                "description": "Passed 6/6 mandatory safety inspection walkaround items.",
                "severity": "INFO"
            },
            {
                "timestamp": "09:14:22",
                "type": "SAFETY_HAZARD",
                "title": "Critical Proximity Alert: Reversing Hazard (4.2m)",
                "description": "Person entered blind zone while reversing in rain. Operator acknowledged within 6s and stopped safely.",
                "severity": "CRITICAL"
            },
            {
                "timestamp": "10:05:40",
                "type": "EFFICIENCY_ANOMALY",
                "title": "Fuel Burn Rate Spike (+18% vs Baseline)",
                "description": "Attributed to 12° slope grade resistance and 16.2t aggregate payload density.",
                "severity": "WARNING"
            },
            {
                "timestamp": "11:45:00",
                "type": "TASK_MILESTONE",
                "title": "Aggregate Loading Target Achieved (350 Tonnes)",
                "description": "Completed 28 truck cycles ahead of dynamic ETA curve.",
                "severity": "INFO"
            }
        ]

        rec_trainings = training_service.get_recommendations(db, operator_id)

        # Balanced feedback message per requirements
        supervisor_msg = (
            "Strong task pace under challenging conditions. One high-risk reversing event was identified and acknowledged. "
            "Focus on rear-zone verification and idle management."
        )

        return {
            "shift_id": "SHIFT-2026-0923-01",
            "operator_id": operator_id,
            "operator_name": op_name,
            "machine_id": "CAT-EX-336",
            "machine_name": mach_name,
            "duration_hours": 7.5,
            "tasks_completed": "7 / 8",
            "productivity_pct_vs_baseline": 8.0,
            "total_fuel_litres": 54.2,
            "fuel_efficiency_score": 86.5,
            "idle_time_minutes": 24.0,
            "critical_alerts_count": crit_count,
            "critical_alerts_acknowledged": max(1, ack_count),
            "machine_health_status": "Nominal (92/100)",
            "eta_prediction_accuracy_pct": 96.2,
            "supervisor_review_message": supervisor_msg,
            "recommended_trainings": rec_trainings,
            "notable_timeline_events": events
        }

shift_summary_service = ShiftSummaryService()
