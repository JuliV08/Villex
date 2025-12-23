#!/bin/bash
# =====================================================
# Entrypoint script para Django Backend - Villex
# =====================================================

set -e

echo "🔄 Esperando a que PostgreSQL esté disponible..."

# Esperar a que PostgreSQL esté listo
while ! python -c "
import os
import psycopg2
try:
    conn = psycopg2.connect(
        dbname=os.getenv('POSTGRES_DB', 'villex_leads'),
        user=os.getenv('POSTGRES_USER', 'postgres'),
        password=os.getenv('POSTGRES_PASSWORD', ''),
        host=os.getenv('POSTGRES_HOST', 'db'),
        port=os.getenv('POSTGRES_PORT', '5432'),
    )
    conn.close()
    exit(0)
except:
    exit(1)
" 2>/dev/null; do
    echo "⏳ PostgreSQL no está listo - esperando..."
    sleep 2
done

echo "✅ PostgreSQL está listo!"

echo "🔄 Ejecutando migraciones..."
python manage.py migrate --noinput

echo "🔄 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --threads 2 \
    --worker-class gthread \
    --worker-tmp-dir /dev/shm \
    --access-logfile - \
    --error-logfile - \
    --capture-output \
    --enable-stdio-inheritance
