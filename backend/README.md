# Notes App Backend

A FastAPI-based backend for a note-taking application with user authentication.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and update the SECRET_KEY for production
   # Generate a secure secret key with:
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Run the Application**
   ```bash
   # Development mode with auto-reload
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Or using Python module
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing secret (change in production!) | Auto-generated |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time | 60 |
| `DATABASE_URL` | Database connection string | sqlite:///./app.db |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | localhost origins |
| `ENVIRONMENT` | Environment name | development |

## Security Notes

- **IMPORTANT**: Always change the `SECRET_KEY` in production
- The `.env` file is ignored by git for security
- Use strong, unique secrets for production deployments
- Consider using environment-specific configuration management

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Notes
- `GET /notes/` - List user's notes
- `POST /notes/` - Create new note
- `GET /notes/{id}` - Get specific note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

All note endpoints require authentication via Bearer token.