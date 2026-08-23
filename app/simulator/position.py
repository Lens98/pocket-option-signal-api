from pydantic import BaseModel


class Position(BaseModel):

    action: str

    amount: float

    payout: float

    win: bool