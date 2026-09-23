from sqlalchemy import Column, String, Float, Integer
from backend.app.db.database import Base

class Machine(Base):
    __tablename__ = "machines"

    machine_id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    machine_type = Column(String, nullable=False)
    nominal_power_hp = Column(Integer, default=300)
    operating_weight_tonnes = Column(Float, default=35.0)
    max_payload_tonnes = Column(Float, default=18.0)
    fuel_capacity_litres = Column(Float, default=500.0)
    current_hours = Column(Float, default=3000.0)
    health_score = Column(Float, default=95.0)
    firmware_version = Column(String, default="v4.18.0")
