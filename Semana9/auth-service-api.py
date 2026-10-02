from datetime import datetime,timedelta, timezone
import os
import secrets

from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

app = FastAPI(
    title= "Authentication Service",
    description= "Servicio simple de autorizacion"
)

USER = {
    "benja": {
        "password": "Tatil8383",
        "user_id": "USR-001",
        "roles": ["user","admin"]
    },
    "ricardo": {
        "password": "83912",
        "user_id": "USR-002",
        "roles": ["user"]
    },
    "renato": {
        "password": "59054",
        "user_id": "USR-003",
        "roles": ["user"]
    },
}

SESSION = {

}

TOKEN_LIFETIME_MINUTES = 15

AUTH_INTROSPECTION_SECRET = os.getenv(
    "AUTH_INTROSPECTION_SECRET",
    "demo-introspection-secret"
)

class LoginRequest(BaseModel):
    username: str
    password: str

class IntrospectionRequest(BaseModel):
    token: str

@app.post("/login")
def login(request: LoginRequest, x_gateway_auth_secret: str = Header(default="")):
    if not secrets.compare_digest(
        x_gateway_auth_secret,
        AUTH_INTROSPECTION_SECRET
    ):
        raise HTTPException(
            status_code=403,
            detail= "Gateway no autorizado"
        )
    user = USER.get(request.username)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Usuario incorrecto"
        )
    if user["password"] != request.password:
        raise HTTPException(
            status_code = 401,
            detail= "Credenciales incorrectas"
        )
    access_token = secrets.token_urlsafe(32)
    expiration = (datetime.now(timezone.utc) + timedelta(minutes= TOKEN_LIFETIME_MINUTES))
    # Asociar el token a una entidad
    SESSION[access_token] = {
        "user_id": user["user_id"],
        "username": request.username,
        "roles": user["roles"],
        "expires_at": expiration
    }
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": TOKEN_LIFETIME_MINUTES * 60
    }

@app.post("/introspect")
def introspect(
    request: IntrospectionRequest,
    x_gateway_auth_secret: str = Header(default="")
):
    if not secrets.compare_digest(
        x_gateway_auth_secret,
        AUTH_INTROSPECTION_SECRET
    ):
        raise HTTPException(
            status_code=403,
            detail= "Gateway no autorizado"
        )
    session = SESSION.get(request.token)
    if session is None:
        return {
            "active": False
        }
    if (datetime.now(timezone.utc) > session["expires_at"]):
        SESSION.pop(request.token, None)
        return {
            "active": False
        }
    return {
        "active": True,
        "user_id": session["user_id"],
        "username": session["username"],
        "roles": session["roles"],
        "expires_at": session["expires_at"].isoformat()
    }

# Todas istancias donde se pueda obtener datos, se debe tener cero confianza, solamente se puede confiar el gateway
# aplicar verificaciones de x_gateway en las instacias de la api
@app.post("/logout")
def logout(
    request: IntrospectionRequest,
    x_gateway_auth_secret: str = Header(default="")
):
    if not secrets.compare_digest(
        x_gateway_auth_secret,
        AUTH_INTROSPECTION_SECRET
    ):
        raise HTTPException(
            status_code=403,
            detail= "Gateway no autorizado"
        )
    SESSION.pop(request.token, None)
    return {
        "message": "Sesion Finalizada"
    }    

@app.get("/health")
def health(x_gateway_auth_secret: str = Header(default="")):
    if not secrets.compare_digest(
        x_gateway_auth_secret,
        AUTH_INTROSPECTION_SECRET
    ):
        raise HTTPException(
            status_code=403,
            detail= "Gateway no autorizado"
        )
    return {
        "status": "OK",
        "service": "Authentication Service"
    }