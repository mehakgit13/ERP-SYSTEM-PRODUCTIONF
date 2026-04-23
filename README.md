# 🏢 NexusERP — Full-Stack ERP Management System

A complete **MERN Stack** ERP system with JWT authentication, role-based access control, and a full suite of business modules.

## 🌐 Live Demo

> **Frontend:** `https://your-erp-app.vercel.app`
> **Backend API:** `https://your-erp-app.onrender.com`
> **API Docs (Swagger):** `https://your-erp-app.onrender.com/api/docs`

---

## 📁 Project Structure

```
erp-system/
├── backend/                  # Node.js + Express API
│   ├── config/               # DB connection, Swagger
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, error handler, rate limiter
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── utils/                # Paginate helper
│   ├── __tests__/            # Jest test suites
│   ├── server.js             # Entry point
│   ├── render.yaml           # Render deployment config
│   └── .env.example          # Environment template
│
└── frontend/                 # React 18 SPA
    ├── public/
    ├── vercel.json           # Vercel SPA routing fix
    └── src/
        ├── api/              # Axios instance + service functions
        ├── components/       # Reusable UI components
        ├── hooks/            # useApi, useAuth
        ├── pages/            # All ERP module pages
        ├── store/            # Redux Toolkit (auth slice)
        ├── styles/           # Global CSS
        └── App.jsx           # Router setup
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET

npm install
npm run dev
# API:    http://localhost:5000
# Docs:   http://localhost:5000/api/docs
# Health: http://localhost:5000/api/health
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# .env.local already points to http://localhost:5000/api

npm install
npm start
# App: http://localhost:3000
```

---

## ☁️ Production Deployment

### Step 1 — MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (save username & password)
4. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/erp_db
   ```
5. In **Network Access**, add `0.0.0.0/0` to allow Render to connect

---

### Step 2 — Deploy Backend on Render

1. Go to [Render](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. Fill settings:

| Setting | Value |
|---------|-------|
| Build Command | `npm install` |
| Start Command | `node server.js` |

5. Add **Environment Variables** in Render dashboard:

```
MONGO_URI    = mongodb+srv://user:pass@cluster.mongodb.net/erp_db
JWT_SECRET   = some_very_long_random_string_at_least_32_chars
JWT_EXPIRE   = 7d
NODE_ENV     = production
CLIENT_URL   = https://your-erp-app.vercel.app   ← add AFTER Vercel deploy
```

6. Click **Deploy** → you get: `https://your-erp-app.onrender.com`
7. Test: `https://your-erp-app.onrender.com/api/health`

---

### Step 3 — Deploy Frontend on Vercel

1. Go to [Vercel](https://vercel.com) → **Import Project**
2. Select your GitHub repo
3. Set **Root Directory** → `frontend`
4. Build settings (usually auto-detected):
   - Framework: **Create React App**
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add **Environment Variable**:

```
REACT_APP_API_URL = https://your-erp-app.onrender.com/api
```

6. Click **Deploy** → you get: `https://your-erp-app.vercel.app`

> ✅ Then go back to Render and set `CLIENT_URL=https://your-erp-app.vercel.app`

---

## 🔐 User Roles & Permissions

| Role      | Products | Customers | Suppliers | Sales Orders | Purchase Orders | GRN | Invoices | Users |
|-----------|----------|-----------|-----------|--------------|-----------------|-----|----------|-------|
| admin     | ✅ CRUD  | ✅ CRUD   | ✅ CRUD   | ✅ CRUD      | ✅ CRUD         | ✅  | ✅ CRUD  | ✅    |
| sales     | 👁 Read  | ✅ CRUD   | 👁 Read   | ✅ CRUD      | 👁 Read         | —   | ✅       | —     |
| purchase  | 👁 Read  | 👁 Read   | ✅ CRUD   | 👁 Read      | ✅ CRUD         | ✅  | 👁 Read  | —     |
| inventory | ✅ CRUD  | 👁 Read   | 👁 Read   | 👁 Read      | 👁 Read         | ✅  | 👁 Read  | —     |
| finance   | 👁 Read  | 👁 Read   | 👁 Read   | 👁 Read      | 👁 Read         | —   | ✅ CRUD  | —     |

---

## 📡 API Endpoints

| Module          | Endpoints |
|-----------------|-----------|
| Auth            | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Users           | `GET /api/users`, `GET/PUT/DELETE /api/users/:id`, `GET /api/users/stats` |
| Products        | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` |
| Customers       | `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/:id` |
| Suppliers       | `GET/POST /api/suppliers`, `GET/PUT/DELETE /api/suppliers/:id` |
| Sales Orders    | `GET/POST /api/sales-orders`, `GET/PUT /api/sales-orders/:id`, `PATCH .../status` |
| Purchase Orders | `GET/POST /api/purchase-orders`, `GET/PUT /api/purchase-orders/:id` |
| GRN             | `GET/POST /api/grn`, `GET /api/grn/:id` |
| Invoices        | `GET/POST /api/invoices`, `GET/PUT /api/invoices/:id`, `PATCH .../mark-paid` |
| Dashboard       | `GET /api/dashboard/stats` |
| Reports         | `GET /api/reports/sales`, `GET /api/reports/inventory`, `GET /api/reports/finance` |

All list endpoints support `?page=`, `?limit=`, and `?search=` query parameters.

---

## 🧪 Testing

```bash
cd backend
npm test
```

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, React Router v6, Redux Toolkit, Axios |
| UI         | Custom CSS, Chart.js, react-toastify, jsPDF |
| Forms      | Formik + Yup |
| Backend    | Node.js 18+, Express.js |
| Database   | MongoDB Atlas + Mongoose |
| Auth       | JWT + bcryptjs |
| Security   | Helmet, express-rate-limit, CORS |
| Docs       | Swagger (OpenAPI 3.0) |
| Testing    | Jest + Supertest |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## ⚠️ Common Issues

| Error | Fix |
|-------|-----|
| `Failed to fetch` | Wrong `REACT_APP_API_URL` in Vercel env vars |
| `CORS blocked` | Add your Vercel URL as `CLIENT_URL` in Render env vars |
| `App crashes on Render` | Missing env vars — check `MONGO_URI` and `JWT_SECRET` |
| `DB not connecting` | Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access |
| `404 on page refresh` | Already fixed — `vercel.json` handles SPA routing |
| `Render cold start slow` | Free tier sleeps after 15 min — first request takes ~30s |
