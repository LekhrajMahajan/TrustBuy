# 🛒 TrustBuy — Full-Stack E-Commerce Platform

TrustBuy is a **full-stack e-commerce web application** built with the **MERN stack** (MongoDB, Express, React, Node.js). It allows users to browse and buy products, sellers to manage their inventory, and admins to oversee the entire platform — all in one cohesive app.

> 🔗 **Live Demo:** [https://trust-buy.vercel.app](https://trust-buy.vercel.app)

---

## 🏗️ Architecture Overview

```
TrustBuy/
├── backend/        ← Node.js + Express REST API server
├── frontend/       ← React + Vite single-page application
├── package.json    ← Root workspace config
├── vercel.json     ← Deployment configuration
└── .gitignore      ← Files to exclude from Git
```

The project is split into two independent apps that communicate over **HTTP (REST API)** and **WebSockets (Socket.io)**.

```
User Browser
    │
    ▼
React (Vite dev server :5173)
    │  Component calls api.js → Axios HTTP request
    ▼
Express Server (:5000)
    │  authMiddleware checks JWT → Route matches → Controller runs
    │  Mongoose query
    ▼
MongoDB Atlas (Cloud)
    │  Returns data
    ▼
Controller → JSON Response → React → Updates UI
```

For **real-time features** (notifications):
```
Backend (socket.io) ←→ Frontend (socket.io-client)
         [WebSocket connection — instant push updates]
```

---

## ⚙️ Technologies Used & Why

### 🔵 Backend

| Technology | Why It's Used |
|---|---|
| **Node.js** | JavaScript runtime — write server code in the same language as the frontend |
| **Express.js v5** | Minimal web framework — handles HTTP routes, middleware, request/response |
| **MongoDB** | NoSQL document database — flexible schema, great for products with varying attributes |
| **Mongoose** | ODM (Object-Document Mapper) — schema validation + easy DB queries in JS |
| **JWT (jsonwebtoken)** | Stateless authentication — user login creates a token sent in every request header |
| **bcryptjs** | Password hashing — never stores plain-text passwords; all passwords are salted & hashed |
| **dotenv** | Loads secrets (DB URI, JWT secret) from `.env` so they're never hardcoded |
| **cors** | Allows the React frontend (different port/domain) to call the backend API |
| **express-rate-limit** | Prevents brute-force attacks by limiting requests per IP |
| **google-auth-library** | Verifies Google OAuth tokens for "Sign in with Google" |
| **socket.io** | Real-time WebSocket communication — used for live notifications |
| **node-cron** | Task scheduler — runs the dynamic pricing engine automatically on a schedule |
| **json2csv** | Converts MongoDB data to CSV — used by admin to export reports |
| **axios** | HTTP client — used server-side to call external APIs if needed |
| **nodemon** | Dev tool — auto-restarts server on file save (dev only) |

### 🟠 Frontend

| Technology | Why It's Used |
|---|---|
| **React 19** | UI library — builds the entire interface from reusable components |
| **Vite** | Build tool & dev server — extremely fast hot-reload during development |
| **React Router DOM v7** | Client-side routing — navigates between pages without full page reload |
| **TailwindCSS** | Utility-first CSS — fast, consistent styling with responsive design built-in |
| **Framer Motion** | Animation library — smooth page transitions, hover effects, micro-animations |
| **Axios** | HTTP client — makes API calls from components to the backend |
| **Socket.io-client** | Connects React to the backend WebSocket for live notifications |
| **Recharts + Chart.js** | Data visualization — pie charts and line graphs in the Admin Dashboard |
| **Lucide React + React Icons** | Icon libraries — consistent icons throughout the UI |
| **Radix UI** | Accessible headless UI primitives — Navbar menus, dropdowns (screen-reader friendly) |
| **@react-oauth/google** | Google Sign-In button component for the frontend |
| **Three.js + @react-three/fiber** | 3D rendering — used for 3D product previews |
| **Lenis** | Smooth scroll library — silky-smooth page scrolling |
| **Sonner** | Toast notification library — elegant success/error popups |
| **clsx + tailwind-merge** | Safely merges Tailwind class names in components without conflicts |
| **PostCSS + Autoprefixer** | Adds vendor prefixes automatically for cross-browser compatibility |
| **ESLint** | Catches bugs and enforces coding standards |
| **gh-pages** | Deploys the built frontend to GitHub Pages |

---

## 📁 File-by-File Breakdown

---

### 🔵 BACKEND

#### `backend/server.js` — Entry Point
The entire backend starts here. It:
- Connects to MongoDB using Mongoose
- Sets up Express middleware (JSON parsing, CORS)
- Registers all route files under `/api/...`
- Starts the dynamic price scheduler
- Listens on port `5000`

#### `backend/.env` — Environment Secrets
Stores sensitive configuration never committed to Git:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret key for signing/verifying tokens
- `PORT` — Server port number

#### `backend/package.json` — Dependency List
Lists all npm packages the backend requires + `start` / `dev` scripts.

---

#### `backend/models/` — Database Schemas
Define the *shape* of data in MongoDB. Mongoose validates before saving.

| File | Purpose |
|---|---|
| `userModel.js` | User schema: name, email, hashed password, role (buyer/seller/admin), Google OAuth ID, profile image |
| `productModel.js` | Product schema: name, price, category, images (Base64), stock, seller ID, ratings |
| `orderModel.js` | Order schema: buyer ID, list of products, total price, status, payment method, address |

---

#### `backend/routes/` — API Endpoint Definitions
Each file maps a URL path to a controller function.

| File | Endpoints |
|---|---|
| `userRoutes.js` | `POST /api/users/login`, `POST /api/users/register`, `GET /api/users/profile` |
| `productRoutes.js` | `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` |
| `orderRoutes.js` | `POST /api/orders`, `GET /api/orders/myorders`, `GET /api/orders/:id` |
| `adminRoutes.js` | `GET /api/admin/users`, `PUT /api/admin/sellers/approve`, `GET /api/admin/analytics`, `GET /api/admin/export` |

---

#### `backend/controllers/` — Business Logic
Contains the actual code that runs when a route is hit.

| File | What It Does |
|---|---|
| `authController.js` | `register()` hashes password & saves user; `login()` verifies credentials & returns JWT; `googleLogin()` verifies Google token |
| `productController.js` | `getProducts()` with filters/search/pagination; `createProduct()` validates seller; `updateProduct()`, `deleteProduct()` |
| `orderController.js` | `createOrder()` saves order + deducts stock; `getMyOrders()` returns a user's order history |
| `userController.js` | `getProfile()`, `updateProfile()`, `uploadProfileImage()` |
| `adminController.js` | Analytics queries, seller approvals, user management, CSV export, dynamic pricing controls |

---

#### `backend/middleware/` — Request Guards

| File | Purpose |
|---|---|
| `authMiddleware.js` | Extracts JWT from `Authorization` header, verifies it, attaches `req.user` so controllers know who is making the request |
| `errorMiddleware.js` | Global error handler — catches all unhandled errors and returns a consistent JSON error response |

---

#### `backend/utils/priceScheduler.js` — Dynamic Pricing Engine
Uses `node-cron` to automatically adjust product prices based on demand/stock on a scheduled interval.

---

#### `backend/seeder.js` — Database Seeder
A one-time script to populate the database with sample products. Run with `node seeder.js`.

#### `backend/check_counts.js` / `fix_db_images.js` / `verify_api.js`
Developer utility/debug scripts used during development to sanity-check data and verify API responses.

---

---

### 🟠 FRONTEND

#### `frontend/index.html` — HTML Shell
The single HTML file for the entire React app. React mounts into `<div id="root">`. Also sets SEO meta tags, favicon links, and the page title.

#### `frontend/vite.config.js` — Vite Build Config
Configures the dev server (port, proxy), the React plugin, and the build output folder (`dist/`).

#### `frontend/tailwind.config.js` — Tailwind Config
Customizes Tailwind: which files to scan for class names, custom colors, fonts, and animations for the TrustBuy brand.

#### `frontend/postcss.config.js` — PostCSS Config
Processes Tailwind and adds browser prefixes (e.g., `-webkit-`) for older browsers.

#### `frontend/eslint.config.js` — Linting Rules
Enforces React hooks usage rules and catches common bugs before runtime.

#### `frontend/jsconfig.json` — JS Path Aliases
Enables importing as `@/components/Foo` instead of long relative paths like `../../components/Foo`.

---

#### `frontend/src/main.jsx` — React Entry Point
Mounts the `<App>` component into `index.html`'s `#root`. Wraps everything in `<GoogleOAuthProvider>` for Google Sign-In.

#### `frontend/src/App.jsx` — The Router
Defines all page routes using React Router and wraps the app in `AuthContext` and `CartContext` providers.

#### `frontend/src/index.css` — Global Styles
Base CSS: Tailwind directives, custom font imports, CSS resets, scrollbar styling, and CSS variables for the theme.

---

#### `frontend/src/pages/` — Page Components
Each file is one full screen of the app.

| File | What It Shows |
|---|---|
| `HomePage.jsx` | Hero slider, featured categories, product listings, promotional banners |
| `ShopPage.jsx` | Full product catalog with search, filter by category/price, and sorting |
| `ProductDetailsPage.jsx` | Single product: images, description, reviews, add-to-cart, seller info |
| `CartPage.jsx` | Cart items, quantity controls, price summary, checkout button |
| `PaymentPage.jsx` | Address form, payment method selection (COD/UPI/Card), order review |
| `LoginPage.jsx` | Email/password login + Google Sign-In button |
| `RegisterPage.jsx` | Account creation with role selection (buyer/seller) |
| `ProfilePage.jsx` | Edit profile info, upload avatar, change password |
| `MyOrdersPage.jsx` | All orders placed by the logged-in user |
| `OrderSuccessPage.jsx` | Confirmation screen shown after a successful order |
| `OrderTrackingPage.jsx` | Real-time order status tracker with a visual step progress bar |
| `AdminDashboard.jsx` | Admin control panel: users, sellers, analytics, dynamic pricing, exports |
| `SellerDashboard.jsx` | Seller panel: add/edit/delete products, view sales stats |
| `Shop/Phones.jsx` (+ 6 others) | Category pages (Phones, Laptops, Audio, etc.) — each passes a `category` prop to `ShopPage` |

---

#### `frontend/src/components/` — Reusable UI Components

| File | Purpose |
|---|---|
| `Navbar.jsx` | Top navigation: logo, links, search, cart icon, user dropdown, mobile hamburger menu |
| `Footer.jsx` | Site footer: links, social media icons, copyright |
| `ProductCard.jsx` | Reusable card showing a product's image, title, price, and rating |
| `Preloader.jsx` | Loading spinner shown while page/data loads |
| `ErrorBoundary.jsx` | Catches JS crashes in child components and shows a friendly error UI |
| `dashboard/AnalyticsOverview.jsx` | Admin charts: sales over time, top products, revenue |
| `dashboard/DynamicPricing.jsx` | Admin UI to configure and monitor auto-pricing rules |
| `dashboard/ProductControl.jsx` | Admin table to manage all products across all sellers |
| `dashboard/SellerTable.jsx` | Admin table: approve/reject seller applications |
| `dashboard/UserDetails.jsx` | Admin: view, edit, or delete any user account |
| `ui/` | Shared low-level UI elements (Buttons, Inputs, Cards) based on Radix UI |

---

#### `frontend/src/context/` — Global State Management

| File | Purpose |
|---|---|
| `AuthContext.jsx` | Stores logged-in user info (name, role, token). Any component can read this — no prop drilling. Handles login/logout/refresh. |
| `AuthContextValue.js` | Exports the context object for clean imports |
| `CartContext.jsx` | Stores cart items (products + quantities). Persists to `localStorage` so the cart survives page refresh. |

---

#### `frontend/src/hooks/` — Custom React Hooks

| File | Purpose |
|---|---|
| `useAuth.jsx` | Shortcut: `const { user } = useAuth()` instead of `useContext(AuthContext)` everywhere |
| `useServerWakeup.js` | Pings the backend on app load to wake it up if sleeping (Render free tier cold-start) |

---

#### `frontend/src/services/api.js` — Centralized API Layer
All Axios HTTP calls in one place. If the backend URL ever changes, you only update **one file**.

#### `frontend/src/utils/` — Utility Functions
Helper functions used across multiple components (e.g., price formatting, text truncation, date formatting).

#### `frontend/src/lib/` — Library Config
Sets up the `cn()` utility that merges Tailwind classes safely without conflicts.

#### `frontend/public/` — Static Assets
Images, logos, and favicons served directly without processing by Vite.

---

## 🚀 Root-Level Files

| File | Purpose |
|---|---|
| `package.json` | Monorepo workspace config — can run both frontend and backend together |
| `vercel.json` | Tells Vercel how to deploy: backend as a Node.js serverless API, frontend as a static build |
| `.gitignore` | Prevents committing `node_modules`, `.env` secrets, and build artifacts to Git |

---

## 🎯 Why This Stack?

| Choice | Reason |
|---|---|
| **Full JavaScript (Node + React)** | One language across frontend and backend — no context switching |
| **MongoDB** | Schema-less NoSQL fits e-commerce perfectly (products have wildly different attributes) |
| **JWT Authentication** | Stateless — the server doesn't store sessions, scales easily across multiple instances |
| **Vite over Create React App** | 10–100× faster dev server and build times |
| **TailwindCSS** | Rapid UI development with a consistent, responsive design system |
| **Framer Motion** | Smooth animations that give the app a premium, polished feel |
| **Vercel Deployment** | Zero-config deployment for both the frontend (static) and backend (serverless) |

---

## 🛠️ Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend
```bash
cd backend
npm install
# Create a .env file with MONGO_URI and JWT_SECRET
npm run dev     # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## 👤 User Roles

| Role | Capabilities |
|---|---|
| **Buyer** | Browse products, manage cart, place & track orders, write reviews |
| **Seller** | All buyer capabilities + manage own product listings, view sales analytics |
| **Admin** | Full platform control: manage all users, approve sellers, view analytics, export reports, configure dynamic pricing |

---

## 📄 License

This project is for educational and portfolio purposes.
