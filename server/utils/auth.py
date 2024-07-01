from jwt import decode, encode, ExpiredSignatureError, PyJWTError
from fastapi import HTTPException, status, Header
from time import time
from os import getenv
from dotenv import load_dotenv

load_dotenv()
secret_key = getenv('SECRET_KEY', 'secret-key')

async def generate_token(id: int) -> str:
    return encode(
        {
            'sub': id,
            'exp': int(time()) + 10 * 60 * 60   # 10 hours
        },
        secret_key,
        algorithm = 'HS256'
    )

async def verify_token(authorization: str = Header()) -> int:
    if not authorization:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = 'Sign in the system'
        )
    
    try:
        return decode(
            authorization.replace('Bearer ', ''),
            secret_key,
            'HS256'
        )['sub']
    except ExpiredSignatureError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = 'Access token expired'
        )
    except PyJWTError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = 'Invalid access token'
        )