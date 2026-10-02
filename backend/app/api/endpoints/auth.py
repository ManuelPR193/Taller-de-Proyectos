from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Usuario
from app.schemas.schemas import LoginRequest, Token, UsuarioCreate, UsuarioOut
from app.core.security import verify_password, get_password_hash, create_access_token, check_login_lockout, record_failed_login, clear_failed_logins

router = APIRouter()

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    
    # RN-001 Check
    if check_login_lockout(email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta bloqueada temporalmente (15 min) por acumular 3 intentos fallidos (RN-001)."
        )

    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        attempts = record_failed_login(email)
        remaining = 3 - attempts
        if remaining <= 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Ha excedido el número de intentos. Cuenta bloqueada por 15 minutos (RN-001)."
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Credenciales inválidas. Intentos fallidos: {attempts}/3 (RN-001)."
        )

    # Success login -> clear failed attempts counter
    clear_failed_logins(email)
    
    access_token = create_access_token(data={"sub": user.email, "rol": user.rol, "id": user.usuario_id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario_id": user.usuario_id,
        "email": user.email,
        "rol": user.rol,
        "nombre_completo": user.nombre_completo
    }

@router.post("/register", response_model=UsuarioOut)
def register(user_in: UsuarioCreate, db: Session = Depends(get_db)):
    existing = db.query(Usuario).filter(Usuario.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    user = Usuario(
        email=user_in.email.strip().lower(),
        password_hash=get_password_hash(user_in.password),
        rol=user_in.rol.upper(),
        nombre_completo=user_in.nombre_completo,
        estado="ACTIVO"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
