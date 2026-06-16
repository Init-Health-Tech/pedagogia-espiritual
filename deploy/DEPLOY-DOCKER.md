# Despliegue del backend con Docker (recomendado)

Stack en la VM:

```
nginx (puerto 80/443) → api (Gunicorn/Django) → db (PostgreSQL)
```

Todo se levanta con Docker Compose desde `/opt/apps/pedagogia-espiritual/deploy/docker`.

---

## Requisitos en la VM

- Ubuntu 22.04+
- DNS: `api.pedagogia-espiritual.init.com.mx` → IP de la VM
- Docker + Docker Compose

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git ca-certificates curl

curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# Cierra sesión SSH y vuelve a entrar para usar docker sin sudo
```

---

## 1. Clonar el repo

```bash
sudo mkdir -p /opt/apps
sudo chown $USER:$USER /opt/apps

git clone <url-del-repo> /opt/apps/pedagogia-espiritual
cd /opt/apps/pedagogia-espiritual/deploy/docker
```

---

## 2. Configurar variables

```bash
cp .env.example .env
nano .env
```

Genera `SECRET_KEY`:

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Asegúrate de que `DB_PASSWORD` sea seguro (mismo valor que usa el contenedor `db`).

---

## 3. Levantar los contenedores

```bash
docker compose up -d --build
```

Esto hace automáticamente:

- Crea PostgreSQL
- Corre migraciones
- Recolecta archivos estáticos
- Inicia Gunicorn y nginx

Verifica:

```bash
docker compose ps
docker compose logs -f api
curl -I http://api.pedagogia-espiritual.init.com.mx/api/auth/login/
```

---

## 4. Datos iniciales y superusuario

```bash
# Datos de demo (opcional)
docker compose exec api python manage.py seed_data

# Admin de Django
docker compose exec api python manage.py createsuperuser
```

---

## 5. SSL (HTTPS)

Con los contenedores corriendo en HTTP:

```bash
sudo apt install -y certbot
sudo mkdir -p /var/www/certbot

sudo certbot certonly --webroot -w /var/www/certbot \
  -d api.pedagogia-espiritual.init.com.mx
```

Activa la config con HTTPS:

```bash
cp nginx/default.ssl.conf nginx/default.conf
docker compose restart nginx
```

Prueba:

```bash
curl -I https://api.pedagogia-espiritual.init.com.mx/api/auth/login/
```

---

## 6. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Comandos útiles

```bash
cd /opt/apps/pedagogia-espiritual/deploy/docker

# Ver logs
docker compose logs -f

# Reiniciar solo la API
docker compose restart api

# Actualizar después de git pull
git -C /opt/apps/pedagogia-espiritual pull
docker compose up -d --build

# Shell en el contenedor
docker compose exec api bash

# Backup de la base de datos
docker compose exec db pg_dump -U pedagogia pedagogia_espiritual > backup.sql
```

---

## Actualizaciones

```bash
cd /opt/apps/pedagogia-espiritual
git pull
cd deploy/docker
docker compose up -d --build
```

Las migraciones y `collectstatic` corren solas al reiniciar el contenedor `api`.

---

## Despliegue manual (sin Docker)

Si prefieres Gunicorn + systemd + nginx en el host, usa [`DEPLOY.md`](DEPLOY.md).
