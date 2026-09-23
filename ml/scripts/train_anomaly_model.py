"""
Anomaly Detection & Baseline Profiling Model Training Script.
Fits IsolationForest on machine telemetry and builds robust operator-specific baseline matrices.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "synthetic_data")
ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def train_anomaly_model():
    telemetry_path = os.path.join(DATA_DIR, "telemetry.csv")
    if not os.path.exists(telemetry_path):
        from generate_synthetic_data import generate_telemetry_dataset, generate_metadata_tables
        generate_telemetry_dataset()
        generate_metadata_tables()
        
    df = pd.read_csv(telemetry_path)
    
    # Select feature set for anomaly scoring
    anomaly_features = [
        "fuel_consumption_rate",
        "engine_rpm",
        "engine_load",
        "hydraulic_temperature",
        "coolant_temperature",
        "hydraulic_pressure",
        "vibration",
        "cycle_time_seconds",
        "idle_time_seconds"
    ]
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df[anomaly_features].fillna(0))
    
    # Train IsolationForest
    iso = IsolationForest(
        n_estimators=150,
        contamination=0.04,
        random_state=42,
        n_jobs=-1
    )
    iso.fit(X_scaled)
    
    # Calculate Operator Baselines per task
    operator_baselines = {}
    for op_id in df["operator_id"].unique():
        op_df = df[df["operator_id"] == op_id]
        operator_baselines[op_id] = {
            "overall": {
                "mean_fuel_rate": float(op_df["fuel_consumption_rate"].mean()),
                "std_fuel_rate": float(op_df["fuel_consumption_rate"].std()),
                "p75_fuel_rate": float(op_df["fuel_consumption_rate"].quantile(0.75)),
                "p90_fuel_rate": float(op_df["fuel_consumption_rate"].quantile(0.90)),
                "mean_cycle_time": float(op_df["cycle_time_seconds"].mean()),
                "mean_idle_pct": float((op_df[op_df['machine_state'] == 'idle'].shape[0] / max(1, len(op_df))) * 100.0),
                "mean_engine_load": float(op_df["engine_load"].mean()),
                "mean_rpm": float(op_df["engine_rpm"].mean()),
                "mean_hydraulic_temp": float(op_df["hydraulic_temperature"].mean())
            },
            "by_task": {}
        }
        
        for task_id in op_df["task_id"].unique():
            t_df = op_df[op_df["task_id"] == task_id]
            operator_baselines[op_id]["by_task"][task_id] = {
                "mean_fuel_rate": float(t_df["fuel_consumption_rate"].mean()),
                "std_fuel_rate": float(t_df["fuel_consumption_rate"].std()),
                "mean_cycle_time": float(t_df["cycle_time_seconds"].mean()),
                "mean_rpm": float(t_df["engine_rpm"].mean()),
                "mean_load": float(t_df["engine_load"].mean()),
                "mean_hydraulic_temp": float(t_df["hydraulic_temperature"].mean())
            }
            
    artifact = {
        "isolation_forest": iso,
        "scaler": scaler,
        "features": anomaly_features,
        "operator_baselines": operator_baselines
    }
    
    save_path = os.path.join(ARTIFACTS_DIR, "anomaly_model.joblib")
    joblib.dump(artifact, save_path)
    print(f"Saved Anomaly Model & Operator Baselines to {save_path}")
    return artifact

if __name__ == "__main__":
    train_anomaly_model()
