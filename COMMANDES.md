# 🛠️ COMMANDES UTILES - Akompta AI
## Développé par Marino ATOHOUN pour CosmoLAB Hub

---

## 🐍 Backend Django

### Démarrage

```bash
# Naviguer vers le backend
cd backend

# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Lancer le serveur
python manage.py runserver

# Lancer sur un port spécifique
python manage.py runserver 8080
```

### Base de Données

```bash
# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Accéder au shell Django
python manage.py shell

# Réinitialiser la base de données (ATTENTION: Supprime toutes les données)
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Tests

```bash
# Lancer tous les tests
python manage.py test

# Lancer des tests spécifiques
python manage.py test api.tests
python manage.py test api.tests_new
python manage.py test api.tests.AuthenticationTests

# Avec verbosité
python manage.py test --verbosity=2

# Avec coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Génère un rapport HTML
```

### Gestion des Données

```bash
# Exporter les données
python manage.py dumpdata > data.json
python manage.py dumpdata api > api_data.json

# Importer les données
python manage.py loaddata data.json

# Créer des données de test
python manage.py shell
>>> from api.models import *
>>> # Créer des objets...
```

### Utilitaires

```bash
# Collecter les fichiers statiques
python manage.py collectstatic

# Vérifier le projet
python manage.py check

# Afficher les URLs
python manage.py show_urls  # Nécessite django-extensions

# Nettoyer les sessions expirées
python manage.py clearsessions
```

---

## ⚛️ Frontend React

### Démarrage

```bash
# Naviguer vers le frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer sur un port spécifique
npm run dev -- --port 3000

# Build de production
npm run build

# Preview du build
npm run preview
```

### Gestion des Dépendances

```bash
# Installer une nouvelle dépendance
npm install axios
npm install -D @types/node  # Dev dependency

# Mettre à jour les dépendances
npm update

# Vérifier les dépendances obsolètes
npm outdated

# Nettoyer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Linting et Formatage

```bash
# Linter le code
npm run lint

# Fixer automatiquement
npm run lint:fix

# Formater avec Prettier (si configuré)
npm run format
```

### Tests (à implémenter)

```bash
# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

---

## 🔧 Git

### Workflow de Base

```bash
# Vérifier le statut
git status

# Ajouter des fichiers
git add .
git add backend/api/models.py

# Commit
git commit -m "feat: add notification model"

# Push
git push origin main

# Pull
git pull origin main
```

### Branches

```bash
# Créer une nouvelle branche
git checkout -b feature/notifications

# Changer de branche
git checkout main

# Lister les branches
git branch

# Fusionner une branche
git checkout main
git merge feature/notifications

# Supprimer une branche
git branch -d feature/notifications
```

### Historique

```bash
# Voir l'historique
git log
git log --oneline
git log --graph --oneline --all

# Voir les changements
git diff
git diff backend/api/models.py

# Annuler des changements
git checkout -- fichier.py  # Annuler les modifications
git reset HEAD fichier.py   # Unstage un fichier
git reset --hard HEAD       # ATTENTION: Annule tout
```

---

## 🐳 Docker (optionnel)

### Backend

```bash
# Créer l'image
docker build -t akompta-backend ./backend

# Lancer le conteneur
docker run -p 8000:8000 akompta-backend

# Avec docker-compose
docker-compose up backend
docker-compose up -d  # En arrière-plan
```

### Frontend

```bash
# Créer l'image
docker build -t akompta-frontend ./frontend

# Lancer le conteneur
docker run -p 5173:5173 akompta-frontend

# Avec docker-compose
docker-compose up frontend
```

### Commandes Utiles

```bash
# Lancer tout
docker-compose up

# Arrêter tout
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build

# Nettoyer
docker system prune -a
```

---

## 📊 Base de Données

### SQLite (Développement)

```bash
# Ouvrir la base de données
sqlite3 backend/db.sqlite3

# Commandes SQLite
.tables              # Lister les tables
.schema api_user     # Voir le schéma d'une table
SELECT * FROM api_user;  # Requête SQL
.quit                # Quitter
```

### PostgreSQL (Production)

```bash
# Se connecter
psql -U postgres -d akompta

# Commandes PostgreSQL
\dt                  # Lister les tables
\d api_user          # Décrire une table
SELECT * FROM api_user;  # Requête SQL
\q                   # Quitter

# Backup
pg_dump akompta > backup.sql

# Restore
psql akompta < backup.sql
```

---

## 🔍 Debugging

### Backend

```bash
# Activer le mode debug dans settings.py
DEBUG = True

# Utiliser pdb (Python Debugger)
# Dans le code:
import pdb; pdb.set_trace()

# Voir les requêtes SQL
python manage.py shell
>>> from django.db import connection
>>> connection.queries

# Logs
tail -f backend/logs/django.log
```

### Frontend

```bash
# Console du navigateur
# F12 ou Ctrl+Shift+I

# Voir les requêtes réseau
# Onglet Network dans DevTools

# React DevTools
# Extension navigateur

# Vite logs
# Visible dans le terminal où tourne npm run dev
```

---

## 📦 Déploiement

### Backend (Production)

```bash
# Installer Gunicorn
pip install gunicorn

# Lancer avec Gunicorn
gunicorn Akompta.wsgi:application --bind 0.0.0.0:8000

# Avec workers
gunicorn Akompta.wsgi:application --workers 4 --bind 0.0.0.0:8000

# Collecter les statiques
python manage.py collectstatic --noinput

# Migrer la base de données
python manage.py migrate --noinput
```

### Frontend (Production)

```bash
# Build
npm run build

# Le dossier dist/ contient les fichiers à déployer

# Servir avec un serveur HTTP simple
npx serve -s dist

# Ou copier vers Nginx/Apache
cp -r dist/* /var/www/html/
```

---

## 🧹 Nettoyage

### Backend

```bash
# Supprimer les fichiers Python compilés
find . -type f -name "*.pyc" -delete
find . -type d -name "__pycache__" -delete

# Supprimer les migrations (ATTENTION)
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
```

### Frontend

```bash
# Nettoyer le cache
rm -rf node_modules/.cache

# Nettoyer le build
rm -rf dist

# Nettoyer tout
rm -rf node_modules dist .cache
npm install
```

---

## 📝 Commandes Personnalisées

### Créer des Données de Test

```bash
# Backend
python manage.py shell
>>> from api.models import User, Transaction, Product
>>> user = User.objects.create_user(email='test@test.com', password='test123', first_name='Test', last_name='User')
>>> Transaction.objects.create(user=user, name='Test', amount=1000, type='income', category='Ventes', date=timezone.now())
```

### Réinitialiser un Utilisateur

```bash
python manage.py shell
>>> from api.models import User
>>> user = User.objects.get(email='admin@akompta.com')
>>> user.set_password('newpassword')
>>> user.save()
```

### Vérifier les Endpoints

```bash
# Avec curl
curl http://localhost:8000/api/auth/login/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Avec httpie (plus lisible)
http POST http://localhost:8000/api/auth/login/ \
  email=test@test.com password=test123
```

---

## 🔐 Sécurité

### Générer une Nouvelle SECRET_KEY

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Vérifier les Vulnérabilités

```bash
# Backend
pip install safety
safety check

# Frontend
npm audit
npm audit fix
```

---

## 📊 Performance

### Analyser les Requêtes SQL

```bash
# Dans settings.py, activer:
DEBUG = True

# Puis dans le code:
from django.db import connection
print(len(connection.queries))
print(connection.queries)
```

### Profiler le Code

```bash
# Installer django-debug-toolbar
pip install django-debug-toolbar

# Configurer dans settings.py
# Voir la documentation officielle
```

---

## 🆘 Dépannage

### Backend ne démarre pas

```bash
# Vérifier les migrations
python manage.py showmigrations

# Vérifier la configuration
python manage.py check

# Vérifier les dépendances
pip list
pip install -r requirements.txt
```

### Frontend ne démarre pas

```bash
# Vérifier Node/npm
node --version
npm --version

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier les ports
lsof -i :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows
```

### Erreurs CORS

```bash
# Backend settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

---

## 📚 Ressources

### Documentation
- Django: https://docs.djangoproject.com/
- DRF: https://www.django-rest-framework.org/
- React: https://react.dev/
- Vite: https://vitejs.dev/

### Outils
- Postman: https://www.postman.com/
- DB Browser for SQLite: https://sqlitebrowser.org/
- React DevTools: Extension navigateur

---

**Développé par Marino ATOHOUN pour CosmoLAB Hub**  
**Dernière mise à jour**: 2025-11-28
