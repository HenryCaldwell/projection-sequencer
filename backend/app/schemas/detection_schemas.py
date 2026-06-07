from pydantic import BaseModel


class Marker(BaseModel):
    beat: int
    lane: int
    colorId: str
