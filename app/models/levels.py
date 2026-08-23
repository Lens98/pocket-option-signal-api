from pydantic import BaseModel


class Levels(BaseModel):
    support: float | None
    resistance: float | None

    near_support: bool
    near_resistance: bool

    distance_support: float
    distance_resistance: float