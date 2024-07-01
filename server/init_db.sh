#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER gatesOfHeaven WITH PASSWORD 'password';
    CREATE DATABASE IF NOT EXISTS posthub;
    GRANT ALL PRIVILEGES ON DATABASE posthub TO gatesOfHeaven;
EOSQL