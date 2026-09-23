from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from backend.app.schemas.vision_schema import VisionDetectionResponse
from backend.app.vision.detector import vision_detector

router = APIRouter(prefix="/vision", tags=["vision"])

@router.post("/detect", response_model=VisionDetectionResponse)
async def detect_hazard_in_camera(
    file: Optional[UploadFile] = File(None),
    mode: Optional[str] = Form("demo_scenario")
):
    if file:
        content = await file.read()
        return vision_detector.detect_image(content, filename=file.filename)
    else:
        # Generate detection from standard camera frame / demo scenario
        return vision_detector.detect_image(b"", filename="demo_camera_feed.jpg")
