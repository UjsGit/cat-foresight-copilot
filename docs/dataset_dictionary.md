# Dataset Dictionary: CAT ForeSight Copilot

This dictionary documents all 37 telemetry and operational variables generated in `ml/synthetic_data/telemetry.csv` (30,000 records).

| Field Name | Type | Unit | Source | Description & Operational Significance |
| :--- | :--- | :--- | :--- | :--- |
| `timestamp` | string | ISO 8601 | Simulated CAN Bus | Machine timestamp for temporal analysis. |
| `shift_id` | string | ID | Application | Unique shift identifier. |
| `machine_id` | string | ID | Machine ECM | Equipment ID (e.g., CAT-EX-336). |
| `operator_id` | string | ID | Cab Console | Assigned operator ID (e.g., OP-001 Priya Raman). |
| `machine_type` | string | - | Config | Excavator, Wheel Loader, Haul Truck. |
| `task_id` | string | ID | Task DB | Active work assignment ID. |
| `engine_hours` | float | Hours | Machine ECM | Cumulative engine running service meter. |
| `engine_rpm` | float | RPM | Machine ECM | Engine speed (800-2400 RPM). |
| `engine_load` | float | % | Machine ECM | Engine torque demand percentage (0-100%). |
| `fuel_level` | float | % | Fuel Sensor | Tank volume percentage remaining. |
| `fuel_consumption_rate` | float | L/h | ECM Derived | Instantaneous diesel burn rate. |
| `hydraulic_temperature`| float | °C | Thermal Sensor | Hydraulic circuit oil temp (Nominal: 65-85°C). |
| `coolant_temperature` | float | °C | Thermal Sensor | Engine cylinder head coolant temperature. |
| `hydraulic_pressure` | float | bar | Pressure Sensor| Main hydraulic pump relief pressure. |
| `machine_speed` | float | km/h | GPS / Wheel | Ground travel speed. |
| `machine_direction` | string | - | Transmission | forward / reverse / neutral. |
| `machine_state` | string | - | State Machine | operating / idle / reversing / parked. |
| `idle_time_seconds` | float | Seconds | State Machine | Cumulative non-productive staging idle. |
| `cycle_time_seconds` | float | Seconds | Derived | Time per dig-swing-dump-return cycle. |
| `payload_tonnes` | float | Tonnes | Payload Scale | Net material mass per bucket load. |
| `bucket_load_percent` | float | % | Payload Scale | Percentage of nominal bucket capacity. |
| `number_of_cycles` | integer | Count | Cycle Counter | Completed truck loading passes. |
| `operating_mode` | string | - | ECM Mode | Productivity vs Economy engine map. |
| `latitude` / `longitude`| float | Degrees | Onboard GPS | Quarry geofence coordinate. |
| `site_zone` | string | - | Site Map | Quarry Face, Crusher Feed, Haul Road. |
| `terrain_slope_degrees`| float | Degrees | Inclinometer | Ground pitch inclination angle (0-15°). |
| `vibration` | float | g | IMU Sensor | 3-axis cab chassis vibration acceleration. |
| `ambient_temperature` | float | °C | Weather Station| Quarry ambient air temperature. |
| `rainfall_mm` | float | mm/hr | Weather Station| Precipitation intensity. |
| `visibility_meters` | float | Meters | Optical Sensor | Atmospheric optical visibility distance. |
| `wind_speed` | float | km/h | Anemometer | Wind velocity. |
| `seatbelt_status` | string | - | Latch Switch | fastened / unfastened safety harness. |
| `proximity_distance_meters`| float | Meters | Radar / Camera | Distance to nearest detected object. |
| `nearby_person_count` | integer | Count | Vision / Radar | Ground pedestrians detected in exclusion zone. |
| `nearby_vehicle_count` | integer | Count | Vision / Radar | Nearby service vehicles or haul trucks. |
| `fault_code` | string | - | Diagnostic DTC | Active ECM DTC diagnostic code or NONE. |
| `machine_health_score`| float | Score | Predictive AI | Composite machine health index (0-100). |
| `task_progress_percent`| float | % | Task Service | Task completion progress percentage. |
| `site_congestion` | float | Index | Fleet Traffic | Traffic congestion density index (0.0 - 1.0). |
