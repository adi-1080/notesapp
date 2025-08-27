from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.routes import auth, users, notes

# Create tables (simple demo; for production use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes API", version="1.0.0")

# CORS
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(notes.router, prefix="/notes", tags=["notes"])

@app.get("/", tags=["health"])
def health():
    return {"status": "ok"}
