from pydantic import BaseModel, EmailStr

class CreateManagerRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    warehouse_id: int