# Shopping Mall Management System

A complete, production-quality full-stack web application built for managing shopping malls, their stores, owners, inventory, and point-of-sale billing.

## Technology Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend:** Next.js Server Actions, API Routes, Edge-compatible custom JWT Sessions (jose)
- **Database:** SQLite (for zero-configuration local development) with Prisma ORM
- **Authentication:** bcrypt password hashing + HTTP-only secure cookies

## Features
- **Admin Dashboard:** Manage all stores, assign store owners, track rent, view overall sales metrics.
- **Store Owner Dashboard:** Complete inventory management and metrics scoped strictly to the assigned store.
- **POS Billing System:** Fast search, cart management, subtotal/tax calculation, and database transaction-backed atomic checkout.
- **Role-based Authorization:** Secure server-side validation ensuring users only access their authorized endpoints and data.

## Getting Started

### 1. Install Dependencies
Run the following command to install required packages:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` if it doesn't already exist.
```bash
cp .env.example .env
```
The file uses a local SQLite database (`DATABASE_URL="file:./dev.db"`) out of the box.

### 3. Database Setup & Migrations
Create the database schema by pushing it via Prisma:
```bash
npx prisma db push
```

### 4. Seed Demo Data
Populate the database with a system admin, a store, an owner, customers, and dummy stock:
```bash
npx tsx prisma/seed.ts
```

### 5. Start the Development Server
Launch the application:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

## Demo Login Credentials

The application is pre-seeded with the following roles:

**System Admin**
- Email: `admin@example.com`
- Password: `Admin@123`

**Store Owner**
- Email: `owner@example.com`
- Password: `Owner@123`

## How Roles Work

- **ADMIN:** Has access to the `/admin` routes. Can manage users, owners, rent, create categories, and view all system activity. Admins cannot generate bills or manage store inventory directly.
- **STORE_OWNER:** Has access to the `/store` routes. Can only manage products, stock, and sales related to the specific store they are assigned to. Any attempt to modify API routes or access other stores is blocked server-side using the `storeId` linked securely in their JWT session token.
