from pydantic import BaseModel


class Payout(BaseModel):

    percentage: float = 0.92