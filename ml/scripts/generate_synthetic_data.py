"""
Synthetic Data Generator for CAT ForeSight Copilot
Generates ~30,000 realistic, physics-correlated telemetry records across operators, machines, and tasks.
"""

import os
import random
import datetime
import numpy as np
import pandas as pd

random.seed(42)
np.random.seed(42)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "synthetic_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Operators
OPERATORS = [
    {
        "operator_id": "OP-001",
        "name": "Priya Raman",
        "experience_years": 2.0,
        "experience_level": "intermediate",
        "shift_preference": "Day",
        "avg_cycle_time_sec": 42.0,
        "efficiency_rating": 88.5,
        "safety_score": 94.0,
        "avatar": "/avatars/priya.png"
    },
    {
        "operator_id": "OP-002",
        "name": "Arjun Kumar",
        "experience_years": 8.5,
        "experience_level": "expert",
        "shift_preference": "Day",
        "avg_cycle_time_sec": 36.0,
        "efficiency_rating": 95.0,
        "safety_score": 98.2,
        "avatar": "/avatars/arjun.png"
    },
    {
        "operator_id": "OP-003",
        "name": "Rahul Das",
        "experience_years": 0.35, # ~4 months
        "experience_level": "novice",
        "shift_preference": "Night",
        "avg_cycle_time_sec": 52.0,
        "efficiency_rating": 76.0,
        "safety_score": 86.5,
        "avatar": "/avatars/rahul.png"
    }
]

# 2. Machines
MACHINES = [
    {
        "machine_id": "CAT-EX-336",
        "model_name": "Cat 336 Hydraulic Excavator",
        "machine_type": "Excavator",
        "nominal_power_hp": 314,
        "operating_weight_tonnes": 37.2,
        "max_payload_tonnes": 18.0,
        "fuel_capacity_litres": 600.0,
        "current_hours": 3412.5,
        "health_score": 92.0,
        "firmware_version": "v4.18.2"
    },
    {
        "machine_id": "CAT-WL-966",
        "model_name": "Cat 966M Medium Wheel Loader",
        "machine_type": "Wheel Loader",
        "nominal_power_hp": 307,
        "operating_weight_tonnes": 23.2,
        "max_payload_tonnes": 14.0,
        "fuel_capacity_litres": 380.0,
        "current_hours": 1850.0,
        "health_score": 96.5,
        "firmware_version": "v4.19.0"
    },
    {
        "machine_id": "CAT-HT-745",
        "model_name": "Cat 745 Articulated Haul Truck",
        "machine_type": "Haul Truck",
        "nominal_power_hp": 504,
        "operating_weight_tonnes": 33.4,
        "max_payload_tonnes": 41.0,
        "fuel_capacity_litres": 550.0,
        "current_hours": 5120.0,
        "health_score": 84.0,
        "firmware_version": "v4.16.5"
    }
]

# 3. Tasks
TASKS = [
    {
        "task_id": "TASK-101",
        "task_name": "Load aggregate into haul trucks - Zone B",
        "machine_type": "Excavator",
        "target_tonnes": 350.0,
        "material_type": "Crushed Rock / Aggregate",
        "difficulty": 1.2,
        "site_zone": "Zone B (Quarry Face)",
        "target_cycle_count": 28,
        "baseline_duration_minutes": 35.0
    },
    {
        "task_id": "TASK-102",
        "task_name": "Trench excavation for drainage line",
        "machine_type": "Excavator",
        "target_tonnes": 180.0,
        "material_type": "Dense Clay / Gravel",
        "difficulty": 1.4,
        "site_zone": "Zone D (Perimeter Drainage)",
        "target_cycle_count": 40,
        "baseline_duration_minutes": 45.0
    },
    {
        "task_id": "TASK-103",
        "task_name": "Stockpile rehandling to crusher feed hopper",
        "machine_type": "Wheel Loader",
        "target_tonnes": 420.0,
        "material_type": "Sand & Fine Gravel",
        "difficulty": 0.9,
        "site_zone": "Zone A (Crusher Infeed)",
        "target_cycle_count": 35,
        "baseline_duration_minutes": 30.0
    },
    {
        "task_id": "TASK-104",
        "task_name": "Haul overburden to West Dump",
        "machine_type": "Haul Truck",
        "target_tonnes": 500.0,
        "material_type": "Overburden / Soft Rock",
        "difficulty": 1.1,
        "site_zone": "Haul Road 3 -> West Dump",
        "target_cycle_count": 12,
        "baseline_duration_minutes": 50.0
    }
]

def generate_telemetry_dataset(num_records=30000):
    records = []
    base_time = datetime.datetime(2026, 9, 1, 6, 0, 0)
    
    curr_time = base_time
    shift_id_counter = 1
    
    records_per_shift = 600
    num_shifts = (num_records // records_per_shift) + 1
    
    for shift_idx in range(num_shifts):
        operator = random.choice(OPERATORS)
        machine = random.choice([m for m in MACHINES if m["machine_type"] in ["Excavator", "Wheel Loader"]])
        matching_tasks = [t for t in TASKS if t["machine_type"] == machine["machine_type"]]
        task = random.choice(matching_tasks) if matching_tasks else TASKS[0]
        
        weather_condition = np.random.choice(["Clear", "Overcast", "Rain", "Heavy Rain", "Fog"], p=[0.50, 0.25, 0.15, 0.07, 0.03])
        if "Rain" in weather_condition:
            rainfall_mm = float(np.random.uniform(2.5, 18.0))
            visibility_meters = float(np.random.uniform(80.0, 450.0))
            wind_speed = float(np.random.uniform(15.0, 45.0))
        elif weather_condition == "Fog":
            rainfall_mm = 0.0
            visibility_meters = float(np.random.uniform(50.0, 200.0))
            wind_speed = float(np.random.uniform(2.0, 10.0))
        else:
            rainfall_mm = 0.0
            visibility_meters = float(np.random.uniform(800.0, 2500.0))
            wind_speed = float(np.random.uniform(5.0, 22.0))
            
        ambient_temp = float(np.random.uniform(18.0, 36.0))
        terrain_slope = float(np.random.choice([0.0, 2.5, 6.0, 9.5, 12.0, 14.5], p=[0.3, 0.25, 0.2, 0.12, 0.08, 0.05]))
        site_congestion = float(np.random.choice([0.1, 0.3, 0.6, 0.85], p=[0.4, 0.35, 0.15, 0.1]))
        
        fuel_level = float(np.random.uniform(65.0, 98.0))
        engine_hours = float(machine["current_hours"] + shift_idx * 7.5)
        machine_health = float(machine["health_score"] - np.random.uniform(0.0, 4.0))
        
        task_progress = 0.0
        cycles_done = 0
        total_tonnes_moved = 0.0
        idle_seconds_accum = 0.0
        
        for step in range(records_per_shift):
            if len(records) >= num_records:
                break
                
            curr_time += datetime.timedelta(seconds=15)
            
            state_r = np.random.rand()
            if state_r < 0.70:
                machine_state = "operating"
                direction = "forward"
                speed_kmh = float(np.random.uniform(1.5, 6.5) * (1.0 - 0.3 * site_congestion))
            elif state_r < 0.85:
                machine_state = "idle"
                direction = "neutral"
                speed_kmh = 0.0
                idle_seconds_accum += 15.0
            elif state_r < 0.95:
                machine_state = "reversing"
                direction = "reverse"
                speed_kmh = float(np.random.uniform(2.0, 8.5))
            else:
                machine_state = "parked"
                direction = "neutral"
                speed_kmh = 0.0
                
            if machine_state == "operating":
                payload = float(np.clip(np.random.normal(loc=machine["max_payload_tonnes"] * 0.85, scale=2.5), 2.0, machine["max_payload_tonnes"] * 1.15))
                bucket_load = float(min(100.0, (payload / machine["max_payload_tonnes"]) * 100.0))
            else:
                payload = 0.0
                bucket_load = 0.0
                
            base_rpm = 1800 if machine_state == "operating" else (850 if machine_state == "idle" else (1400 if machine_state == "reversing" else 0))
            slope_factor = 1.0 + (terrain_slope / 15.0) * 0.35
            payload_factor = 1.0 + (payload / 25.0) * 0.25
            operator_skill_factor = 1.05 if operator["experience_level"] == "novice" else (0.95 if operator["experience_level"] == "expert" else 1.0)
            
            engine_load = float(np.clip((45.0 * slope_factor * payload_factor * operator_skill_factor if machine_state == "operating" else (12.0 if machine_state == "idle" else 35.0)) + np.random.normal(0, 3.0), 5.0, 100.0))
            engine_rpm = float(np.clip(base_rpm * (0.85 + 0.25 * (engine_load / 100.0)) + np.random.normal(0, 35.0), 0.0, 2300.0))
            
            health_penalty = 1.0 + (100.0 - machine_health) * 0.003
            weather_fuel_penalty = 1.0 + (rainfall_mm / 20.0) * 0.08
            base_fuel_rate = (engine_load / 100.0) * 32.0 + (engine_rpm / 2000.0) * 8.0
            fuel_rate = float(max(2.8, base_fuel_rate * slope_factor * health_penalty * weather_fuel_penalty + np.random.normal(0, 1.2)))
            fuel_level = max(5.0, fuel_level - (fuel_rate / 3600.0) * (15.0 / 4.0))
            
            ambient_offset = (ambient_temp - 25.0) * 0.4
            hydraulic_temp = float(np.clip(68.0 + (engine_load / 100.0) * 22.0 + ambient_offset + (100.0 - machine_health)*0.15 + np.random.normal(0, 1.5), 40.0, 108.0))
            coolant_temp = float(np.clip(78.0 + (engine_load / 100.0) * 18.0 + ambient_offset + np.random.normal(0, 1.2), 50.0, 105.0))
            hydraulic_pressure = float(np.clip(180.0 + (payload / 25.0) * 120.0 + (terrain_slope / 15.0) * 40.0 + np.random.normal(0, 8.0), 80.0, 380.0))
            vibration = float(np.clip(0.15 + (speed_kmh / 10.0) * 0.35 + (terrain_slope / 15.0) * 0.25 + (100.0 - machine_health)*0.005 + np.random.normal(0, 0.04), 0.05, 1.8))
            
            exp_sec_reduction = (operator["experience_years"] / 10.0) * 6.0
            rain_sec_penalty = (rainfall_mm / 10.0) * 5.0
            slope_sec_penalty = (terrain_slope / 15.0) * 8.0
            cycle_time = float(max(25.0, task["baseline_duration_minutes"] * 60.0 / task["target_cycle_count"] - exp_sec_reduction + rain_sec_penalty + slope_sec_penalty + np.random.normal(0, 2.5)))
            
            if machine_state == "operating":
                task_progress = min(100.0, task_progress + (100.0 / (task["target_cycle_count"] * 15)))
                if np.random.rand() < 0.08:
                    cycles_done += 1
                    total_tonnes_moved += payload
            
            proximity_risk_prob = 0.03 + site_congestion * 0.08
            if np.random.rand() < proximity_risk_prob:
                nearby_person_count = int(np.random.choice([1, 2, 3], p=[0.75, 0.20, 0.05]))
                nearby_vehicle_count = int(np.random.choice([0, 1, 2], p=[0.6, 0.3, 0.1]))
                proximity_dist = float(np.random.uniform(2.5, 18.0))
            else:
                nearby_person_count = 0
                nearby_vehicle_count = int(np.random.choice([0, 1], p=[0.85, 0.15]))
                proximity_dist = float(np.random.uniform(15.0, 50.0))
                
            seatbelt_status = "fastened" if np.random.rand() > (0.01 if operator["experience_level"] != "novice" else 0.04) else "unfastened"
            
            if hydraulic_temp > 98.0:
                fault_code = "E-304: Hydraulic Over-Temp"
            elif engine_load > 95.0 and coolant_temp > 98.0:
                fault_code = "E-108: High Engine Coolant Temp"
            elif np.random.rand() < 0.005:
                fault_code = "W-042: Fuel Filter Pressure Variance"
            else:
                fault_code = "NONE"
                
            records.append({
                "timestamp": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "shift_id": f"SHIFT-{shift_idx+1:04d}",
                "machine_id": machine["machine_id"],
                "operator_id": operator["operator_id"],
                "machine_type": machine["machine_type"],
                "task_id": task["task_id"],
                "engine_hours": round(engine_hours + (step * 15.0 / 3600.0), 2),
                "engine_rpm": round(engine_rpm, 1),
                "engine_load": round(engine_load, 1),
                "fuel_level": round(fuel_level, 2),
                "fuel_consumption_rate": round(fuel_rate, 2),
                "hydraulic_temperature": round(hydraulic_temp, 1),
                "coolant_temperature": round(coolant_temp, 1),
                "hydraulic_pressure": round(hydraulic_pressure, 1),
                "machine_speed": round(speed_kmh, 1),
                "machine_direction": direction,
                "machine_state": machine_state,
                "idle_time_seconds": round(idle_seconds_accum, 1),
                "cycle_time_seconds": round(cycle_time, 1),
                "payload_tonnes": round(payload, 2),
                "bucket_load_percent": round(bucket_load, 1),
                "number_of_cycles": cycles_done,
                "operating_mode": "Productivity" if engine_load > 60 else "Economy",
                "latitude": round(23.4128 + np.random.normal(0, 0.0004), 6),
                "longitude": round(85.3452 + np.random.normal(0, 0.0004), 6),
                "site_zone": task["site_zone"],
                "terrain_slope_degrees": terrain_slope,
                "vibration": round(vibration, 3),
                "ambient_temperature": round(ambient_temp, 1),
                "rainfall_mm": round(rainfall_mm, 1),
                "visibility_meters": round(visibility_meters, 1),
                "wind_speed": round(wind_speed, 1),
                "seatbelt_status": seatbelt_status,
                "proximity_distance_meters": round(proximity_dist, 1),
                "nearby_person_count": nearby_person_count,
                "nearby_vehicle_count": nearby_vehicle_count,
                "fault_code": fault_code,
                "machine_health_score": round(machine_health, 1),
                "task_progress_percent": round(task_progress, 1),
                "site_congestion": round(site_congestion, 2)
            })

    df = pd.DataFrame(records)
    df.to_csv(os.path.join(OUTPUT_DIR, "telemetry.csv"), index=False)
    print(f"Generated telemetry.csv with {len(df)} records.")
    return df

def generate_metadata_tables():
    df_op = pd.DataFrame(OPERATORS)
    df_op.to_csv(os.path.join(OUTPUT_DIR, "operators.csv"), index=False)
    
    df_mach = pd.DataFrame(MACHINES)
    df_mach.to_csv(os.path.join(OUTPUT_DIR, "machines.csv"), index=False)
    
    df_task = pd.DataFrame(TASKS)
    df_task.to_csv(os.path.join(OUTPUT_DIR, "tasks.csv"), index=False)
    
    envs = [
        {"env_id": "ENV-01", "weather": "Clear", "rainfall_mm": 0.0, "visibility_meters": 2000.0, "wind_speed": 10.0, "risk_modifier": 1.0},
        {"env_id": "ENV-02", "weather": "Overcast", "rainfall_mm": 0.0, "visibility_meters": 1200.0, "wind_speed": 18.0, "risk_modifier": 1.1},
        {"env_id": "ENV-03", "weather": "Rain", "rainfall_mm": 8.5, "visibility_meters": 350.0, "wind_speed": 28.0, "risk_modifier": 1.6},
        {"env_id": "ENV-04", "weather": "Heavy Rain", "rainfall_mm": 16.0, "visibility_meters": 120.0, "wind_speed": 42.0, "risk_modifier": 2.2},
        {"env_id": "ENV-05", "weather": "Fog", "rainfall_mm": 0.0, "visibility_meters": 90.0, "wind_speed": 4.0, "risk_modifier": 2.0}
    ]
    pd.DataFrame(envs).to_csv(os.path.join(OUTPUT_DIR, "environmental_conditions.csv"), index=False)
    
    safety_events = [
        {
            "event_id": "EVT-8821",
            "timestamp": "2026-09-23 09:14:22",
            "operator_id": "OP-001",
            "machine_id": "CAT-EX-336",
            "event_type": "PROXIMITY_HAZARD",
            "severity": "CRITICAL",
            "risk_score": 88.5,
            "title": "STOP — PERSON IN REAR HAZARD ZONE",
            "reason": "Person detected 4.2 m behind while reversing at 7 km/h. Rain has reduced visibility.",
            "recommended_action": "Stop safely, verify the rear zone, and proceed only after clear.",
            "proximity_distance": 4.2,
            "machine_speed": 7.0,
            "machine_direction": "reverse",
            "weather": "Rain",
            "visibility_meters": 180.0,
            "acknowledged": True,
            "acknowledged_at": "2026-09-23 09:14:28",
            "incident_created": True
        },
        {
            "event_id": "EVT-8815",
            "timestamp": "2026-09-22 14:32:10",
            "operator_id": "OP-003",
            "machine_id": "CAT-WL-966",
            "event_type": "SEATBELT_WARNING",
            "severity": "CRITICAL",
            "risk_score": 92.0,
            "title": "SEATBELT UNFASTENED WHILE IN MOTION",
            "reason": "Machine movement detected (4.5 km/h) without confirmed seatbelt latch.",
            "recommended_action": "Bring machine to complete stop and latch seatbelt immediately.",
            "proximity_distance": None,
            "machine_speed": 4.5,
            "machine_direction": "forward",
            "weather": "Clear",
            "visibility_meters": 1500.0,
            "acknowledged": True,
            "acknowledged_at": "2026-09-22 14:32:15",
            "incident_created": True
        },
        {
            "event_id": "EVT-8809",
            "timestamp": "2026-09-21 11:05:40",
            "operator_id": "OP-002",
            "machine_id": "CAT-EX-336",
            "event_type": "HIGH_HYDRAULIC_TEMP",
            "severity": "WARNING",
            "risk_score": 52.0,
            "title": "HYDRAULIC OIL TEMPERATURE ELEVATED (94°C)",
            "reason": "Hydraulic oil temperature reached 94°C under sustained 12° incline trenching.",
            "recommended_action": "Reduce cycle intensity, inspect cooler airflow, allow 3 min idle cool down if warning persists.",
            "proximity_distance": None,
            "machine_speed": 0.0,
            "machine_direction": "neutral",
            "weather": "Clear",
            "visibility_meters": 2000.0,
            "acknowledged": True,
            "acknowledged_at": "2026-09-21 11:06:00",
            "incident_created": False
        }
    ]
    pd.DataFrame(safety_events).to_csv(os.path.join(OUTPUT_DIR, "safety_events.csv"), index=False)
    
    incidents = [
        {
            "incident_id": "INC-2026-0091",
            "event_id": "EVT-8821",
            "timestamp": "2026-09-23 09:14:22",
            "operator_id": "OP-001",
            "operator_name": "Priya Raman",
            "machine_id": "CAT-EX-336",
            "severity": "CRITICAL",
            "title": "High-Risk Proximity Near-Miss (Reversing)",
            "description": "Person entered blind zone at 4.2m distance while machine was reversing at 7.0 km/h in wet conditions. Operator acknowledged prompt within 6s and stopped safely.",
            "status": "Acknowledged & Resolved",
            "resolution_notes": "Operator stopped machine. Ground spotter communicated with pedestrian contractor. Area cleared.",
            "follow_up_training_required": "Safe Reversing & Blind Spot Awareness"
        },
        {
            "incident_id": "INC-2026-0087",
            "event_id": "EVT-8815",
            "timestamp": "2026-09-22 14:32:10",
            "operator_id": "OP-003",
            "operator_name": "Rahul Das",
            "machine_id": "CAT-WL-966",
            "severity": "CRITICAL",
            "title": "Unbelted Operation Trigger",
            "description": "Machine moved 4.5 km/h before operator latched safety harness.",
            "status": "Acknowledged & Resolved",
            "resolution_notes": "Operator latched belt after audible alert.",
            "follow_up_training_required": "Pre-Start & In-Cab Safety Procedures"
        }
    ]
    pd.DataFrame(incidents).to_csv(os.path.join(OUTPUT_DIR, "incidents.csv"), index=False)
    
    training_records = [
        {
            "training_id": "TRN-101",
            "title": "Safe Reversing & Blind Spot Awareness",
            "duration_minutes": 6,
            "category": "Safety",
            "recommended_reason": "Recommended after a high-risk rear proximity event.",
            "completed": False,
            "score": None,
            "assigned_to": "OP-001"
        },
        {
            "training_id": "TRN-102",
            "title": "Efficient Idle Management",
            "duration_minutes": 5,
            "category": "Efficiency",
            "recommended_reason": "Recommended because idle time exceeded your typical range.",
            "completed": False,
            "score": None,
            "assigned_to": "OP-001"
        },
        {
            "training_id": "TRN-103",
            "title": "Steep Slope & Incline Handling",
            "duration_minutes": 8,
            "category": "Operation",
            "recommended_reason": "Precautionary module for upcoming 14° excavation zone.",
            "completed": True,
            "score": 100,
            "assigned_to": "OP-001"
        }
    ]
    pd.DataFrame(training_records).to_csv(os.path.join(OUTPUT_DIR, "training_records.csv"), index=False)
    print("Generated all metadata CSVs.")

if __name__ == "__main__":
    generate_telemetry_dataset()
    generate_metadata_tables()
