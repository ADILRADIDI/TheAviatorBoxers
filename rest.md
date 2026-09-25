# 🚀 Guide Complet : Build, Push Docker Hub & Déploiement sur VPS Hostinger

Ce guide pas-à-pas contient toutes les commandes claires et simples pour compiler les conteneurs Docker de **THE AVIATOR**, les publier sur **Docker Hub**, et les déployer en production sur votre **VPS Hostinger**.

---

## 📋 Prérequis
1. Un compte [Docker Hub](https://hub.docker.com/) (remplacez `VOTRE_DOCKERHUB_USER` par votre identifiant Docker Hub).
2. Un VPS Hostinger (Ubuntu / Debian recommandé) avec accès SSH (`root@IP_DU_VPS`).
3. Votre nom de domaine pointé vers l'IP de votre VPS (ex: `theaviatorboxer.com`).

---

## 🛠️ ÉTAPE 1 : Build & Push vers Docker Hub (Depuis votre Mac)

### 1. Se connecter à Docker Hub
```bash
docker login
```
*(Entrez votre nom d'utilisateur et mot de passe Docker Hub)*

---

### 2. Définir votre nom d'utilisateur Docker Hub
```bash
export DOCKER_USER="VOTRE_DOCKERHUB_USER"
```

---

### 3. Build des images Docker (Multi-plateforme pour VPS Linux x86_64)

> [!TIP]
> Si vous compilez depuis un Mac (Apple Silicon M1/M2/M3), utilisez `--platform linux/amd64` pour garantir la compatibilité native avec le serveur VPS Hostinger.

#### A. Build du Frontend (React + Vite + Nginx) :
```bash
docker build --platform linux/amd64 -t $DOCKER_USER/aviator-frontend:latest -f Dockerfile .
```

#### B. Build du Backend API (NestJS + Prisma) :
```bash
docker build --platform linux/amd64 -t $DOCKER_USER/aviator-api:latest -f Dockerfile.api .
```

---

### 4. Pousser les images sur Docker Hub

```bash
docker push $DOCKER_USER/aviator-frontend:latest
docker push $DOCKER_USER/aviator-api:latest
```

---

## 🌐 ÉTAPE 2 : Configuration sur le VPS Hostinger

### 1. Connexion en SSH à votre VPS
```bash
ssh root@IP_DU_VPS
```

---

### 2. Installer Docker & Docker Compose sur le VPS (si non installés)
```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose Plugin
apt install -y docker-compose-plugin
```

---

### 3. Créer le dossier du projet
```bash
mkdir -p /var/www/theaviator
cd /var/www/theaviator
```

---

### 4. Créer le fichier `docker-compose.yml` sur le VPS
```bash
cat << 'EOF' > docker-compose.yml
services:
  api:
    image: VOTRE_DOCKERHUB_USER/aviator-api:latest
    restart: always
    environment:
      DATABASE_URL: postgresql://aviator:${POSTGRES_PASSWORD}@postgres:5432/aviator
      API_PORT: 3001
      MEDIA_ROOT: /var/lib/aviator/media
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_EMAIL: ${ADMIN_EMAIL:-admin@theaviator.local}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - media_data:/var/lib/aviator/media

  frontend:
    image: VOTRE_DOCKERHUB_USER/aviator-frontend:latest
    restart: always
    ports:
      - "80:80"
    depends_on:
      api:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1/"]
      interval: 10s
      timeout: 3s
      retries: 5

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: aviator
      POSTGRES_USER: aviator
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aviator -d aviator"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --appendonly yes
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  postgres_data:
  redis_data:
  media_data:
EOF
```
*(Remplacez `VOTRE_DOCKERHUB_USER` dans le fichier par votre identifiant Docker Hub).*

---

### 5. Créer le fichier d'environnement `.env` sur le VPS
```bash
cat << 'EOF' > .env
POSTGRES_PASSWORD=VotreMotDePasseTresSecurise2026!
JWT_SECRET=CleSecreteTresLongueEtAleatoireTheAviator2026!
ADMIN_EMAIL=admin@theaviator.local
ADMIN_PASSWORD=Aviator-Admin2026!
EOF
```

---

## 🚀 ÉTAPE 3 : Lancement & Initialisation sur le VPS

### 1. Télécharger les images et démarrer les conteneurs
```bash
docker compose pull
docker compose up -d
```

### 2. Vérifier que tous les conteneurs tournent
```bash
docker compose ps
```
*(Les services `frontend`, `api`, `postgres`, et `redis` doivent afficher le statut `Up` / `healthy`).*

### 3. Exécuter les migrations de base de données & initialiser les données (Seed)
```bash
docker compose exec api pnpm --filter @aviator/db migrate
docker compose exec api pnpm --filter @aviator/db seed
```

---

## 🔒 ÉTAPE 4 : Configuration Domaine & SSL Gratuit (HTTPS Let's Encrypt)

Si vous souhaitez ajouter un certificat SSL automatique avec **Certbot** ou un reverse proxy Nginx :

### Option simple : Certbot direct (ou Caddy)
```bash
# Installer Certbot & Nginx hôte si vous gérez le SSL sur l'hôte
apt install -y certbot python3-certbot-nginx
```

---

## 🔄 ÉTAPE 5 : Mises à jour futures (Workflow en 1 commande)

Chaque fois que vous modifiez le code :

### Sur votre Mac :
```bash
docker build --platform linux/amd64 -t $DOCKER_USER/aviator-frontend:latest -f Dockerfile .
docker build --platform linux/amd64 -t $DOCKER_USER/aviator-api:latest -f Dockerfile.api .
docker push $DOCKER_USER/aviator-frontend:latest
docker push $DOCKER_USER/aviator-api:latest
```

### Sur votre VPS Hostinger :
```bash
cd /var/www/theaviator
docker compose pull
docker compose up -d
```

---

## 🛠️ Commandes utiles pour le VPS
- **Voir les logs en direct** : `docker compose logs -f`
- **Voir les logs de l'API** : `docker compose logs -f api`
- **Redémarrer tous les services** : `docker compose restart`
- **Arrêter le projet** : `docker compose down`
