from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import user_repo
from app.core.security import verify_password, get_password_hash, create_access_token

def register(db: Session, *, email: str, password: str, full_name: str | None):
    existing = user_repo.get_by_email(db, email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed = get_password_hash(password)
    user = user_repo.create(db, email=email, password_hash=hashed, full_name=full_name)
    token = create_access_token(subject=user.email)
    return token, user

def login(db: Session, *, email: str, password: str):
    user = user_repo.get_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.email)
    return token, user
