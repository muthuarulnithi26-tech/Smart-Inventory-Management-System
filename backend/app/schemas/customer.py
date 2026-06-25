from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str
    address: str | None = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str | None
    phone: str
    address: str | None

    class Config:
        from_attributes = True
        