from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from asyncpg import create_pool as create_db_pool
from aioredis import create_redis as create_redis_pool
from contextlib import asynccontextmanager
from functools import wraps
from dotenv import load_dotenv
from os import getenv
from json import (
    loads as parse_json,
    dumps as stringify_json,
    load as read_json_file
)


load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db_pool = await create_db_pool(
        user = getenv('DB_USERNAME', 'gatesOfHeaven'),
        password = getenv('DB_PASSWORD', 'password'),
        database = getenv('DB_DATABASE', 'posthub'),
        host = getenv('DB_HOSTNAME', 'postgres')
    )
    app.state.redis_pool = await create_redis_pool(
        getenv('REDIS_URL', 'redis://redis:6379')
    )

    await migrate(app.state.db_pool)

    yield

    await app.state.db_pool.close()
    await app.state.redis_pool.close()


async def get_db_pool(request: Request):
    return request.app.state.db_pool


async def get_redis_pool(request: Request):
    return request.app.state.redis_pool

    
def cache(prefix: str = 'cache:', expire: int = 10):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request | None = kwargs['request']
            if not request:
                return await func(*args, **kwargs)

            redis_pool = await get_redis_pool(request)

            key = f"{prefix}{kwargs['user_id']}{request.url.path}?{request.url.query}"
            cached_result = await redis_pool.get(key)

            if cached_result:
                cached_result = parse_json(cached_result)
                print('-----from cache-----')
                return JSONResponse(
                    headers = { 'authorization': cached_result['auth'] },
                    content = parse_json(cached_result['body'])
                )

            response: JSONResponse = await func(*args, **kwargs)
            await redis_pool.set(
                key,
                stringify_json({
                    'auth': response.headers['authorization'],
                    'body': response.body.decode('utf-8')
                }),
                expire = expire
            )
            print('-----cached-----')
            return response
        return wrapper
    return decorator


async def migrate(db_pool):
    with open('./migrations.json', 'r') as file:
        migrations = read_json_file(file)

    async with db_pool.acquire() as conn:
        for table in migrations:
            await conn.execute(f"CREATE TABLE IF NOT EXISTS {table['name']} ({table['columns']})",)
