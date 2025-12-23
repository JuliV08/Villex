# =====================================================
# Dockerfile para Django Backend - Villex
# =====================================================
# Multi-stage build para imagen optimizada

FROM python:3.12-slim as builder

# Evitar prompts interactivos
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema para psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# =====================================================
# Stage de producción
# =====================================================
FROM python:3.12-slim

# Crear usuario no-root por seguridad
RUN useradd --create-home --shell /bin/bash app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV HOME=/home/app
ENV APP_HOME=/home/app/web

WORKDIR $APP_HOME

# Instalar runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copiar wheels e instalar
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*

# Copiar proyecto
COPY --chown=app:app . .

# Hacer ejecutable el entrypoint
RUN chmod +x /home/app/web/entrypoint.sh

# Cambiar a usuario no-root
USER app

# Exponer puerto
EXPOSE 8000

# Entrypoint
ENTRYPOINT ["/home/app/web/entrypoint.sh"]
