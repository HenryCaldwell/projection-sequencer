from fastapi import APIRouter

from app.routes import detection_routes

router = APIRouter()


@router.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


router.include_router(detection_routes.router)
