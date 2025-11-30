# API Endpoints Reference - Akompta AI
## Développé par Marino ATOHOUN pour CosmoLAB Hub

Base URL: `http://localhost:8000/api`

---

## 🔐 Authentication Endpoints

### Register
- **URL**: `/auth/register/`
- **Method**: `POST`
- **Auth**: None
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+229 97 00 00 00",
  "account_type": "personal",  // or "business"
  "agreed": true,
  // For business accounts:
  "business_name": "My Company",
  "sector": "commerce",
  "location": "Cotonou, Bénin",
  "ifu": "123456789",
  "businessAgreed": true
}
```
- **Response**: `201 Created`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    ...
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login
- **URL**: `/auth/login/`
- **Method**: `POST`
- **Auth**: None
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
- **Response**: `200 OK` (same structure as register)

### Refresh Token
- **URL**: `/auth/token/refresh/`
- **Method**: `POST`
- **Auth**: None
- **Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```
- **Response**: `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get Profile
- **URL**: `/auth/me/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+229 97 00 00 00",
  "avatar": null,
  "account_type": "personal",
  "is_premium": false,
  "currency": "XOF",
  "language": "FR",
  "dark_mode": false,
  "created_at": "2025-11-28T09:00:00Z",
  "updated_at": "2025-11-28T09:00:00Z"
}
```

### Update Profile
- **URL**: `/auth/me/`
- **Method**: `PATCH`
- **Auth**: Bearer Token
- **Body**: (partial update)
```json
{
  "first_name": "Jane",
  "dark_mode": true
}
```
- **Response**: `200 OK` (updated user object)

### Change Password
- **URL**: `/auth/change-password/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!",
  "new_password2": "NewPass123!"
}
```
- **Response**: `200 OK`
```json
{
  "message": "Mot de passe modifié avec succès."
}
```

---

## 📦 Products Endpoints

### List Products
- **URL**: `/products/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Query Params**:
  - `category`: Filter by category (vente, depense, stock)
  - `stock_status`: Filter by stock status (ok, low, rupture)
  - `search`: Search in name and description
  - `page`: Page number
- **Response**: `200 OK`
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": "1",
      "name": "Tomates",
      "description": "Tomates fraîches",
      "price": "500.00",
      "unit": "Kg",
      "image": null,
      "category": "vente",
      "stock_status": "ok",
      "created_at": "2025-11-28T09:00:00Z",
      "updated_at": "2025-11-28T09:00:00Z"
    }
  ]
}
```

### Create Product
- **URL**: `/products/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "name": "Tomates",
  "description": "Tomates fraîches",
  "price": "500.00",
  "unit": "Kg",
  "category": "vente",
  "stock_status": "ok"
}
```
- **Response**: `201 Created`

### Update Product
- **URL**: `/products/{id}/`
- **Method**: `PATCH`
- **Auth**: Bearer Token
- **Body**: (partial update)
```json
{
  "price": "550.00",
  "stock_status": "low"
}
```
- **Response**: `200 OK`

### Delete Product
- **URL**: `/products/{id}/`
- **Method**: `DELETE`
- **Auth**: Bearer Token
- **Response**: `204 No Content`

### Export Products
- **URL**: `/products/export/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK` (CSV file)

---

## 💰 Transactions Endpoints

### List Transactions
- **URL**: `/transactions/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Query Params**:
  - `type`: Filter by type (income, expense)
  - `category`: Filter by category
  - `date_range`: Filter by date (today, week, month, year)
  - `search`: Search in name and category
  - `ordering`: Sort by field (date, amount, -date, -amount)
  - `page`: Page number
- **Response**: `200 OK`
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/transactions/?page=2",
  "previous": null,
  "results": [
    {
      "id": "1",
      "name": "Vente tomates",
      "amount": "5000.00",
      "type": "income",
      "category": "Ventes",
      "date": "2025-11-28T09:00:00Z",
      "currency": "FCFA",
      "created_at": "2025-11-28T09:00:00Z",
      "updated_at": "2025-11-28T09:00:00Z"
    }
  ]
}
```

### Create Transaction
- **URL**: `/transactions/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "name": "Vente tomates",
  "amount": "5000.00",
  "type": "income",
  "category": "Ventes",
  "date": "2025-11-28T09:00:00Z"
}
```
- **Response**: `201 Created`

### Update Transaction
- **URL**: `/transactions/{id}/`
- **Method**: `PATCH`
- **Auth**: Bearer Token
- **Body**: (partial update)
- **Response**: `200 OK`

### Delete Transaction
- **URL**: `/transactions/{id}/`
- **Method**: `DELETE`
- **Auth**: Bearer Token
- **Response**: `204 No Content`

### Transaction Summary
- **URL**: `/transactions/summary/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "balance": "50000.00",
  "income_24h": "10000.00",
  "expenses_24h": "3000.00",
  "income_variation": 15.5,
  "expenses_variation": -5.2
}
```

---

## 📊 Budgets Endpoints

### List Budgets
- **URL**: `/budgets/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "1",
      "category": "Transport",
      "limit": "50000.00",
      "color": "#FF5733",
      "spent_amount": "15000.00",
      "percentage": 30.0,
      "created_at": "2025-11-28T09:00:00Z",
      "updated_at": "2025-11-28T09:00:00Z"
    }
  ]
}
```

### Create Budget
- **URL**: `/budgets/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "category": "Transport",
  "limit": "50000.00",
  "color": "#FF5733"
}
```
- **Response**: `201 Created`

### Update Budget
- **URL**: `/budgets/{id}/`
- **Method**: `PATCH`
- **Auth**: Bearer Token
- **Body**: (partial update)
- **Response**: `200 OK`

### Delete Budget
- **URL**: `/budgets/{id}/`
- **Method**: `DELETE`
- **Auth**: Bearer Token
- **Response**: `204 No Content`

---

## 📢 Ads Endpoints

### List Ads
- **URL**: `/ads/`
- **Method**: `GET`
- **Auth**: None (public)
- **Query Params**:
  - `search`: Search in product_name, owner_name, description, location
  - `page`: Page number
- **Response**: `200 OK`
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "1",
      "product_name": "Engrais bio",
      "owner_name": "AgriCorp",
      "description": "Engrais de qualité",
      "image": "http://localhost:8000/media/ads/engrais.jpg",
      "whatsapp": "+22890123456",
      "website": "https://agricorp.com",
      "location": "Lomé",
      "is_verified": true,
      "created_at": "2025-11-28T09:00:00Z",
      "updated_at": "2025-11-28T09:00:00Z"
    }
  ]
}
```

### Create Ad
- **URL**: `/ads/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "product_name": "Engrais bio",
  "owner_name": "AgriCorp",
  "description": "Engrais de qualité",
  "whatsapp": "+22890123456",
  "website": "https://agricorp.com",
  "location": "Lomé"
}
```
- **Response**: `201 Created`

---

## 🔔 Notifications Endpoints

### List Notifications
- **URL**: `/notifications/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "1",
      "type": "reminder",
      "title": "Rappel de paiement",
      "message": "N'oubliez pas de payer votre loyer",
      "is_read": false,
      "created_at": "2025-11-28T09:00:00Z"
    }
  ]
}
```

### Create Notification
- **URL**: `/notifications/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "type": "reminder",
  "title": "Rappel de paiement",
  "message": "N'oubliez pas de payer votre loyer"
}
```
- **Response**: `201 Created`

### Mark as Read
- **URL**: `/notifications/{id}/mark_read/`
- **Method**: `PATCH`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "status": "marked as read"
}
```

### Mark All as Read
- **URL**: `/notifications/mark_all_read/`
- **Method**: `PATCH`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "status": "all marked as read"
}
```

---

## 🎫 Support Endpoints

### List Tickets
- **URL**: `/support/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "1",
      "subject": "Problème de connexion",
      "message": "Je n'arrive pas à me connecter",
      "status": "open",
      "created_at": "2025-11-28T09:00:00Z",
      "updated_at": "2025-11-28T09:00:00Z"
    }
  ]
}
```

### Create Ticket
- **URL**: `/support/`
- **Method**: `POST`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "subject": "Problème de connexion",
  "message": "Je n'arrive pas à me connecter"
}
```
- **Response**: `201 Created`

---

## 📈 Analytics Endpoints

### Overview (Revenue vs Expenses)
- **URL**: `/analytics/overview/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
[
  {
    "month": "Jan 2025",
    "income": "10000.00",
    "expenses": "5000.00"
  },
  {
    "month": "Feb 2025",
    "income": "12000.00",
    "expenses": "6000.00"
  }
]
```

### Breakdown (Expenses by Category)
- **URL**: `/analytics/breakdown/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
[
  {
    "category": "Transport",
    "amount": "15000.00",
    "percentage": 30.0
  },
  {
    "category": "Stock",
    "amount": "25000.00",
    "percentage": 50.0
  }
]
```

### KPIs
- **URL**: `/analytics/kpi/`
- **Method**: `GET`
- **Auth**: Bearer Token
- **Response**: `200 OK`
```json
{
  "average_basket": "5000.00",
  "estimated_mrr": "50000.00",
  "cac": "1000.00"
}
```

---

## 🔒 Authentication Header

For all authenticated endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "type": "validation_error",
  "errors": {
    "email": ["Ce champ est obligatoire."],
    "password": ["Le mot de passe est trop court."]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error."
}
```

---

**Développé par Marino ATOHOUN pour CosmoLAB Hub**  
**Dernière mise à jour**: 2025-11-28
