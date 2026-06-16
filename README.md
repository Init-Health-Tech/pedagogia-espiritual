# MFST — Pedagogía Espiritual

Plataforma web para el **Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad**.

Stack: **Django REST Framework** (backend) + **React + Vite** (frontend).

## Características

### Área de miembros
- **Ficha Pedagógica**: seguimiento del avance espiritual por etapas
- **Videos y contenidos**: biblioteca formativa (documentos, presentaciones, esquemas)
- **Grupos de pastoreo**: comunidad, horarios y esquemas de sesión
- **Comunicación interna**: anuncios y mensajería
- **Perfil personal**

### Panel administrativo (`/admin`)
- Gestión de **usuarios y accesos**
- Administración de **contenidos**
- **Pagos y suscripciones**
- **Grupos de pastoreo**
- **Anuncios** globales o por grupo

## Paleta visual

Colores sobrios inspirados en la espiritualidad franciscana: tonos tierra, crema, verde salvia, burdeos y acentos dorados.

## Requisitos

- Python 3.11+
- Node.js 18+

## Instalación

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8005
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El archivo `frontend/.env` debe apuntar al mismo puerto del backend (`VITE_BACKEND_PORT=8005`).

Abre la URL que muestre Vite (ej. [http://localhost:5173](http://localhost:5173) o 5175 si ese puerto está ocupado).

> **Importante:** Si cambias el puerto del backend, actualiza `VITE_BACKEND_PORT` en `frontend/.env` y reinicia `npm run dev`.

## Usuarios de demostración

| Usuario  | Contraseña  | Rol           |
|----------|-------------|---------------|
| `admin`  | `admin123`  | Administrador |
| `miembro`| `miembro123`| Miembro       |

También puedes usar el **Django Admin** en [http://localhost:8000/admin/](http://localhost:8000/admin/) con el usuario `admin`.

## Estructura del proyecto

```
WebApp-Pedagogía/
├── backend/
│   ├── config/           # Settings y URLs
│   ├── accounts/         # Usuarios, roles, JWT
│   ├── pedagogia/        # Ficha pedagógica y etapas
│   ├── content/          # Videos, documentos, presentaciones
│   ├── groups/           # Grupos de pastoreo
│   ├── payments/         # Planes, suscripciones, pagos
│   └── communications/   # Anuncios y mensajes
└── frontend/
    └── src/
        ├── pages/        # Páginas públicas, usuario y admin
        ├── layouts/      # Sidebars de navegación
        └── services/     # Cliente API
```

## API

Base URL: `http://localhost:8000/api/`

- `POST /api/auth/login/` — Obtener token JWT
- `GET /api/accounts/me/` — Perfil actual
- `GET /api/pedagogia/fichas/mi_ficha/` — Ficha pedagógica del usuario
- `GET /api/content/videos/` — Videos
- `GET /api/groups/mis_grupos/` — Grupos del miembro
- `GET /api/communications/anuncios/` — Anuncios

## Producción

Despliegue separado:

- **Frontend:** Vercel → `https://pedagogia-espiritual.init.com.mx`
- **Backend:** VM DigitalOcean → `https://api.pedagogia-espiritual.init.com.mx`

Guía paso a paso: [`deploy/DEPLOY.md`](deploy/DEPLOY.md)

### Resumen rápido

**Vercel:** root directory `frontend`, variable `VITE_API_URL=https://api.pedagogia-espiritual.init.com.mx/api`

**DigitalOcean:** Django + Gunicorn + Nginx + PostgreSQL. Copia `backend/.env.example` a `.env` y configura `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` y la base de datos.

Checklist adicional:

1. Generar `SECRET_KEY` único (no usar el de desarrollo)
2. `DEBUG=False` en producción
3. Configurar almacenamiento de archivos en la VM o S3 para uploads
4. Integrar pasarela de pago real (Stripe, Mercado Pago, etc.)

## Licencia

Uso interno del Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad.
