import json
import os
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.training import TrainingRecord
from backend.app.core.config import settings

class TrainingService:
    @staticmethod
    def get_recommendations(db: Session, operator_id: str = "OP-001") -> List[Dict[str, Any]]:
        # Load structured modules from JSON
        modules_file = os.path.join(settings.KNOWLEDGE_BASE_DIR, "training_modules.json")
        modules = []
        if os.path.exists(modules_file):
            try:
                with open(modules_file, "r", encoding="utf-8") as f:
                    modules = json.load(f)
            except Exception as e:
                print(f"Error loading training modules JSON: {e}")

        # Check completed status from DB
        db_records = {r.training_id: r for r in db.query(TrainingRecord).filter(TrainingRecord.assigned_to == operator_id).all()}
        
        results = []
        for m in modules:
            m_id = m["id"]
            db_rec = db_records.get(m_id)
            is_completed = db_rec.completed if db_rec else False
            score = db_rec.score if db_rec else None
            
            results.append({
                "id": m["id"],
                "title": m["title"],
                "category": m["category"],
                "duration_minutes": m["duration_minutes"],
                "icon": m.get("icon", "ShieldAlert"),
                "description": m["description"],
                "trigger_reason": m["trigger_reason"],
                "key_takeaways": m.get("key_takeaways", []),
                "completed": is_completed,
                "score": score,
                "quiz": m.get("quiz")
            })
        return results

    @staticmethod
    def complete_training(db: Session, training_id: str, operator_id: str = "OP-001", score: int = 100) -> Dict[str, Any]:
        rec = db.query(TrainingRecord).filter(
            TrainingRecord.training_id == training_id,
            TrainingRecord.assigned_to == operator_id
        ).first()
        
        if not rec:
            rec = TrainingRecord(
                training_id=training_id,
                title=training_id,
                assigned_to=operator_id,
                completed=True,
                score=score,
                recommended_reason="Operator completed self-paced module."
            )
            db.add(rec)
        else:
            rec.completed = True
            rec.score = score
            
        db.commit()
        return {"training_id": training_id, "completed": True, "score": score}

training_service = TrainingService()
