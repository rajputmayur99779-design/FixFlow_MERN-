# FixFlow — MERN Service & Repair Management Platform

A portfolio-ready MERN starter for electronics repair businesses. It includes customer, technician and admin roles; repair booking and status tracking; inventory; dashboard metrics; and printable invoices.

## Stack
- React + Vite + React Router
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcrypt
- Recharts for dashboard charts
- Plain CSS responsive UI

## Requirements
- Node.js 18+
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## 1. Start MongoDB
For a local MongoDB installation, start the MongoDB service. The default connection used below is:
`mongodb://127.0.0.1:27017/fixflow`

Or create a free MongoDB Atlas database and set `MONGO_URI` in `backend/.env`.

## 2. Backend setup
Open a terminal:
```bash
cd backend
npm install
copy .env.example .env
```
On macOS/Linux use `cp .env.example .env`.
Edit `.env` and set a long random `JWT_SECRET`. Then:
```bash
npm run seed
npm run dev
```
API runs at `http://localhost:5000`.

## 3. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL (usually `http://localhost:5173`).

## Demo accounts
After running `npm run seed`:
- Admin: `admin@fixflow.demo` / `Admin123!`
- Technician: `tech@fixflow.demo` / `Tech123!`
- Customer: `customer@fixflow.demo` / `Customer123!`

Change these credentials before deploying. Seed is intended only for local demos.

## Main workflows
1. Sign in as customer and create a repair request.
2. Sign in as admin to assign the request to the technician and update its status.
3. Sign in as customer to see the updated status in My Repairs.
4. Admin can add inventory items and see low-stock alerts.
5. Open a repair and use Print Invoice to save it as PDF from the browser print dialog.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/repairs`, `GET/PATCH/DELETE /api/repairs/:id`
- `GET/POST/PATCH/DELETE /api/inventory`
- `GET /api/dashboard/summary`

All protected routes require `Authorization: Bearer <token>`. Admin-only operations are enforced on the server.

## Important notes
- This is a complete local portfolio starter, not a hosted production service.
- Status changes are reflected on refresh; real-time WebSocket push, payment gateway, email/SMS delivery and cloud file uploads are not included.
- Before production deployment add rate limiting, email verification, password reset, audit logs, automated tests, secure cookie strategy, monitoring and backups.
- Never commit `.env` or real customer data.

## Suggested GitHub description
FixFlow is a MERN-based repair service management platform with role-based access, repair lifecycle tracking, inventory management, dashboard analytics and printable invoices.
