from datetime import datetime, timedelta, timezone
from typing import Optional, Dict
import jwt
from jwt import InvalidTokenError
from passlib.context import CryptContext
from app.core.config import settings
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from app.db.session import get_db
from app.models.domain import Usuario

bearer = HTTPBearer(auto_error=False)

def current_user(credentials=Depends(bearer), db=Depends(get_db)):
    if not credentials:
        raise HTTPException(401, 'Debe iniciar sesión')
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user = db.query(Usuario).filter(Usuario.email == payload.get('sub')).first()
    except InvalidTokenError:
        raise HTTPException(401, 'Token inválido o vencido')
    if not user or user.estado != 'ACTIVO':
        raise HTTPException(401, 'Usuario inactivo o inexistente')
    return user


def require_write_user(request: Request, credentials=Depends(bearer), db=Depends(get_db)):
    if not credentials:
        raise HTTPException(401, 'Debe iniciar sesion')
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user = db.query(Usuario).filter(Usuario.email == payload.get('sub')).first()
    except InvalidTokenError:
        raise HTTPException(401, 'Token invalido o vencido')
    if not user or user.estado != 'ACTIVO':
        raise HTTPException(401, 'Usuario inactivo o inexistente')
    if request.method in ('GET', 'HEAD', 'OPTIONS'):
        return user
    allowed = {'ADMINISTRADOR', 'OPERADOR'}
    if request.url.path.endswith('/deliver-confirm'):
        allowed.add('CONDUCTOR')
    if request.url.path.startswith(('/api/v1/clients', '/api/v1/orders')):
        allowed.add('CLIENTE')
    if user.rol not in allowed:
        raise HTTPException(403, 'Permisos insuficientes')
    return user


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Failed login tracker in-memory for RN-001 (or persistent in DB)
# Structure: { email: {"failed_count": int, "locked_until": datetime | None} }
failed_login_tracker: Dict[str, Dict] = {}


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = utc_now() + expires_delta
    else:
        expire = utc_now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def check_login_lockout(email: str) -> bool:
    """Returns True if the account is locked out due to RN-001 (3 failed attempts -> 15 min lock)."""
    record = failed_login_tracker.get(email)
    if not record:
        return False
    locked_until = record.get("locked_until")
    if locked_until:
        if utc_now() < locked_until:
            return True
        else:
            # Lock expired, reset
            failed_login_tracker[email] = {"failed_count": 0, "locked_until": None}
            return False
    return False

def record_failed_login(email: str) -> int:
    """Increments failed attempt count and sets lockout if reached 3 attempts (RN-001)."""
    record = failed_login_tracker.get(email, {"failed_count": 0, "locked_until": None})
    count = record["failed_count"] + 1
    locked_until = None
    if count >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
        locked_until = utc_now() + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
    failed_login_tracker[email] = {"failed_count": count, "locked_until": locked_until}
    return count

def clear_failed_logins(email: str):
    if email in failed_login_tracker:
        del failed_login_tracker[email]
