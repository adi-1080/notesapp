from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas.note import NoteCreate, NoteUpdate, NoteOut
from app.repositories import note_repo
from app.models.user import User

router = APIRouter()

@router.post("", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = note_repo.create(db, title=payload.title, content=payload.content, owner_id=current_user.id)
    return note

@router.get("", response_model=List[NoteOut])
def list_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_repo.list_for_owner(db, owner_id=current_user.id, skip=skip, limit=limit)

@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = note_repo.get(db, note_id=note_id, owner_id=current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, payload: NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = note_repo.get(db, note_id=note_id, owner_id=current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note_repo.update(db, note, title=payload.title, content=payload.content)

@router.patch("/{note_id}", response_model=NoteOut)
def patch_note(note_id: int, payload: NoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = note_repo.get(db, note_id=note_id, owner_id=current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note_repo.update(db, note, title=payload.title, content=payload.content)

@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = note_repo.get(db, note_id=note_id, owner_id=current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note_repo.delete(db, note)
    return
