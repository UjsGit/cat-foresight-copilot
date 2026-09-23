import os
import pandas as pd
from backend.app.db.database import SessionLocal, Base, engine
from backend.app.models import (
    Operator, Machine, Task, Telemetry, SafetyEvent, Incident, TrainingRecord, Shift
)
from backend.app.core.config import settings

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    data_dir = settings.SYNTHETIC_DATA_DIR
    if not os.path.exists(os.path.join(data_dir, "operators.csv")):
        print(f"Data dir {data_dir} missing CSVs. Running generator first...")
        from ml.scripts.generate_synthetic_data import generate_telemetry_dataset, generate_metadata_tables
        generate_telemetry_dataset(num_records=5000) # Fast seed
        generate_metadata_tables()

    # 1. Seed Operators
    if db.query(Operator).count() == 0:
        ops_df = pd.read_csv(os.path.join(data_dir, "operators.csv"))
        for _, row in ops_df.iterrows():
            db.add(Operator(
                operator_id=str(row["operator_id"]),
                name=str(row["name"]),
                experience_years=float(row["experience_years"]),
                experience_level=str(row["experience_level"]),
                shift_preference=str(row["shift_preference"]),
                avg_cycle_time_sec=float(row["avg_cycle_time_sec"]),
                efficiency_rating=float(row["efficiency_rating"]),
                safety_score=float(row["safety_score"]),
                avatar=str(row.get("avatar", ""))
            ))
        print("Seeded operators.")

    # 2. Seed Machines
    if db.query(Machine).count() == 0:
        mach_df = pd.read_csv(os.path.join(data_dir, "machines.csv"))
        for _, row in mach_df.iterrows():
            db.add(Machine(
                machine_id=str(row["machine_id"]),
                model_name=str(row["model_name"]),
                machine_type=str(row["machine_type"]),
                nominal_power_hp=int(row["nominal_power_hp"]),
                operating_weight_tonnes=float(row["operating_weight_tonnes"]),
                max_payload_tonnes=float(row["max_payload_tonnes"]),
                fuel_capacity_litres=float(row["fuel_capacity_litres"]),
                current_hours=float(row["current_hours"]),
                health_score=float(row["health_score"]),
                firmware_version=str(row["firmware_version"])
            ))
        print("Seeded machines.")

    # 3. Seed Tasks
    if db.query(Task).count() == 0:
        tasks_df = pd.read_csv(os.path.join(data_dir, "tasks.csv"))
        for _, row in tasks_df.iterrows():
            db.add(Task(
                task_id=str(row["task_id"]),
                task_name=str(row["task_name"]),
                machine_type=str(row["machine_type"]),
                target_tonnes=float(row["target_tonnes"]),
                material_type=str(row["material_type"]),
                difficulty=float(row["difficulty"]),
                site_zone=str(row["site_zone"]),
                target_cycle_count=int(row["target_cycle_count"]),
                baseline_duration_minutes=float(row["baseline_duration_minutes"])
            ))
        print("Seeded tasks.")

    # 4. Seed Safety Events
    if db.query(SafetyEvent).count() == 0 and os.path.exists(os.path.join(data_dir, "safety_events.csv")):
        events_df = pd.read_csv(os.path.join(data_dir, "safety_events.csv"))
        for _, row in events_df.iterrows():
            db.add(SafetyEvent(
                event_id=str(row["event_id"]),
                timestamp=str(row["timestamp"]),
                operator_id=str(row["operator_id"]),
                machine_id=str(row["machine_id"]),
                event_type=str(row["event_type"]),
                severity=str(row["severity"]),
                risk_score=float(row["risk_score"]),
                title=str(row["title"]),
                reason=str(row["reason"]),
                recommended_action=str(row["recommended_action"]),
                proximity_distance=float(row["proximity_distance"]) if pd.notna(row["proximity_distance"]) else None,
                machine_speed=float(row["machine_speed"]) if pd.notna(row["machine_speed"]) else None,
                machine_direction=str(row["machine_direction"]) if pd.notna(row["machine_direction"]) else None,
                weather=str(row.get("weather", "Clear")),
                visibility_meters=float(row["visibility_meters"]) if pd.notna(row.get("visibility_meters")) else None,
                acknowledged=bool(row["acknowledged"]),
                acknowledged_at=str(row.get("acknowledged_at", "")) if pd.notna(row.get("acknowledged_at")) else None,
                incident_created=bool(row.get("incident_created", False))
            ))
        print("Seeded safety events.")

    # 5. Seed Incidents
    if db.query(Incident).count() == 0 and os.path.exists(os.path.join(data_dir, "incidents.csv")):
        inc_df = pd.read_csv(os.path.join(data_dir, "incidents.csv"))
        for _, row in inc_df.iterrows():
            db.add(Incident(
                incident_id=str(row["incident_id"]),
                event_id=str(row["event_id"]) if pd.notna(row.get("event_id")) else None,
                timestamp=str(row["timestamp"]),
                operator_id=str(row["operator_id"]),
                operator_name=str(row["operator_name"]),
                machine_id=str(row["machine_id"]),
                severity=str(row["severity"]),
                title=str(row["title"]),
                description=str(row["description"]),
                status=str(row.get("status", "Acknowledged & Resolved")),
                resolution_notes=str(row.get("resolution_notes", "")),
                follow_up_training_required=str(row.get("follow_up_training_required", ""))
            ))
        print("Seeded incidents.")

    # 6. Seed Training Records
    if db.query(TrainingRecord).count() == 0 and os.path.exists(os.path.join(data_dir, "training_records.csv")):
        trn_df = pd.read_csv(os.path.join(data_dir, "training_records.csv"))
        for _, row in trn_df.iterrows():
            db.add(TrainingRecord(
                training_id=str(row["training_id"]),
                title=str(row["title"]),
                duration_minutes=int(row["duration_minutes"]),
                category=str(row["category"]),
                recommended_reason=str(row["recommended_reason"]),
                completed=bool(row["completed"]),
                score=int(row["score"]) if pd.notna(row.get("score")) else None,
                assigned_to=str(row["assigned_to"])
            ))
        print("Seeded training records.")

    # 7. Seed Initial Active Shift for Priya Raman
    if db.query(Shift).count() == 0:
        db.add(Shift(
            shift_id="SHIFT-2026-0923-01",
            operator_id="OP-001",
            machine_id="CAT-EX-336",
            task_id="TASK-101",
            start_time="2026-09-23 08:30:00",
            status="active",
            pre_start_completed=True,
            pre_start_checklist='{"seatbelt": true, "cameras": true, "fuel": true, "dtc": true, "weather": true, "task": true}',
            total_tonnes_moved=210.0,
            cycles_completed=18,
            fuel_consumed_litres=54.2,
            idle_minutes=24.0,
            safety_incidents_count=1,
            productivity_score=108.0
        ))
        print("Seeded default active demo shift.")

    # 8. Seed sample telemetry if empty
    if db.query(Telemetry).count() == 0 and os.path.exists(os.path.join(data_dir, "telemetry.csv")):
        t_df = pd.read_csv(os.path.join(data_dir, "telemetry.csv")).head(200) # Initial 200 records in DB
        for _, row in t_df.iterrows():
            db.add(Telemetry(
                timestamp=str(row["timestamp"]),
                shift_id=str(row.get("shift_id", "SHIFT-2026-0923-01")),
                machine_id=str(row["machine_id"]),
                operator_id=str(row["operator_id"]),
                machine_type=str(row["machine_type"]),
                task_id=str(row["task_id"]),
                engine_hours=float(row["engine_hours"]),
                engine_rpm=float(row["engine_rpm"]),
                engine_load=float(row["engine_load"]),
                fuel_level=float(row["fuel_level"]),
                fuel_consumption_rate=float(row["fuel_consumption_rate"]),
                hydraulic_temperature=float(row["hydraulic_temperature"]),
                coolant_temperature=float(row["coolant_temperature"]),
                hydraulic_pressure=float(row["hydraulic_pressure"]),
                machine_speed=float(row["machine_speed"]),
                machine_direction=str(row["machine_direction"]),
                machine_state=str(row["machine_state"]),
                idle_time_seconds=float(row["idle_time_seconds"]),
                cycle_time_seconds=float(row["cycle_time_seconds"]),
                payload_tonnes=float(row["payload_tonnes"]),
                bucket_load_percent=float(row["bucket_load_percent"]),
                number_of_cycles=int(row["number_of_cycles"]),
                operating_mode=str(row["operating_mode"]),
                latitude=float(row["latitude"]),
                longitude=float(row["longitude"]),
                site_zone=str(row["site_zone"]),
                terrain_slope_degrees=float(row["terrain_slope_degrees"]),
                vibration=float(row["vibration"]),
                ambient_temperature=float(row["ambient_temperature"]),
                rainfall_mm=float(row["rainfall_mm"]),
                visibility_meters=float(row["visibility_meters"]),
                wind_speed=float(row["wind_speed"]),
                seatbelt_status=str(row["seatbelt_status"]),
                proximity_distance_meters=float(row["proximity_distance_meters"]) if pd.notna(row.get("proximity_distance_meters")) else None,
                nearby_person_count=int(row["nearby_person_count"]),
                nearby_vehicle_count=int(row["nearby_vehicle_count"]),
                fault_code=str(row["fault_code"]),
                machine_health_score=float(row["machine_health_score"]),
                task_progress_percent=float(row["task_progress_percent"]),
                site_congestion=float(row.get("site_congestion", 0.2))
            ))
        print("Seeded initial telemetry samples.")

    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_db()
