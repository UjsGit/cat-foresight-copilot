export interface Operator {
  operator_id: string;
  name: string;
  experience_years: number;
  experience_level: string;
  shift_preference: string;
  avg_cycle_time_sec: number;
  efficiency_rating: number;
  safety_score: number;
  avatar: string;
}

export interface Machine {
  machine_id: string;
  model_name: string;
  machine_type: string;
  nominal_power_hp: number;
  operating_weight_tonnes: number;
  max_payload_tonnes: number;
  fuel_capacity_litres: number;
  current_hours: number;
  health_score: number;
  firmware_version: string;
}

export interface Task {
  task_id: string;
  task_name: string;
  machine_type: string;
  target_tonnes: number;
  material_type: string;
  difficulty: number;
  site_zone: string;
  target_cycle_count: number;
  baseline_duration_minutes: number;
}

export interface TelemetryData {
  timestamp: string;
  shift_id?: string;
  machine_id: string;
  operator_id: string;
  machine_type: string;
  task_id: string;
  task_name?: string;
  engine_hours: number;
  engine_rpm: number;
  engine_load: number;
  fuel_level: number;
  fuel_consumption_rate: number;
  hydraulic_temperature: number;
  coolant_temperature: number;
  hydraulic_pressure: number;
  machine_speed: number;
  machine_direction: string;
  machine_state: 'operating' | 'idle' | 'reversing' | 'parked';
  idle_time_seconds: number;
  cycle_time_seconds: number;
  payload_tonnes: number;
  bucket_load_percent: number;
  number_of_cycles: number;
  operating_mode: string;
  site_zone: string;
  terrain_slope_degrees: number;
  vibration: number;
  ambient_temperature: number;
  rainfall_mm: number;
  visibility_meters: number;
  wind_speed: number;
  seatbelt_status: 'fastened' | 'unfastened';
  proximity_distance_meters?: number;
  nearby_person_count: number;
  nearby_vehicle_count: number;
  fault_code: string;
  machine_health_score: number;
  task_progress_percent: number;
  site_congestion: number;
}

export interface SafetyAlert {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  risk_score: number;
  title: string;
  concise_reason: string;
  recommended_action: string;
  contextual_evidence: Record<string, any>;
  timestamp: string;
  acknowledged: boolean;
  event_id?: string;
}

export interface TaskEtaPrediction {
  task_id: string;
  predicted_duration_minutes: number;
  lower_bound_minutes: number;
  upper_bound_minutes: number;
  confidence: 'High' | 'Medium' | 'Low';
  explanation: string;
  top_contributors: Array<{
    factor: string;
    impact_minutes: number;
    direction: 'increase' | 'decrease';
  }>;
}

export interface AnomalyExplanation {
  is_anomaly: boolean;
  anomaly_score: number;
  category: string;
  metric: string;
  current_value: number;
  baseline_value: number;
  pct_deviation: number;
  headline: string;
  explanation: string;
  likely_contributors: string[];
  classification: string;
  recommended_actions: string[];
  contextual_data: Record<string, any>;
}

export interface ShiftInfo {
  shift_id: string;
  operator_id: string;
  machine_id: string;
  task_id: string;
  start_time: string;
  status: string;
  pre_start_completed: boolean;
  total_tonnes_moved: number;
  cycles_completed: number;
  fuel_consumed_litres: number;
  idle_minutes: number;
  safety_incidents_count: number;
  productivity_score: number;
}

export interface IncidentRecord {
  incident_id: string;
  event_id?: string;
  timestamp: string;
  operator_id: string;
  operator_name: string;
  machine_id: string;
  severity: string;
  title: string;
  description: string;
  status: string;
  resolution_notes?: string;
  follow_up_training_required?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  icon?: string;
  description: string;
  trigger_reason: string;
  key_takeaways: string[];
  completed: boolean;
  score?: number;
  quiz?: {
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  };
}

export interface ShiftSummaryData {
  shift_id: string;
  operator_id: string;
  operator_name: string;
  machine_id: string;
  machine_name: string;
  duration_hours: number;
  tasks_completed: string;
  productivity_pct_vs_baseline: number;
  total_fuel_litres: number;
  fuel_efficiency_score: number;
  idle_time_minutes: number;
  critical_alerts_count: number;
  critical_alerts_acknowledged: number;
  machine_health_status: string;
  eta_prediction_accuracy_pct: number;
  supervisor_review_message: string;
  recommended_trainings: TrainingModule[];
  notable_timeline_events: Array<{
    timestamp: string;
    type: string;
    title: string;
    description: string;
    severity: string;
  }>;
}

export interface DetectedVisionObject {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number];
  estimated_distance_meters: number;
  hazard_level: 'CRITICAL' | 'WARNING' | 'SAFE';
}

export interface VisionDetectionResult {
  detections: DetectedVisionObject[];
  person_count: number;
  vehicle_count: number;
  min_person_distance?: number;
  min_vehicle_distance?: number;
  safety_risk_score: number;
  severity: string;
  recommended_action: string;
  mode: string;
  processed_timestamp: string;
}
