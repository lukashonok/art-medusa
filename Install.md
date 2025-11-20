# Medusa E-commerce Deployment Guide

Быстрая инструкция для развёртывания Medusa на новом сервере с HTTPS.

## Предварительные требования

- Ubuntu 20.04+ сервер
- Root доступ или sudo
- Открытые порты: 80, 443, 22
- Узнай IP сервера: `curl ifconfig.me`

---

## Часть 1: Подготовка сервера

### 1.1 Установка Docker и Docker Compose

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверка
docker --version
docker-compose --version
```

**⚠️ ВАЖНО: Перелогинься после установки Docker!**

```bash
exit
# Зайди снова по SSH
```

### 1.2 Увеличение SWAP (опционально, если мало RAM)

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Часть 2: Развёртывание приложения

### 2.1 Клонирование проекта

```bash
cd /var/www
git clone https://github.com/your-username/art-medusa.git art-medusa-app
cd art-medusa-app
```

### 2.2 Создание compose файлов

**compose.yaml** (Backend + Database):
```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: medusa-starter
      POSTGRES_PASSWORD: CHANGE_THIS_PASSWORD
      POSTGRES_DB: medusa-starter
    ports:
      - 5432:5432
    deploy:
      resources:
        limits:
          cpus: 1
          memory: 1024M
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "medusa-starter"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    ports:
      - 6379:6379
    volumes:
      - cache-backend-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend-server:
    image: dembyvlad/art-medusa:latest
    ports:
      - 9000:9000
    deploy:
      resources:
        limits:
          cpus: 1
          memory: 2048M
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - backend-server-data:/data
    environment:
      NODE_ENV: development
      STORE_CORS: https://YOUR_IP.nip.io
      ADMIN_CORS: https://YOUR_IP.nip.io,https://api.YOUR_IP.nip.io
      REDIS_URL: redis://redis:6379
      CACHE_REDIS_URL: redis://redis:6379
      EVENTS_REDIS_URL: redis://redis:6379
      WE_REDIS_URL: redis://redis:6379
      DATABASE_URL: postgresql://medusa-starter:CHANGE_THIS_PASSWORD@postgres:5432/medusa-starter?sslmode=disable
      POSTGRES_URL: postgresql://medusa-starter:CHANGE_THIS_PASSWORD@postgres:5432/medusa-starter?sslmode=disable
      MEDUSA_CREATE_ADMIN_USER: true
      MEDUSA_ADMIN_EMAIL: admin@medusa-test.com
      MEDUSA_ADMIN_PASSWORD: CHANGE_ADMIN_PASSWORD
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/health"]
      interval: 10s
      timeout: 5s
      start_period: 10s
      retries: 5

volumes:
  postgres-data:
  backend-server-data:
  cache-backend-data:
```

**compose.seed.yaml**:
```yaml
services:
  seed:
    image: dembyvlad/art-medusa:latest
    command: yarn seed
    restart: "no"
    environment:
      REDIS_URL: redis://redis:6379
      CACHE_REDIS_URL: redis://redis:6379
      EVENTS_REDIS_URL: redis://redis:6379
      WE_REDIS_URL: redis://redis:6379
      DATABASE_URL: postgresql://medusa-starter:CHANGE_THIS_PASSWORD@postgres:5432/medusa-starter?sslmode=disable
      POSTGRES_URL: postgresql://medusa-starter:CHANGE_THIS_PASSWORD@postgres:5432/medusa-starter?sslmode=disable
```

**compose.storefront.yaml**:
```yaml
services:
  frontend:
    image: dembyvlad/art-medusa-storefront:latest
    ports:
      - 8000:8000
    environment:
      - HOSTNAME=0.0.0.0
      - MEDUSA_BACKEND_URL=https://api.YOUR_IP.nip.io
      - NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.YOUR_IP.nip.io
      - NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=WILL_BE_ADDED_LATER
    deploy:
      resources:
        limits:
          cpus: 1
          memory: 1024M
    volumes:
      - storefront-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  storefront-data:
```

**⚠️ Замени в файлах:**
- `YOUR_IP` → твой реальный IP сервера (например `144-31-116-41`)
- `CHANGE_THIS_PASSWORD` → надёжный пароль для БД
- `CHANGE_ADMIN_PASSWORD` → надёжный пароль для админки

### 2.3 Запуск Backend

```bash
# Запуск базы данных и backend
docker compose up -d

# Проверка логов
docker compose logs -f backend-server

# Дождись сообщения "Server is ready on port: 9000"
# Ctrl+C для выхода из логов
```

### 2.4 Seed базы данных (только первый раз!)

```bash
docker compose -f compose.seed.yaml run --rm seed
```

### 2.5 Получение Publishable Key

```bash
# Временно открой админку по IP
# http://YOUR_SERVER_IP:9000/app
# Логин: admin@medusa-test.com
# Пароль: тот что указал в MEDUSA_ADMIN_PASSWORD

# В админке: Settings → API Keys → Publishable API Keys
# Скопируй ключ вида pk_xxxxx...
```

**Обнови `compose.storefront.yaml`** - вставь скопированный ключ в `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

---

## Часть 3: Настройка HTTPS с Nginx

### 3.1 Установка Nginx и Certbot

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

### 3.2 Настройка доменов (замени IP на свой)

```bash
# Узнай свой IP
export SERVER_IP=$(curl -s ifconfig.me)
echo "Твой IP: $SERVER_IP"

# Преобразуй IP для nip.io (замени точки на дефисы)
# Например: 144.31.116.41 → 144-31-116-41
export NIP_IP="${SERVER_IP//./-}"
export FRONTEND_DOMAIN="${NIP_IP}.nip.io"
export BACKEND_DOMAIN="api.${NIP_IP}.nip.io"

echo "Frontend: https://${FRONTEND_DOMAIN}"
echo "Backend: https://${BACKEND_DOMAIN}"
```

### 3.3 Создание Nginx конфигов

```bash
# Конфиг для фронтенда
sudo tee /etc/nginx/sites-available/storefront <<EOF
server {
    listen 80;
    server_name ${FRONTEND_DOMAIN};
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Конфиг для бэкенда
sudo tee /etc/nginx/sites-available/backend <<EOF
server {
    listen 80;
    server_name ${BACKEND_DOMAIN};
    
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Активация конфигов
sudo ln -sf /etc/nginx/sites-available/storefront /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверка и перезапуск
sudo nginx -t
sudo systemctl restart nginx
```

### 3.4 Получение SSL сертификатов

```bash
# Получи SSL (замени email на свой)
sudo certbot --nginx \
  -d ${FRONTEND_DOMAIN} \
  -d ${BACKEND_DOMAIN} \
  --email your@email.com \
  --agree-tos \
  --non-interactive

# Включи автообновление сертификатов
sudo systemctl enable certbot.timer
```

### 3.5 Обновление CORS в backend

Обнови в `compose.yaml`:
```yaml
environment:
  STORE_CORS: https://${FRONTEND_DOMAIN}
  ADMIN_CORS: https://${FRONTEND_DOMAIN},https://${BACKEND_DOMAIN}
```

Перезапусти backend:
```bash
docker compose restart backend-server
```

---

## Часть 4: Запуск Frontend

```bash
# Запуск фронтенда
docker compose -f compose.storefront.yaml up -d

# Проверка логов
docker compose -f compose.storefront.yaml logs -f

# Дождись "Ready in XXms"
```

---

## Проверка работоспособности

- **Фронтенд**: https://144-31-116-41.nip.io (замени на свой IP)
- **Админка**: https://api.144-31-116-41.nip.io/app
- **Backend Health**: https://api.144-31-116-41.nip.io/health

---

## GitHub Secrets для CI/CD

Добавь в **Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Описание | Пример значения |
|-------------|----------|-----------------|
| `DOCKERHUB_USERNAME` | Docker Hub username | `dembyvlad` |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token | Создай на hub.docker.com → Account Settings → Security |
| `MEDUSA_PUBLISHABLE_KEY` | Publishable API Key из админки | `pk_1461003f...` |
| `SERVER_HOST` | IP или домен сервера | `144.31.116.41` |
| `SERVER_USER` | SSH пользователь | `root` |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ | Содержимое `~/.ssh/id_ed25519` |
| `SERVER_PORT` | SSH порт (опционально) | `22` |
| `DEPLOY_PATH` | Путь к проекту на сервере | `/var/www/art-medusa-app` |

### Создание SSH ключа для GitHub Actions

```bash
# На локальной машине
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# Скопируй публичный ключ на сервер
ssh-copy-id -i ~/.ssh/github_actions_key.pub root@YOUR_SERVER_IP

# Скопируй приватный ключ
cat ~/.ssh/github_actions_key
# Вставь весь вывод в GitHub Secret SSH_PRIVATE_KEY
```

---

## Полезные команды

```bash
# Просмотр логов
docker compose logs -f backend-server
docker compose -f compose.storefront.yaml logs -f frontend

# Перезапуск сервисов
docker compose restart backend-server
docker compose -f compose.storefront.yaml restart frontend

# Обновление образов
docker compose pull
docker compose up -d

# Очистка старых образов
docker image prune -f

# Остановка всех сервисов
docker compose down
docker compose -f compose.storefront.yaml down

# Полная очистка (удаляет данные!)
docker compose down -v
```

---

## Troubleshooting

### Backend не стартует
```bash
docker compose logs backend-server | tail -50
# Проверь DATABASE_URL и REDIS_URL
```

### Frontend не видит backend
```bash
# Проверь из контейнера фронта
docker exec -it art-medusa-app-frontend-1 sh
curl https://api.YOUR_IP.nip.io/health
```

### SSL сертификат не работает
```bash
# Проверь DNS
dig YOUR_IP.nip.io +short

# Перезапусти certbot
sudo certbot renew --dry-run
```

### Cookie warnings в консоли
Это нормально для HTTP. С HTTPS предупреждения исчезнут.

---

## Резервное копирование

```bash
# Бэкап базы данных
docker exec art-medusa-app-postgres-1 pg_dump -U medusa-starter medusa-starter > backup_$(date +%Y%m%d).sql

# Восстановление
cat backup_20241116.sql | docker exec -i art-medusa-app-postgres-1 psql -U medusa-starter medusa-starter
```

---

**Готово! 🚀** Твой Medusa магазин работает с HTTPS.