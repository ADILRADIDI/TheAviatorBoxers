# 🐳 Guide Complet de Déploiement VPS Hostinger avec DOCKER (Sans GitHub) + Domaine GoDaddy

Ce guide détaille le déploiement **100% conteneurisé avec Docker & Docker Compose** de **The Aviator Boxers** sur un VPS Hostinger avec liaison de votre domaine **GoDaddy** et activation du **HTTPS (SSL Let's Encrypt)**.

> 💡 **Aucun compte GitHub n'est nécessaire.** Tout se fait directement entre votre ordinateur Mac/PC et votre VPS Hostinger via Docker et SSH/Rsync.

---

## 📋 Architecture Globale
- **Hébergement :** VPS Hostinger (Ubuntu 22.04 ou 24.04 LTS)
- **Gestionnaire DNS :** GoDaddy (Enregistrements A & CNAME pointant vers l'IP VPS)
- **Conteneurs Docker :**
  - `frontend` : Nginx Alpine servant l'application React / Vite (port 80)
  - `api` : Serveur backend Node.js (port 3001)
  - `postgres` : Base de données PostgreSQL 16
  - `redis` : Cache Redis 7
- **Sécurité & SSL :** Nginx Host / Certbot (HTTPS automatique avec renouvellement)

---

## 🛠️ ÉTAPE 1 : Configuration DNS sur GoDaddy

1. Connectez-vous à votre compte **GoDaddy**.
2. Allez dans **Mes Produits** > Cliquez sur **DNS** à côté de votre domaine.
3. Dans la table **Enregistrements DNS (DNS Records)**, ajoutez/modifiez :

| Type | Nom (Host) | Valeur (Points to) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `VOTRE_IP_VPS_HOSTINGER` (ex: `195.35.20.100`) | 1/2 Heure (ou 600s) |
| **CNAME** | `www` | `votredomaine.com` (ou `@`) | 1/2 Heure (ou 600s) |

> ⏳ *La propagation DNS prend entre 5 minutes et 1 heure.*

---

## 💻 ÉTAPE 2 : Préparation du VPS Hostinger (Une seule fois)

Connectez-vous à votre VPS via le terminal de votre Mac :

```bash
# Remplacez VOTRE_IP_VPS par l'adresse IP de votre serveur
ssh root@VOTRE_IP_VPS
```

Exécutez ces commandes pour mettre à jour le système, configurer le pare-feu et installer **Docker & Docker Compose** :

```bash
# 1. Mise à jour système
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw unzip rsync certbot

# 2. Configuration du Pare-feu UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
# Tapez 'y' pour confirmer

# 3. Installation officielle de Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. Vérifier l'installation de Docker
docker --version
docker compose version

# 5. Créer le dossier du projet sur le serveur
sudo mkdir -p /var/www/theaviator
```

---

## 🚀 ÉTAPE 3 : Transférer le Projet depuis votre Mac vers le VPS (Sans GitHub)

Ouvrez un **nouveau terminal local sur votre Mac** (dans le dossier de votre projet) :

```bash
# Rendez-vous dans le dossier de l'application
cd /Users/adilradidi/Desktop/base55theaviator-v3.0/TheAviatorBoxers

# Transférer tous les fichiers du projet directement vers le VPS via Rsync
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' -e ssh ./ root@VOTRE_IP_VPS:/var/www/theaviator/
```
*(Remplacez `VOTRE_IP_VPS` par l'IP de votre VPS Hostinger).*

---

## ⚙️ ÉTAPE 4 : Configuration des Variables d'Environnement (.env)

Sur votre VPS via SSH :

```bash
cd /var/www/theaviator

# Créer votre fichier .env de production
nano .env
```

Remplissez les variables nécessaires (par exemple) :

```env
NODE_ENV=production
POSTGRES_DB=aviator
POSTGRES_USER=aviator
POSTGRES_PASSWORD=VotreMotDePasseTresSecurise123!
FRONTEND_PORT=80
API_PORT=3001
VITE_BASE44_APP_BASE_URL=https://votredomaine.com
```
*(Sauvegardez avec `CTRL + O`, `Entrée`, puis quittez avec `CTRL + X`).*

---

## 🏗️ ÉTAPE 5 : Lancer l'Application avec Docker

Sur votre VPS dans `/var/www/theaviator` :

```bash
# Construire les images Docker et démarrer les conteneurs en tâche de fond (-d)
docker compose up -d --build
```

Pour vérifier que tous les conteneurs tournent :

```bash
docker compose ps
```
Vous devriez voir `frontend`, `api`, `postgres`, et `redis` avec le statut **Up (healthy)**.

---

## 🔒 ÉTAPE 6 : Activer le Certificat SSL HTTPS Gratuit (GoDaddy Domain)

Si vous exposez le port 80 et 443 directement avec un Reverse Proxy Nginx sur le VPS (ou Certbot standalone) :

### Méthode Recommandée avec Nginx Host + SSL :

1. Installez Nginx et Certbot sur le VPS :
```bash
sudo apt install -y nginx python3-certbot-nginx
```

2. Créez la configuration Nginx qui fait proxy vers Docker :
```bash
sudo nano /etc/nginx/sites-available/theaviator
```

Collez :
```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;

    location / {
        proxy_pass http://127.0.0.1:8080; # ou port de votre frontend Docker
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

*(Dans `docker-compose.yml`, assurez-vous que le frontend est mappé sur `127.0.0.1:8080:80`)*.

3. Activez le site :
```bash
sudo ln -s /etc/nginx/sites-available/theaviator /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

4. Générez le certificat SSL HTTPS automatique :
```bash
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
```
Certbot va configurer automatiquement le HTTPS et la redirection HTTP -> HTTPS !

---

## 🔄 Comment Mettre à Jour le Site Futur (Sans GitHub)

Chaque fois que vous modifiez le code sur votre Mac :

1. **Depuis votre Mac :**
```bash
cd /Users/adilradidi/Desktop/base55theaviator-v3.0/TheAviatorBoxers
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' -e ssh ./ root@VOTRE_IP_VPS:/var/www/theaviator/
```

2. **Sur votre VPS :**
```bash
cd /var/www/theaviator
docker compose up -d --build
```
*Docker reconstruit l'image et redémarre le conteneur en moins de 30 secondes sans coupure !*

---

## 🛠️ Commandes Docker Utiles au Quotidien

| Action | Commande |
| :--- | :--- |
| **Voir l'état des conteneurs** | `docker compose ps` |
| **Voir les logs en direct** | `docker compose logs -f` |
| **Voir les logs du frontend** | `docker compose logs -f frontend` |
| **Redémarrer les conteneurs** | `docker compose restart` |
| **Arrêter les conteneurs** | `docker compose down` |
| **Reconstruire et relancer** | `docker compose up -d --build` |
| **Nettoyer les images inutilisées** | `docker image prune -f` |
| **Voir l'utilisation RAM/CPU Docker** | `docker stats` |

---
*Ce guide 100% Docker a été configuré spécifiquement pour **The Aviator Boxers**.*
