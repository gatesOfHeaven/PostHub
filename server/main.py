from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.db_conn import lifespan
from routers.auth import router as auth_router
from routers.posts import router as posts_router


app = FastAPI(
    title = 'PostHub',
    lifespan = lifespan
)
    

app.include_router(auth_router)
app.include_router(posts_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        'http://127.0.0.1:3000',
        'http://localhost:3000'
    ],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
    expose_headers=['Authorization']
)