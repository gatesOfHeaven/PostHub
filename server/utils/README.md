# PostHub Server Utils

## auth.py

To manage Authentication via JWT (JSON Web Tokens, pyjwt lib).
Function `generate_token` to encode and `verify_token` to decode payload (user ID) using algorithm HS256 and secret key from `.env` file.

Function `verify_token` also used as middleware at `server/routers/posts.py`.

## db_conn.py

To manage PostgreSQL (asyncpg lib) and Redis (aioredis lib) databases.

- `lifespan` function is executed from server startup (creates connections) until the shutdown (closes connections).
- `get_db_pool` returns PostgreSQL connection pool to execute SQL queries at API endpoints (`server/routers/*`).
- `get_redis_pool` returns Redis connection pool to set and get items at `cache` decorator.
- `cache` decorator to cahce response body in GET API methods. To correct use this decorator endpoint function must have `request: fastapi.requests.Request` and `user_id: int = fastapi.Depends(auth.verify_token)` parameters. Decorator has 2 optional parameters to manage key prefix and epired time.

## models.py

To automaticaly validate request and response data (pydantic lib).