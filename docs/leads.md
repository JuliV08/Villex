# Sistema de Leads - Documentación

## Descripción

Sistema de captura y gestión de leads para VILLEX, con Django + PostgreSQL.

---

## Setup rápido

### 1. Crear base de datos en PostgreSQL

```sql
CREATE DATABASE villex_leads;
```

### 2. Configurar variables de entorno

```bash
cd backend
copy .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

### 3. Crear entorno virtual e instalar dependencias

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Ejecutar migraciones

```bash
python manage.py migrate
```

### 5. Crear superusuario (opcional, para admin)

```bash
python manage.py createsuperuser
```

### 6. Ejecutar servidor

```bash
python manage.py runserver 8000
```

---

## API Endpoints

### POST /api/leads/

Crear un nuevo lead.

**Request:**

```json
{
  "name": "Juan Pérez",
  "contact": "juan@email.com",
  "project_type": "web",
  "message": "Necesito una landing page",
  "timeframe": "1 mes",
  "budget_range": "ARS 150.000 - 350.000",
  "reference_url": "https://ejemplo.com",
  "has_domain_hosting": true
}
```

**Response (201):**

```json
{
  "success": true,
  "lead_token": "550e8400-e29b-41d4-a716-446655440000",
  "thank_you_url": "/gracias/550e8400-e29b-41d4-a716-446655440000/",
  "calendly_url": "https://calendly.com/villex/30min?utm_source=villex&utm_medium=landing&utm_campaign=agenda_30min&utm_content=550e8400-e29b-41d4-a716-446655440000",
  "whatsapp_url": "https://wa.me/5491123456789?text=..."
}
```

### GET /gracias/<lead_token>/

Página de agradecimiento con CTA de Calendly.

---

## Test con curl

```bash
curl -X POST http://localhost:8000/api/leads/ ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"contact\":\"test@test.com\",\"project_type\":\"web\",\"message\":\"Testing\"}"
```

---

## Anti-spam

El sistema incluye:

- **Honeypot**: Campos ocultos `honeypot` y `company`
- **Rate limit**: Max 3 envíos cada 10 minutos por IP
- **Spam score**: Detección de patrones sospechosos
- **IP hashing**: No se guarda IP cruda, solo hash

---

## Admin

Acceder a `/admin/` con el superusuario creado para:

- Ver todos los leads
- Filtrar por estado, tipo de proyecto, presupuesto
- Cambiar estado de leads
- Ver historial de eventos
