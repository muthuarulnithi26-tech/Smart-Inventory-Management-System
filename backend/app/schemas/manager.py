from pydantic import BaseModel, EmailStr

class CreateStaffRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    