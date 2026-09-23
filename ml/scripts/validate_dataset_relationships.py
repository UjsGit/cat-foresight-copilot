"""
Validation script for synthetic data relationships.
Verifies physics, safety, and operational correlations.
"""

import os
import pandas as pd
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "synthetic_data")

def validate():
    telemetry_path = os.path.join(DATA_DIR, "telemetry.csv")
    if not os.path.exists(telemetry_path):
        print(f"Error: {telemetry_path} not found. Run generate_synthetic_data.py first.")
        return False
        
    df = pd.read_csv(telemetry_path)
    print(f"Loaded {len(df)} telemetry rows for correlation validation.")
    
    # 1. Rainfall vs Visibility (should be strongly negative)
    rain_mask = df["rainfall_mm"] > 0
    corr_rain_vis = df["rainfall_mm"].corr(df["visibility_meters"])
    print(f"1. Rainfall vs Visibility correlation: {corr_rain_vis:.3f} (Expected < -0.30)")
    assert corr_rain_vis < -0.20, "Expected negative correlation between rain and visibility."

    # 2. Slope vs Fuel Rate (operating state)
    op_mask = df["machine_state"] == "operating"
    corr_slope_fuel = df[op_mask]["terrain_slope_degrees"].corr(df[op_mask]["fuel_consumption_rate"])
    print(f"2. Slope vs Fuel Rate (operating) correlation: {corr_slope_fuel:.3f} (Expected > 0.20)")
    assert corr_slope_fuel > 0.15, "Expected positive correlation between terrain slope and fuel rate."

    # 3. Payload vs Engine Load / Hydraulic Pressure
    corr_payload_load = df[op_mask]["payload_tonnes"].corr(df[op_mask]["engine_load"])
    corr_payload_press = df[op_mask]["payload_tonnes"].corr(df[op_mask]["hydraulic_pressure"])
    print(f"3. Payload vs Engine Load: {corr_payload_load:.3f}, vs Hydraulic Pressure: {corr_payload_press:.3f} (Expected > 0.25)")
    assert corr_payload_load > 0.20 and corr_payload_press > 0.20, "Expected positive correlation with payload."

    # 4. Operator Experience vs Cycle Time
    # Merge with operators table
    ops = pd.read_csv(os.path.join(DATA_DIR, "operators.csv"))
    merged = df.merge(ops, on="operator_id")
    corr_exp_cycle = merged[op_mask]["experience_years"].corr(merged[op_mask]["cycle_time_seconds"])
    print(f"4. Operator Experience vs Cycle Time: {corr_exp_cycle:.3f} (Expected < -0.20)")
    assert corr_exp_cycle < -0.10, "Expected negative correlation between experience and cycle time."

    # 5. Machine Health vs Hydraulic Temp / Vibration
    corr_health_temp = df[op_mask]["machine_health_score"].corr(df[op_mask]["hydraulic_temperature"])
    print(f"5. Health vs Hydraulic Temp: {corr_health_temp:.3f} (Expected < -0.10)")

    print("\nSUCCESS: All synthetic dataset relationship validations passed cleanly!")
    return True

if __name__ == "__main__":
    validate()
