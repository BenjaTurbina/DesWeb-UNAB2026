import os
import secrets
import httpx

# El Gateway necesita llamar
# Vault Server - Backend

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Request, # Requeriemoentos en caso de si mi backend necesita llamar a otro backend
    Response # Respuestas del Request
)

from fastapi.security import (
    HTTPBearer, # Forma de validar la autorizacion de un token
    HTTPAuthorizationCredentials 
)

app = FastAPI(
    title= "Local API Gateway"
)
security = HTTPBearer(
    auto_error= False
)

AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL",
    "http://127.0.0.1:8100"
)

# Busca la direccion del vault, si no la encuentra se setea en puerto 8200
VAULT_ADDR = os.getenv(
    "VAULT_ADDR", "http://localhost:8200"
)

VAULT_TOKEN = os.getenv(
    "VAULT_TOKEN"
)

if not VAULT_TOKEN:
    # Los runtiemerror son para indicar que no se levanto el gateway, los httpserror son para erroes que ocurren cuando ya esta levantada
    raise RuntimeError(
        "VAULT_TOKEN NO ESTA CONFIGURADO"
    )

# Funcion que entrega dos secretos, el client-token y backend_shared_secret, que estan en la pagina del vault de administacion
async def get_gateway_secret():
    # Se va a levantar un servicio en el enlace de VAULD_ADDR
    url = (
        f"{VAULT_ADDR}" # ahora esta levantado en http//localhost:8200 pero se encuentra
         # el expuesto del levantador de servicios en una seccion especifica
        "/v1/secret/data/gateway"
    )
    # Se le va entregar el header con el token de acceso, hacia quien se direge
    headers = {
        "X-Vault-Token": VAULT_TOKEN
    }
    async with httpx.AsyncClient(timeout=5.0) as  client:
        response = await client.get(
            url, # Esto funciona porque tiene en mismo nombre por el formato json
            headers= headers
        )
        if response.status_code != 200:
            # Si ocurren errores de accedemiento al servico son errores del 500 
            raise HTTPException (
                status_code=500,
                detail=f"NO FUE POSIBLE ACCEDER AL VAULT: {response}"
            )
        vault_response = response.json()
        return vault_response["data"]["data"]

async def authenticate_client(
        credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Bearer token requerido"
        )
    gateway_secrets = (
        await get_gateway_secret() #client_token ; backend_shared_secret
    )
    introspection_secret = (
        gateway_secrets["auth_instropection_secret"]
    )
    try:
        async with httpx.AsyncClient(timeout= 0.5) as client :
            response = await client.post(
                f"{AUTH_SERVICE_URL}/introspect",
                json = {"token":credentials.credentials},
                headers= {
                    "X-Gateway-Auth-Secret": introspection_secret
                }
            )
    except httpx.ReadError:
        raise HTTPException(
            status_code= 503,
            detail= "Authentication Service no disponible"
        )
    if response.status_code != 200:
        raise HTTPException(
            status_code= 502,
            detail= "Error consultado Authentiacion Service"
        )
    identity = response.json()
    if not identity.get("active",False):
        raise HTTPException(
            status_code=401,
            detail="Token invalido o expirado"
        )
    return{
        "user_id": identity["user_id"],
        "username": identity["username"],
        "roles": identity["roles"],
        "backend_secret":gateway_secrets["backend_shated_secret"]
    }

BACKEND_URL = "http://localhost:9000"

@app.api_route(
    # Todas las cosas que partan con el formato api/Lo que sea , son enrutadas
    "/api/{path:path}", # products healt orders
    methods=["GET","POST","PUT","PATCH","DELETE"]
)
async def proxy(
    path: str,
    request: Request,
    auth= Depends(authenticate_client)
):
    target_url = (
        f"{BACKEND_URL}/{path}" # LLamaron al http://localhost:8000/api/products y se tradujo a un http://localhost:9000/products
    )
    body = await request.body()
    gateway_headers = {
        "X-Gateway-Secret": 
        auth["backend_secret"], # Quien es backend secret? -> gateway=api-secret-456
        "X-Authenticated-Client":
        auth["client_id"], # student-client -> Autenticador
        "X-Authenticated-User":
        auth["username"],
        "X-Authenticated-Roles":
        auth["roles"],
    }
    content_type = request.headers.get("content-type")
    if content_type:
        gateway_headers["content_type"] = content_type
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            upstream = await client.request(
                method= request.method, #GET POST PUT PATCH DELETE
                url = target_url, # http://localhost:9000/products
                params= request.query_params, # http//localhost:9000/productos?var1=3&var2=6
                headers= gateway_headers
            )
    except httpx.RequestError:
        # Si se cae la llamada del backend
        raise HTTPException(
            status_code= 502,
            detail="Backend no disponible"
        )
    response_headers = {}
    if "content-type" in upstream.headers:
        response_headers["content-type"] = upstream.headers["content-type"]
    return Response(
        content= upstream.content,
        status_code= upstream.status_code,
        headers= response_headers,
    )