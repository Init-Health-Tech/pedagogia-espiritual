# Despliegue en producción

> **Recomendado:** usa Docker → [`DEPLOY-DOCKER.md`](DEPLOY-DOCKER.md)  
> Esta guía es la alternativa manual (Gunicorn + systemd + nginx en el host).

Arquitectura:

| Componente | Dominio | Plataforma |
|------------|---------|------------|
| Frontend (React + Vite) | `https://pedagogia-espiritual.init.com.mx` | Vercel |
| Backend (Django REST) | `https://api.pedagogia-espiritual.init.com.mx` | VM DigitalOcean |

---

## 1. DNS

En el panel DNS de `init.com.mx`, crea estos registros:

| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | `pedagogia-espiritual` | `cname.vercel-dns.com` (Vercel te dará el valor exacto al conectar el dominio) |
| A | `api.pedagogia-espiritual` | IP pública de la VM en DigitalOcean |

---

## 2. Frontend en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com).
2. Configura el proyecto:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. En **Settings → Environment Variables**, agrega (Production):

   ```
   VITE_API_URL=https://api.pedagogia-espiritual.init.com.mx/api
   ```

   > También está en `frontend/.env.production`; la variable en Vercel tiene prioridad si la defines ahí.

4. En **Settings → Domains**, agrega `pedagogia-espiritual.init.com.mx`.
5. Despliega. El archivo `frontend/vercel.json` maneja el enrutamiento SPA de React Router.

---

## 3. Backend en DigitalOcean (VM)

### 3.1 Preparar la VM (Ubuntu 22.04+)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip nginx postgresql postgresql-contrib certbot python3-certbot-nginx git
```

### 3.2 PostgreSQL

```bash
sudo -u postgres psql <<'SQL'
CREATE USER pedagogia WITH PASSWORD 'tu-contrasena-segura';
CREATE DATABASE pedagogia_espiritual OWNER pedagogia;
GRANT ALL PRIVILEGES ON DATABASE pedagogia_espiritual TO pedagogia;
SQL
```

### 3.3 Clonar y configurar la app

```bash
sudo mkdir -p /opt/apps/pedagogia-espiritual
sudo chown $USER:$USER /opt/apps/pedagogia-espiritual
git clone <url-del-repo> /opt/apps/pedagogia-espiritual
cd /opt/apps/pedagogia-espiritual/backend

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edita .env con valores reales (SECRET_KEY, DB_PASSWORD, etc.)
nano .env

python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_data   # opcional, solo primera vez
python manage.py createsuperuser
```

Genera un `SECRET_KEY` seguro:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3.4 Permisos

```bash
sudo chown -R www-data:www-data /opt/apps/pedagogia-espiritual/backend/media
sudo chown -R www-data:www-data /opt/apps/pedagogia-espiritual/backend/staticfiles
```

### 3.5 Systemd (Gunicorn)

```bash
sudo cp /opt/apps/pedagogia-espiritual/deploy/systemd/pedagogia-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pedagogia-api
sudo systemctl start pedagogia-api
sudo systemctl status pedagogia-api
```

### 3.6 Nginx

```bash
sudo cp /opt/apps/pedagogia-espiritual/deploy/nginx/pedagogia-api.conf /etc/nginx/sites-available/pedagogia-api
sudo ln -s /etc/nginx/sites-available/pedagogia-api /etc/nginx/sites-enabled/
sudo nginx -t
```

Antes de SSL, comenta temporalmente el bloque `listen 443` y deja solo el bloque HTTP para obtener el certificado:

```bash
sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot -w /var/www/certbot \
  -d api.pedagogia-espiritual.init.com.mx
```

Restaura la config completa con SSL y reinicia:

```bash
sudo systemctl reload nginx
sudo systemctl restart pedagogia-api
```

### 3.7 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 4. Verificación

```bash
# API responde
curl -I https://api.pedagogia-espiritual.init.com.mx/api/auth/login/

# CORS (desde el navegador en pedagogia-espiritual.init.com.mx)
# Login con usuario de prueba debe funcionar sin errores de CORS
```

---

## 5. Actualizaciones

### Frontend (Vercel)

Push a la rama conectada → Vercel despliega automáticamente.

### Backend (VM)

```bash
cd /opt/apps/pedagogia-espiritual
git pull
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart pedagogia-api
```

---

## Variables de entorno de referencia

### Frontend (`VITE_*`)

| Variable | Desarrollo | Producción |
|----------|------------|------------|
| `VITE_BACKEND_PORT` | `8005` | — |
| `VITE_API_URL` | — (usa proxy `/api`) | `https://api.pedagogia-espiritual.init.com.mx/api` |

### Backend (`.env`)

Ver `backend/.env.example` para la lista completa.
