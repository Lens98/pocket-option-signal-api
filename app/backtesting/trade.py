from pydantic import BaseModel


class Trade(BaseModel):

    asset: str

    action: str

    entry: float

    exit: float

    win: bool

    profit: float