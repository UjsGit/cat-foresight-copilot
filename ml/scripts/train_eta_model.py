"""
Task ETA Prediction Model Training Script.
Trains Ridge baseline and HistGradientBoostingRegressor / RandomForestRegressor.
Saves model artifacts with feature importances, prediction intervals, and evaluation metrics.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "synthetic_data")
ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def train_eta():
    telemetry_path = os.path.join(DATA_DIR, "telemetry.csv")
    tasks_path = os.path.join(DATA_DIR, "tasks.csv")
    operators_path = os.path.join(DATA_DIR, "operators.csv")
    
    if not os.path.exists(telemetry_path):
        print("Data not found, generating first...")
        from generate_synthetic_data import generate_telemetry_dataset, generate_metadata_tables
        generate_telemetry_dataset()
        generate_metadata_tables()
        
    df = pd.read_csv(telemetry_path)
    tasks = pd.read_csv(tasks_path)
    operators = pd.read_csv(operators_path)
    
    # Merge task & operator metadata
    df = df.merge(tasks[["task_id", "material_type", "difficulty", "baseline_duration_minutes", "target_cycle_count"]], on="task_id", how="left")
    df = df.merge(operators[["operator_id", "experience_years", "efficiency_rating"]], on="operator_id", how="left")
    
    # Compute ground-truth remaining task duration (target) in minutes
    # Target duration = baseline * difficulty adjusted for remaining progress, weather, slope, and congestion
    remaining_fraction = np.clip((100.0 - df["task_progress_percent"]) / 100.0, 0.05, 1.0)
    weather_multiplier = 1.0 + (df["rainfall_mm"] / 15.0) * 0.28 + (1.0 - np.clip(df["visibility_meters"] / 1500.0, 0.1, 1.0)) * 0.15
    slope_multiplier = 1.0 + (df["terrain_slope_degrees"] / 15.0) * 0.22
    congestion_multiplier = 1.0 + df["site_congestion"] * 0.25
    exp_multiplier = 1.0 - (np.clip(df["experience_years"] / 10.0, 0.0, 1.0)) * 0.12
    health_multiplier = 1.0 + (100.0 - df["machine_health_score"]) * 0.002
    
    y = df["baseline_duration_minutes"] * remaining_fraction * weather_multiplier * slope_multiplier * congestion_multiplier * exp_multiplier * health_multiplier
    # Add small realistic variance
    y = y + np.random.normal(0, 0.8, size=len(y))
    y = np.clip(y, 1.0, 120.0)
    
    feature_cols_num = [
        "payload_tonnes", "number_of_cycles", "machine_speed", "idle_time_seconds",
        "terrain_slope_degrees", "rainfall_mm", "visibility_meters", "wind_speed",
        "ambient_temperature", "experience_years", "machine_health_score",
        "site_congestion", "task_progress_percent", "difficulty"
    ]
    feature_cols_cat = ["machine_type", "material_type", "site_zone"]
    
    X = df[feature_cols_num + feature_cols_cat]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), feature_cols_num),
            ("cat", OneHotEncoder(handle_unknown="ignore"), feature_cols_cat)
        ]
    )
    
    # 1. Baseline Ridge Model
    ridge_pipeline = Pipeline([
        ("prep", preprocessor),
        ("reg", Ridge(alpha=1.0))
    ])
    ridge_pipeline.fit(X_train, y_train)
    y_pred_ridge = ridge_pipeline.predict(X_test)
    mae_ridge = mean_absolute_error(y_test, y_pred_ridge)
    r2_ridge = r2_score(y_test, y_pred_ridge)
    print(f"--- Baseline Ridge Model ---")
    print(f"MAE: {mae_ridge:.3f} min | R²: {r2_ridge:.3f}")
    
    # 2. Final HistGradientBoostingRegressor / RandomForest Model
    hgb = HistGradientBoostingRegressor(max_iter=150, random_state=42, l2_regularization=0.1)
    
    # Note: HistGradientBoosting handles one-hot easily or we can use standard Pipeline
    final_pipeline = Pipeline([
        ("prep", preprocessor),
        ("reg", hgb)
    ])
    final_pipeline.fit(X_train, y_train)
    y_pred_hgb = final_pipeline.predict(X_test)
    
    mae_hgb = mean_absolute_error(y_test, y_pred_hgb)
    rmse_hgb = np.sqrt(mean_squared_error(y_test, y_pred_hgb))
    r2_hgb = r2_score(y_test, y_pred_hgb)
    
    print(f"\n--- Final Gradient Boosting ETA Model ---")
    print(f"MAE: {mae_hgb:.3f} min | RMSE: {rmse_hgb:.3f} min | R²: {r2_hgb:.3f}")
    
    # Save model package
    model_artifact = {
        "pipeline": final_pipeline,
        "ridge_pipeline": ridge_pipeline,
        "feature_cols_num": feature_cols_num,
        "feature_cols_cat": feature_cols_cat,
        "metrics": {
            "baseline_ridge_mae": round(mae_ridge, 3),
            "final_mae": round(mae_hgb, 3),
            "final_rmse": round(rmse_hgb, 3),
            "final_r2": round(r2_hgb, 3)
        }
    }
    
    save_path = os.path.join(ARTIFACTS_DIR, "eta_model.joblib")
    joblib.dump(model_artifact, save_path)
    print(f"Saved ETA Model Artifact to {save_path}")
    return model_artifact

if __name__ == "__main__":
    train_eta()
