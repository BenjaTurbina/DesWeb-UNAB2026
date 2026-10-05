import os
import secrets
import httpx

# Vault Server - Backend

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Request,
    Response,
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

app = FastAPI(title= "Local API Gateway")

security = HTTPBearer(
    auto_error=False
)

AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL",
    "http://127.0.0.1:8100"
)

VAULT_ADDR = os.getenv(  #SELINUX
    "VAULT_ADDR", "http://localhost:8200"
)

VAULT_TOKEN = os.getenv(
    "VAULT_TOKEN" #dev-only-token
)

if not VAULT_TOKEN:
    raise RuntimeError(
        "VAULT TOKEN no esta configurado"
    )

async def get_geteway_secrets():
    url =  (
        f"{VAULT_ADDR}" #http://localhost:8200
        "/v1/secret/data/gateway"
    )
    headers = {
        "X-Vault-Token": VAULT_TOKEN #dev-only-token
    }
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(
            url,
            headers=headers
        )
    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"No fue posible acceder a Vault: {response}"
        )
    vault_response = response.json()
    return vault_response["data"]["data"]

async def authenticate_client(
        credentials: HTTPAuthorizationCredentials= Depends(security)
):
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Bearer token requerido"
        )
    gatewat_secrets = (
        await get_geteway_secrets() #client_token backend_shared
    )
    introspection_secrets = (
        gatewat_secrets["auth_introspection_secret"]
    )
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            responde = await client.post(
                f"{AUTH_SERVICE_URL}/introspect",
                json={"token": credentials.credentials},
                headers={
                    "X-Gateway-Auth-Secret": introspection_secret
                }
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Authentication Service no disponible"
        )
    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="Error consultando Authentication Service"
        )
    identity = response.json()
    if not identity.get("active",False):
        raise HTTPException(
            status_code = 401,
            detail = "Token invalido o expirado"
        )
    return {
        "user_id": identity["user_id"],
        "username": identity["username"],
        "roles": identity["roles"],
        "backend_secret": gatewat_secrets["backend_shared_secret"]
    }
        


BACKEND_URL = "http://localhost:9000"
BACKEND_URL2 = "http://localhost:9100"

@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
)
async def proxy(
    path: str,
    request: Request,
    auth= Depends(authenticate_client)
):
    target_url = (
        f"{BACKEND_URL}/{path}" #call http://localhost...
    )
    body = await request.body()
    gateway_headers={
        "X-Gateway-Secret":
        auth["backend_secret"],
        "X-Authenticated-Client":
        auth["client_id"],
        "X-Aunthenticated-User":
        auth["username"],
        "X-Authenticated-Roles":
        auth["roles"]
    }
    content_type = request.headers.get("content-type")
    if content_type:
        gateway_headers["content_type"] = content_type
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            upstream = await client.request(
                method=request.method,
                url=target_url,
                params=request.query_params,
                content=body,
                headers=gateway_headers
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="Backend no disponible"
        )
    responde_headers = {}
    if "content-type" in upstream.headers:
        responde_headers["content-type"] = upstream.headers["content-type"]
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers= responde_headers
    )

