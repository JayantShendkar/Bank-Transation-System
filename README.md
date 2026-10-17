# NexusBank — Full-Stack MERN Banking Platform

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

> A secure, full-stack digital banking platform. The backend is built with Node.js, Express, and MongoDB — featuring JWT authentication with token blacklisting, a double-entry ledger system for tamper-proof balance tracking, atomic fund transfers via MongoDB sessions, and Gmail OAuth2 email notifications. The frontend is a dark-themed React + Vite SPA styled with Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Accounts](#accounts)
  - [Transactions](#transactions)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Data Models](#data-models)
- [Email Notifications](#email-notifications)
- [Frontend Overview](#frontend-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

NexusBank is a full-stack banking application split into two parts: a **REST API backend** that handles all business logic and data persistence, and a **React frontend** that consumes it through a polished dark-themed UI.

The backend's most notable design decision is its **double-entry ledger architecture**. Rather than storing a mutable `balance` field on each account — which can drift under concurrent writes and leaves no audit trail — every credit and debit is recorded as an immutable `Ledger` document. An account's balance is always derived at query time by aggregating those entries, making it a mathematically accurate reflection of every transaction that has ever touched the account.

Fund transfers are executed inside **MongoDB multi-document transactions**, guaranteeing that the debit entry, credit entry, and transaction status update either all commit together or all roll back. Combined with **idempotency key validation** and a **JWT token blacklist**, the system is built to handle real-world failure modes that simpler banking APIs ignore.

---

## Features

**JWT Authentication with Token Blacklisting** — On login or registration, the server signs a JWT (3-day expiry) and sets it as a cookie. It is also returned in the response body for header-based clients. On logout, the token is added to a `tokenBlackList` MongoDB collection and checked on every subsequent protected request — making logout truly stateful. A TTL index on the blacklist purges entries automatically after 3 days, matching the token expiry exactly.

**Double-Entry Ledger for Balance Tracking** — Every transfer creates two immutable `Ledger` documents: a `DEBIT` on the sender's account and a `CREDIT` on the receiver's. Balances are computed on demand via a MongoDB `$group` aggregation. Ledger entries are protected by Mongoose pre-hooks that throw an error on any update or delete attempt, making the financial history append-only.

**Atomic Fund Transfers via MongoDB Sessions** — The debit entry, credit entry, and transaction status update are wrapped in a single Mongoose session. If anything fails mid-way, the entire session rolls back — no partial states are possible.

**Idempotency Protection** — Every transfer requires a client-generated `idempotencyKey`. The server checks for an existing transaction with that key before processing. Depending on the existing status (`PENDING`, `COMPLETED`, `FAILED`, `REVERSED`), it returns the appropriate response rather than creating a duplicate. A unique index on `idempotencyKey` provides a final safety net even under race conditions.

**Account Status Enforcement** — Accounts carry a `status` of `ACTIVE`, `FROZEN`, or `CLOSED`. Transfers validate that both accounts are `ACTIVE` before any money moves.

**System User & Initial Funds** — A privileged `systemUser` role allows seeding initial funds into user accounts via a dedicated protected endpoint. The `systemUser` flag on the User model is `select: false` (never exposed in normal responses) and `immutable: true`.

**Email Notifications** — Transactional emails are sent via Nodemailer using Gmail OAuth2 after registration and on transfer success or failure.

**React SPA Frontend** — A full-featured single-page application with protected routes, global auth state via React Context, real-time balance display, a fund transfer form, and a transaction history table — all styled with a dark glassmorphism design system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Runtime | Node.js |
| Backend Framework | Express.js v5 |
| Database | MongoDB via Mongoose v9 |
| Authentication | JSON Web Tokens (`jsonwebtoken`) + `cookie-parser` |
| Password Hashing | bcrypt v6 |
| Email | Nodemailer v8 with Gmail OAuth2 |
| CORS | `cors` middleware |
| Frontend Framework | React 18 with Vite |
| Frontend Routing | React Router v6 |
| Frontend HTTP Client | Axios (with `withCredentials: true`) |
| Frontend Styling | Tailwind CSS v4 |

---

## Repository Structure

```
NexusBank/
├── server/                             # Backend — Node.js / Express / MongoDB
│   ├── server.js                       # Entry point: loads .env, connects DB, starts on port 3000
│   └── src/
│       ├── app.js                      # Express setup: CORS, middleware, route mounting
│       ├── config/
│       │   └── db.js                   # Mongoose connection (exits process on failure)
│       ├── controllers/
│       │   ├── auth.controller.js      # register, login, logout, profile
│       │   ├── account.controller.js   # createAccount, getUserAccounts, getAccountBalance
│       │   └── transaction.controller.js # createTransaction, initialFunds, fetchTransactions
│       ├── middlewares/
│       │   └── auth.middleware.js      # authMiddleware + authSystemUserMiddleware
│       ├── models/
│       │   ├── user.model.js           # User schema with bcrypt pre-save hook
│       │   ├── account.model.js        # Account schema with getBalance() aggregation
│       │   ├── transaction.model.js    # Transaction (PENDING/COMPLETED/FAILED/REVERSED)
│       │   ├── ledger.model.js         # Immutable ledger entries (CREDIT/DEBIT)
│       │   └── blacklist.model.js      # JWT blacklist with 3-day TTL index
│       ├── routes/
│       │   ├── auth.routes.js          # /api/auth/*
│       │   ├── account.routes.js       # /api/accounts/*
│       │   └── transaction.routes.js   # /api/transactions/*
│       └── services/
│           └── email.service.js        # Nodemailer transport + email templates
│
└── banking_frontend/                   # Frontend — React / Vite / Tailwind CSS
    ├── index.html                      # Vite HTML shell
    └── src/
        ├── main.jsx                    # App entry point and router setup
        ├── context/
        │   └── AuthContext.jsx         # Global auth state (login, logout, token)
        ├── components/
        │   └── AccountCard.jsx         # Reusable card with live balance fetch
        └── pages/
            ├── Login.jsx               # /auth/login
            ├── Register.jsx            # /auth/register
            ├── Dashboard.jsx           # /dashboard — financial overview
            ├── CreateAccount.jsx       # /create-account
            ├── Transfer.jsx            # /transfer — fund transfer form
            └── TransactionHistory.jsx  # /history — transaction log table
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB replica set (required for multi-document transactions)
- A Gmail account with an OAuth2 application set up in [Google Cloud Console](https://console.cloud.google.com/)

### Backend Setup

```bash
cd server
npm install
node server.js
```

The API will start on `http://localhost:3000`. For development with auto-restart, use `npx nodemon server.js`.

### Frontend Setup

```bash
cd banking_frontend
npm install
npm run dev
```

The frontend dev server starts on `http://localhost:5173` with hot module replacement.

### Production Build (Frontend)

```bash
cd banking_frontend
npm run build   # Outputs optimized bundle to dist/
npm run preview # Preview the production build locally
```

---

## Environment Variables

Create a `.env` file inside the `server/` directory. **Never commit this file** — ensure `.env` is in `.gitignore`.

```env
# MongoDB connection string (replica set required for transactions)
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/backend-ledger

# JWT signing secret — use a long, random string
JWT_SECRET_KEY=your_strong_secret_here

# Gmail OAuth2 credentials (from Google Cloud Console)
EMAIL_USER=your_gmail@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

> Note: The server port is hardcoded to `3000` in `server.js`. To make it configurable, change the listen call to `app.listen(process.env.PORT || 3000, ...)`.

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes accept the JWT as a cookie named `token` (set automatically on login) **or** as a `Bearer` token in the `Authorization` header — both are supported.

---

### Authentication

#### `POST /api/auth/register`

Creates a new user. Hashes the password via a Mongoose pre-save hook, signs a JWT, sets a `token` cookie, and sends a welcome email asynchronously.

**Request Body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "securepassword" }
```

**Response `201`**
```json
{
  "user": { "_id": "...", "email": "jane@example.com", "name": "Jane Doe" },
  "token": "<jwt>"
}
```

Returns `422` if a user already exists with that email.

---

#### `POST /api/auth/login`

Authenticates a user by comparing the submitted password against the stored bcrypt hash. Sets a `token` cookie on success.

**Request Body**
```json
{ "email": "jane@example.com", "password": "securepassword" }
```

**Response `200`**
```json
{
  "user": { "_id": "...", "email": "jane@example.com", "name": "Jane Doe" },
  "token": "<jwt>"
}
```

Returns `401` if the email is not found or the password does not match.

---

#### `GET /api/auth/profile`

Returns the authenticated user's profile. Used by the frontend on page load to silently restore session state without prompting the user to log in again.

**Response `200`**
```json
{ "user": { "_id": "...", "email": "jane@example.com", "name": "Jane Doe" } }
```

---

#### `POST /api/auth/logout`

Clears the `token` cookie and adds the current token to the MongoDB blacklist. Future requests bearing the same token are rejected even if it has not yet expired.

**Response `200`**
```json
{ "message": "User logged out successfully" }
```

---

### Accounts

All account routes require authentication.

#### `POST /api/accounts`

Opens a new bank account for the authenticated user. No request body required — ownership is derived from the JWT. Accounts default to `status: ACTIVE` and `currency: INR`.

**Response `201`**
```json
{ "account": { "_id": "...", "user": "...", "status": "ACTIVE", "currency": "INR", "createdAt": "..." } }
```

---

#### `GET /api/accounts`

Returns all accounts belonging to the authenticated user.

**Response `200`**
```json
{ "accounts": [{ "_id": "...", "user": "...", "status": "ACTIVE", "currency": "INR" }] }
```

---

#### `GET /api/accounts/balance/:accountId`

Computes the account's live balance by running a MongoDB aggregation over the Ledger collection (`totalCredit − totalDebit`). Verifies account ownership before responding.

**Response `200`**
```json
{ "accountId": "...", "balance": 1500 }
```

Returns `404` if the account is not found or does not belong to the requesting user.

---

### Transactions

All transaction routes require authentication.

#### `POST /api/transactions`

Initiates a fund transfer. The full server-side flow is: validate fields → verify both accounts exist → check idempotency key → verify both accounts are `ACTIVE` → check sender's ledger balance → open a MongoDB session → create `PENDING` transaction + debit ledger entry + credit ledger entry → mark transaction `COMPLETED` → commit session → send success email.

**Request Body**
```json
{
  "fromAccount": "<accountId>",
  "toAccount":   "<accountId>",
  "amount":      250,
  "idempotencyKey": "1718200000000"
}
```

**Response `201`**
```json
{ "message": "Transaction completed sucessfully", "transaction": { ... } }
```

| Status | Scenario |
|---|---|
| `400` | Missing fields, invalid accounts, inactive account, or insufficient balance |
| `200` | Duplicate key with existing `COMPLETED` or `PENDING` transaction |
| `500` | Duplicate key with existing `FAILED` or `REVERSED` transaction |

---

#### `POST /api/transactions/system/initial-funds`

A privileged endpoint for seeding initial funds into a user account from the system account. Requires the `systemUser: true` flag on the authenticated user, enforced by `authSystemUserMiddleware`.

**Request Body**
```json
{ "toAccount": "<accountId>", "amount": 10000, "idempotencyKey": "system-seed-001" }
```

**Response `201`**
```json
{ "message": "Initial funds transaction completed sucessfully", "transaction": { ... } }
```

---

#### `GET /api/transactions`

Fetches all transactions where the authenticated user is either the sender or receiver. Results are sorted newest-first with `fromAccount` and `toAccount` populated (returning `status` and `currency` fields).

**Response `200`**
```json
{
  "message": "Transactions retrieved successfully",
  "transactions": [
    {
      "_id": "...",
      "fromAccount": { "_id": "...", "status": "ACTIVE", "currency": "INR" },
      "toAccount":   { "_id": "...", "status": "ACTIVE", "currency": "INR" },
      "amount": 250,
      "status": "COMPLETED",
      "idempotencyKey": "1718200000000",
      "createdAt": "2024-06-12T10:30:00.000Z"
    }
  ]
}
```

---

## Architecture & Design Decisions

**Double-Entry Ledger over a Balance Field** — Storing a mutable `balance` field on an Account document is simple but fragile: concurrent writes can cause race conditions, and there is no audit trail if something goes wrong. This project records every movement of money as an immutable `Ledger` entry typed as either `CREDIT` or `DEBIT`. The balance is always computed from these entries via a `$group` aggregation, making it impossible for the stored balance to diverge from the actual transaction history. Ledger immutability is enforced at the Mongoose middleware layer — any attempt to update or delete a ledger entry throws immediately.

**MongoDB Sessions for Atomicity** — A fund transfer must touch three documents atomically: a Transaction record, a debit Ledger entry, and a credit Ledger entry. Wrapping all three writes in `session.startTransaction()` / `session.commitTransaction()` means they either all succeed or the entire session rolls back. This requires MongoDB to be running as a replica set — MongoDB Atlas provides this by default.

**Token Blacklisting for Stateful Logout** — JWTs are stateless, which normally means you cannot invalidate one before it expires. This project solves that with a `tokenBlackList` collection checked on every protected request. A MongoDB TTL index on the `createdAt` field purges blacklisted tokens after exactly 3 days — matching the JWT expiry — so the collection never grows unboundedly.

**Dual Auth Support (Cookie + Bearer Token)** — The auth middleware reads `req.cookies.token || req.headers.authorization?.split(" ")[1]`, supporting both cookie-based auth (used by the browser frontend) and header-based auth (useful for API testing with Postman or for future mobile clients).

**System User for Fund Seeding** — Rather than an open endpoint for crediting arbitrary accounts, the system user concept gates fund seeding behind a privileged boolean flag that is `select: false` by default and `immutable: true` once set. This means it is never accidentally exposed and cannot be escalated by a regular user.

---

## Data Models

### User
```
email        String   required, unique, lowercase, regex-validated
name         String   required
password     String   required, min 6 chars, select: false — hashed by bcrypt pre-save hook
systemUser   Boolean  default: false, immutable: true, select: false
timestamps   createdAt, updatedAt
```

### Account
```
user         ObjectId → ref: User   required, indexed
status       String   enum: ACTIVE | FROZEN | CLOSED, default: ACTIVE
currency     String   required, default: "INR"
timestamps   createdAt, updatedAt

Instance method: getBalance() — $group aggregation on Ledger (totalCredit − totalDebit)
Compound index: { user: 1, status: 1 }
```

### Transaction
```
fromAccount    ObjectId → ref: Account   required, indexed
toAccount      ObjectId → ref: Account   required, indexed
amount         Number   required, min: 0
idempotencyKey String   required, unique, indexed
status         String   enum: PENDING | COMPLETED | FAILED | REVERSED, default: PENDING
timestamps     createdAt, updatedAt
```

### Ledger
```
account      ObjectId → ref: Account      required, immutable, indexed
transaction  ObjectId → ref: Transaction  required, immutable, indexed
amount       Number   required, immutable
type         String   enum: CREDIT | DEBIT, required, immutable

Pre-hooks block all findOneAndDelete, findOneAndUpdate, updateOne,
updateMany, deleteOne, deleteMany, remove, and findOneAndReplace operations.
```

### TokenBlackList
```
token        String   required, unique
timestamps   createdAt, updatedAt
TTL index:   { createdAt: 1 }, expireAfterSeconds: 259200  (3 days)
```

---

## Email Notifications

Emails are sent via Nodemailer configured with a Gmail OAuth2 transport — more secure than a plain app password. Three email templates are implemented:

**Welcome email** is sent after a user successfully registers. **Transfer success email** is sent to the sender after a transaction completes, showing the transferred amount and destination account ID. **Transfer failure email** is defined in the service but is not yet wired up to the failure path in the transaction controller — a good candidate for a first contribution.

Email sending is fire-and-forget: it runs asynchronously after the API response has already been sent, so a failed email delivery never blocks or errors the API call.

---

## Frontend Overview

The frontend is a React 18 SPA built with Vite, styled entirely with Tailwind CSS v4, and uses React Router v6 for client-side navigation. It communicates with the backend via a single Axios instance configured with `baseURL: "http://localhost:3000/api"` and `withCredentials: true`, so the JWT cookie is included automatically on every request with no manual token management required.

Global authentication state is managed through `AuthContext`, which exposes `login`, `register`, `logout`, and `fetchUser` to the entire component tree. On app load, the context calls `GET /auth/profile` to silently restore the session from the existing cookie — so users do not need to log in again after a page refresh.

All routes except `/auth/login` and `/auth/register` are protected. The six pages are: **Login**, **Register**, **Dashboard** (financial overview), **Create Account**, **Transfer** (fund transfer form with idempotency key generated as `Date.now().toString()`), and **Transaction History** (a full table of past transactions sorted newest-first).

The design uses a dark slate background (`#020617`), a custom `.glass` utility class that combines `backdrop-blur`, a near-transparent white fill, and a subtle white border to create frosted-glass cards, gradient accent buttons, and custom `fade-in-up` animations — all defined in Tailwind CSS v4's `@layer` system.

Account IDs are full MongoDB ObjectIds. The frontend derives a short display reference by taking the last 6 characters of the `_id` and formatting them as `ACC-XXXXXX` for user-facing screens.

---

## Contributing

Contributions are welcome. Please fork the repository, create a descriptively named feature branch, and open a pull request with a clear summary of your changes. For significant additions or architecture changes, open an issue first to discuss the approach.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
