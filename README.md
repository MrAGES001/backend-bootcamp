# Backend Bootcamp API

Live URL: https://backend-bootcamp-c3l1.onrender.com

## Description
A production-style backend API built with Node.js, Express, and PostgreSQL.

## Features
- JWT authentication + refresh tokens
- Role-based access control (admin/user)
- Password hashing (bcrypt)
- Rate limiting for auth routes
- Centralized error handling
- Deployed on Render

## Main Endpoints
- POST /auth/signup
- POST /auth/login
- GET /me (protected)
- PUT /auth/password (protected)
- GET /admin/stats (admin only)

## Tech Stack
- Node.js
- Express
- PostgreSQL
- JWT
- Render
