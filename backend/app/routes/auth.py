from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.user import UserCreate, UserOut
from app.schemas.auth import TokenOut, LoginIn
from app.services import auth_service

router = APIRouter()

@router.post("/register", response_model=TokenOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    token, user = auth_service.register(db, email=payload.email, password=payload.password, full_name=payload.full_name)
    return TokenOut(access_token=token)

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    token, user = auth_service.login(db, email=payload.email, password=payload.password)
    return TokenOut(access_token=token)
