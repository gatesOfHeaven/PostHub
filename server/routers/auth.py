from fastapi import APIRouter, HTTPException, status, Header, Depends
from fastapi.responses import JSONResponse
from utils.db_conn import get_db_pool
from utils.models import *
from utils import auth


router = APIRouter(prefix = '/auth')


@router.get('/', response_model = SignResponseData)
async def root(
    authorization: str = Header(),
    db_pool = Depends(get_db_pool)
):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Sign in the system'
        )
    
    id = await auth.verify_token(authorization.replace('Bearer ', ''))

    async with db_pool.acquire() as conn:
        result = await conn.fetchrow(
            'SELECT username, fullname FROM Users WHERE id = $1',
            id
        )

    return JSONResponse(
        headers = { 'Authorization': authorization },
        content = {
            'id': id,
            'username': result['username'],
            'fullname': result['fullname'],
            'detail': 'Welcome!'
        }
    )


@router.post('/sign-up', response_model = SignResponseData)
async def sign_up(
    data: SignUpRequestData,
    db_pool = Depends(get_db_pool)
):
    if data.fullname is None or data.fullname == '':
        data.fullname = data.username

    async with db_pool.acquire() as conn:
        duplicates_count = await conn.fetchval(
            'SELECT COUNT(id) FROM Users WHERE username = $1',
            data.username
        )

        if duplicates_count > 0:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = 'User already exists'
            )
        
        id = await conn.fetchval('SELECT COUNT(id) FROM Users')
        await conn.execute(
            'INSERT INTO Users (id, username, fullname, password) VALUES ($1, $2, $3, $4)',
            id, data.username, data.fullname, data.password
        )

    token = await auth.generate_token(id)
    return JSONResponse(
        headers = { 'Authorization': f'Bearer {token}' },
        content = {
            'id': id,
            'username': data.username,
            'fullname': data.fullname,
            'detail': 'Welcome!'
        }
    )


@router.post('/sign-in', response_model = SignResponseData)
async def sign_in(
    data: SignInRequestData,
    db_pool = Depends(get_db_pool)
):
    async with db_pool.acquire() as conn:
        result = await conn.fetchval(
            'SELECT COUNT(*) AS count FROM Users WHERE username = $1 AND password = $2',
            data.username, data.password
        )

        if result != 1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail = 'User not found'
            )
        
        user = await conn.fetchrow(
            'SELECT id, username, fullname FROM Users WHERE username = $1 AND password = $2',
            data.username, data.password
        )

    token = await auth.generate_token(user['id'])
    return JSONResponse(
        headers = { 'Authorization': f'Bearer {token}' },
        content = {
            'id': user['id'],
            'username': user['username'],
            'fullname': user['fullname'],
            'detail': 'Welcome back!'
        }
    )