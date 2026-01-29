# Backend Bootcamp API

🔗 **Live API URL**  
https://backend-bootcamp-c3l1.onrender.com

---

## 📌 Overview
A production-style backend API built with **Node.js, Express, and PostgreSQL**.  
This project demonstrates real-world backend patterns such as authentication, authorization, database migrations, rate limiting, and cloud deployment.

---

## 🚀 Features
- RESTful API with Express
- PostgreSQL database with parameterized queries
- JWT authentication (access & refresh tokens)
- Role-based access control (admin / user)
- Password hashing with bcrypt
- Change password endpoint
- Rate limiting for auth routes
- Centralized error handling & request logging
- Deployed to Render using Docker

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** JWT, bcrypt
- **Security:** Rate limiting, RBAC
- **Deployment:** Docker, Render

---

## 🔐 Authentication Flow
1. User signs up → password is hashed and stored
2. User logs in → receives access token + refresh token
3. Protected routes require `Authorization: Bearer <accessToken>`
4. Refresh token can generate a new access token
5. Password can be changed securely

---

## 📡 API Endpoints

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `PUT /auth/password` 🔒

### User
- `GET /me` 🔒
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### Admin
- `GET /admin/stats` 🔒 (admin only)

---

## 🧪 How to Test (Postman)
1. `POST /auth/signup`
2. `POST /auth/login` → copy `accessToken`
3. `GET /me` with `Authorization: Bearer <token>`
4. `PUT /auth/password` to change password

---

## 📈 Scalability Notes
- Indexed unique fields (email)
- Ready for Redis caching for heavy reads
- Supports horizontal scaling via stateless JWT auth
- Can be split into microservices if needed

---

## 👤 Author
Backend Developer in training 🚀  
Built as part of a hands-on backend learning journey.
