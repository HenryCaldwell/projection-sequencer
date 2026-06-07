from fastapi import APIRouter, Depends, Request

from app.schemas.detection_schemas import Marker
from app.services.detection_services import DetectionService

router = APIRouter(prefix="/detection", tags=["Detection"])


def get_detection_service(request: Request) -> DetectionService:
    return request.app.state.detection


@router.get("/markers")
def get_markers(
    detection: DetectionService = Depends(get_detection_service),
) -> list[Marker]:
    return detection.markers()
