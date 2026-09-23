class DistanceEstimator:
    """
    Demo heuristic distance estimator based on bounding box proportions.
    Explicitly labeled as camera-estimated.
    """

    @staticmethod
    def estimate_distance(class_name: str, bbox: list, img_height: int = 480, img_width: int = 640) -> float:
        """
        bbox is [x1, y1, x2, y2]
        """
        x1, y1, x2, y2 = bbox
        box_height = max(1.0, float(y2 - y1))
        box_width = max(1.0, float(x2 - x1))
        
        # Relative height percentage in camera frame
        rel_h = box_height / float(img_height)
        
        if class_name.lower() == "person":
            # Human typical height ~ 1.75m. If person occupies 80% height -> ~2.0m away; 20% height -> ~8.0m away
            # formula: dist ~ 1.6 / rel_h
            dist = 1.65 / max(0.04, rel_h)
        elif class_name.lower() in ["car", "truck", "bus", "vehicle"]:
            # Vehicle height ~ 2.5m - 3.5m
            dist = 2.8 / max(0.05, rel_h)
        else:
            dist = 2.0 / max(0.05, rel_h)
            
        return round(float(dist), 1)

    @staticmethod
    def get_hazard_level(class_name: str, distance_meters: float) -> str:
        if class_name.lower() == "person":
            if distance_meters <= 5.0:
                return "CRITICAL"
            elif distance_meters <= 10.0:
                return "WARNING"
            return "SAFE"
        else:
            if distance_meters <= 6.0:
                return "CRITICAL"
            elif distance_meters <= 12.0:
                return "WARNING"
            return "SAFE"
