from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.note import Note

def create(db: Session, *, title: str, content: str, owner_id: int) -> Note:
    note = Note(title=title, content=content, owner_id=owner_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def get(db: Session, note_id: int, owner_id: int) -> Optional[Note]:
    return db.query(Note).filter(Note.id == note_id, Note.owner_id == owner_id).first()

def list_for_owner(db: Session, owner_id: int, skip: int = 0, limit: int = 50) -> List[Note]:
    return db.query(Note).filter(Note.owner_id == owner_id).order_by(Note.created_at.desc()).offset(skip).limit(limit).all()

def update(db: Session, note: Note, *, title: str | None = None, content: str | None = None) -> Note:
    if title is not None:
        note.title = title
    if content is not None:
        note.content = content
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def delete(db: Session, note: Note) -> None:
    db.delete(note)
    db.commit()
