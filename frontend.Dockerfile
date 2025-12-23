# =====================================================
# Dockerfile para Frontend Vite/React - Villex
# =====================================================
# Multi-stage build: Node para build, Nginx para servir

# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumentos de build para variables de entorno
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# =====================================================
# Stage 2: Servir con Nginx
# =====================================================
FROM nginx:alpine

# Copiar build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# La config de nginx se monta desde docker-compose
# para mayor flexibilidad

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
