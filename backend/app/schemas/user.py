from typing import Optional
from pydantic import BaseModel, EmailStr
from .common import ORMBase

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserOut(ORMBase):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
