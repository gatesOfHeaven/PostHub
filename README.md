# PostHub - React, FastAPI, PostgreSQL, Redis, JWT, Docker

## Setup with Docker

```sh
git clone https://github.com/gatesOfHeaven/PostHub
cd PostHub
docker-compose up --build
```

## Setup without Docker

To run the app without Docker, you need to have the following programs:

- Python v3.10
- Node.js v18.18.0
- PostgreSQL
- Redis v6
- Git

Clone the repo via `git clone https://github.com/gatesOfHeaven/PostHub`

### Install dependencies for back-end

```sh
cd server
pip install fastapi uvicorn pyjwt asyncpg aioredis dotenv
```

Create PostgreSQL and Redis databases. Create a `.env` file with variables like in `.env.example` and fill it with your environment variables.

Run databases and the REST server via `uvicorn main:app --reload` or `uvicorn main:app --reload --port 8000`.

### Install dependencies for front-end

```sh
cd web-client
npm install
npm start
```

Open [app](http://localhost:3000)