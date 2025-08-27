from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .common import ORMBase

class NoteBase(BaseModel):
    title: str
    content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteOut(ORMBase):
    id: int
    title: str
    content: str
    owner_id: int
    created_at: datetime
    updated_at: datetime
