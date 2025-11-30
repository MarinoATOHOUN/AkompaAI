# Guide de Configuration de l'Enregistrement Vocal avec Gemini AI

## Vue d'ensemble

Le système d'enregistrement vocal permet aux utilisateurs de créer des transactions financières en parlant simplement au système. L'application utilise l'API Gemini de Google pour :
1. **Transcription audio** : Convertir la parole en texte
2. **Extraction de données** : Analyser l'intention et extraire les informations structurées
3. **Création automatique** : Enregistrer la transaction dans la base de données

## Architecture

### Backend (Django)

**Fichiers principaux:**
- `api/gemini_service.py` : Service pour interagir avec l'API Gemini
- `api/views.py` : Vue `VoiceCommandView` pour traiter les requêtes audio
- `api/urls.py` : Route `/api/voice-command/` pour l'endpoint

**Modèle de données:**
- Les transactions sont enregistrées dans le modèle `Transaction`
- Champs: `name`, `amount`, `type`, `category`, `currency`, `date`

### Frontend (React + TypeScript)

**Fichiers principaux:**
- `frontend/screens/VoiceScreen.tsx` : Interface d'enregistrement vocal
- `frontend/api.ts` : Méthode `voice.send()` pour envoyer l'audio au backend

**Fonctionnement:**
1. L'utilisateur appuie sur le bouton microphone
2. Le navigateur enregistre l'audio via `MediaRecorder`
3. Quand l'utilisateur arrête, l'audio est envoyé au backend
4. Le backend traite avec Gemini et retourne les résultats
5. La transaction est créée et affichée à l'utilisateur

## Configuration

### 1. Obtenir une clé API Gemini

1. Visitez [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Créez une nouvelle clé API
4. Copiez la clé générée

### 2. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```bash
cd backend
cp .env.example .env
```

Modifiez le fichier `.env` et remplacez `your-gemini-api-key-here` par votre vraie clé API :

```
GEMINI_API_KEY=AIzaSy...votre_vraie_clé_ici
```

### 3. Installer les dépendances

```bash
# Backend
cd backend
source venv/bin/activate
pip install google-genai

# Mettre à jour requirements.txt
pip freeze > requirements.txt

# Frontend (déjà installé normalement)
cd ../frontend
npm install
```

### 4. Redémarrer le serveur

```bash
# Backend
cd backend
source venv/bin/activate
python3 manage.py runserver

# Frontend (dans un autre terminal)
cd frontend
npm run dev
```

## Exemples d'utilisation

### Commandes vocales supportées

**Pour les dépenses (expenses):**
- "J'ai payé un ordinateur à 300000 FCFA"
- "J'ai acheté du pain pour 500 FCFA"
- "Dépense de 2000 FCFA pour le taxi"
- "J'ai dépensé 15000 pour les courses"

**Pour les revenus (income):**
- "J'ai vendu la tomate pour 500 FCFA le kilo"
- "J'ai reçu 50000 FCFA pour mon travail"
- "Vente de 10000 FCFA"

### Format de réponse Gemini

Le service Gemini retourne un JSON structuré :

```json
{
  "transcription": "J'ai payé un ordinateur à 300000 FCFA",
  "intent": "create_transaction",
  "data": {
    "type": "expense",
    "amount": 300000,
    "currency": "FCFA",
    "category": "Technologie",
    "name": "Ordinateur",
    "date": "2025-11-30"
  }
}
```

## Flux de données

```
┌─────────────┐
│  Utilisateur│
│  parle      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  VoiceScreen.tsx    │
│  - MediaRecorder    │
│  - Capture audio    │
└──────┬──────────────┘
       │ FormData (audio blob)
       ▼
┌─────────────────────┐
│  Backend API        │
│  /api/voice-command/│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  GeminiService      │
│  - Transcription    │
│  - Extraction       │
└──────┬──────────────┘
       │ JSON structuré
       ▼
┌─────────────────────┐
│  TransactionView    │
│  - Validation       │
│  - Sauvegarde DB    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Réponse Frontend   │
│  - Confirmation     │
│  - Affichage        │
└─────────────────────┘
```

## Tests

### Test manuel

1. Ouvrez l'application frontend
2. Connectez-vous avec un compte utilisateur
3. Allez sur la page "Vocal" (icône microphone)
4. Cliquez sur le bouton microphone
5. Dites une commande vocale (exemple : "J'ai acheté du pain pour 500 FCFA")
6. Arrêtez l'enregistrement
7. Vérifiez que la transaction apparaît dans votre liste

### Test avec curl

```bash
# Préparez un fichier audio (par exemple test.mp3)
# Ensuite envoyez-le au backend

curl -X POST http://localhost:8000/api/voice-command/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "audio=@test.mp3"
```

## Catégories automatiques

Le système Gemini analyse automatiquement le contexte et assigne les catégories appropriées :

- **Alimentation** : pain, tomate, courses, restaurant, etc.
- **Transport** : taxi, bus, essence, parking, etc.
- **Technologie** : ordinateur, téléphone, logiciel, etc.
- **Santé** : médicaments, docteur, hôpital, etc.
- **Logement** : loyer, électricité, eau, etc.
- **Divers** : autres dépenses non catégorisées

## Dépannage

### Erreur: "No module named 'google'"

```bash
cd backend
source venv/bin/activate
pip install google-genai
```

### Erreur: "GEMINI_API_KEY not found"

Vérifiez que :
1. Le fichier `.env` existe dans `backend/`
2. La variable `GEMINI_API_KEY` est définie
3. Le serveur a été redémarré après modification du `.env`

### L'audio n'est pas capturé

Vérifiez que :
1. Le navigateur a l'autorisation d'accéder au microphone
2. Vous utilisez HTTPS ou localhost (requis pour getUserMedia)
3. Le microphone fonctionne correctement

### La transcription est incorrecte

- Parlez clairement et lentement
- Réduisez le bruit ambiant
- Utilisez un microphone de qualité
- Vérifiez que la langue est bien le français

## Améliorations futures

1. **Support multi-langues** : Ajouter l'anglais, l'arabe, etc.
2. **Historique vocal** : Sauvegarder les enregistrements audio
3. **Confirmation vocale** : Demander confirmation avant de créer la transaction
4. **Édition vocale** : Permettre de modifier des transactions existantes
5. **Rapports vocaux** : "Quel est mon solde ?" ou "Combien j'ai dépensé ce mois ?"

## Sécurité

⚠️ **Important:**
- Ne jamais committer le fichier `.env` dans Git
- Garder votre clé API Gemini secrète
- Utiliser des variables d'environnement en production
- Limiter les permissions de la clé API

## Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs du serveur Django
3. Vérifiez la console du navigateur
4. Testez l'API Gemini directement sur [Google AI Studio](https://aistudio.google.com)
