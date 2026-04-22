# InventoryAPI Frontend

A modular, role-based inventory management frontend built with **React + Vite + Tailwind CSS**, connected to a Flask REST API backend with a JSON Server fallback.

---

## 🚀 Tech Stack

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| React 18        | UI framework            |
| Vite            | Dev server + bundler    |
| Tailwind CSS    | Styling                 |
| React Router v6 | Client-side routing     |
| Axios           | HTTP requests           |
| JSON Server     | Local fallback database |

---

## 📁 Project Structure

src/
├── api/
│ └── axios.js # Axios instance — Flask primary, JSON Server fallback
│
├── assets/ # Static assets (images, icons)
│
├── components/ # Reusable UI components
│ ├── Navbar.jsx
│ ├── ProductForm.jsx
│ ├── ProductCard.jsx
│ ├── CategoryForm.jsx
│ ├── CategoryCard.jsx
│ ├── SupplierForm.jsx
│ ├── SupplierCard.jsx
│ ├── InventoryTracking.jsx
│ ├── DashboardHeader.jsx
│ └── ProtectedRoute.jsx
│
├── contexts/ # Global state
│ ├── AuthContext.jsx
│ └── RoleContext.jsx
│
├── hooks/ # Custom hooks
│ ├── useAuth.js # Login, logout, register, hasRole
│ ├── useUsers.js # Fetch, delete, update users
│ ├── useProducts.js # CRUD for products
│ ├── useCategory.js # CRUD for categories
│ ├── useSuppliers.js # CRUD for suppliers
│ ├── useInventory.js # Inventory transactions
│ ├── useRoleGuard.js # Role-based access control
│ └── useStats.js # Dashboard statistics
│
├── pages/ # Page components
│ ├── Home.jsx # Landing page with live stats
│ ├── Login.jsx # Authentication
│ ├── Register.jsx # Sign up
│ ├── DashboardAdmin.jsx # Admin — full access
│ ├── DashboardManager.jsx # Manager — no user management
│ ├── DashboardStaff.jsx # Staff — products only
│ └── Report.jsx # Reports page
│
├── routes/
│ └── App.jsx # Router + protected routes
│
├── styles/
│ ├── index.css # Tailwind base
│ └── theme.css # Custom overrides
│
├── utils/
│ ├── validation.js # Form validation helpers
│ └── helpers.js # Date formatting, error parsing
│
├── main.jsx # App entry point
└── index.html # Root HTML

---

## 👥 Role-Based Access

| Feature            | Staff | Manager | Admin |
| ------------------ | ----- | ------- | ----- |
| View products      | ✅    | ✅      | ✅    |
| Add/edit products  | ✅    | ✅      | ✅    |
| Manage categories  | ❌    | ✅      | ✅    |
| Manage suppliers   | ❌    | ✅      | ✅    |
| Inventory tracking | ✅    | ✅      | ✅    |
| View reports       | ❌    | ✅      | ✅    |
| Manage users       | ❌    | ❌      | ✅    |
| Delete records     | ❌    | ❌      | ✅    |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Flask backend running (optional — falls back to JSON Server)

### Installation

```bash
# Clone the repository
git clone https://github.com/Koech009/inventory-frontend.git
cd inventory-frontend

# Install dependencies
npm install
```

### Environment Setup

No `.env` file needed — the Vite proxy handles backend routing automatically.

Backend URLs are configured in `vite.config.js`:

- **Flask** → `http://localhost:5000` (primary)
- **JSON Server** → `http://localhost:3001` (fallback)

---

## 🏃 Running the App

### Option 1 — With Flask backend

```bash
# Terminal 1: Start Flask
cd ../backend
flask run

# Terminal 2: Start React
npm run dev
```

### Option 2 — With JSON Server only (no Flask)

```bash
# Terminal 1: Start JSON Server
json-server --watch db.json --port 3001

# Terminal 2: Start React
npm run dev
```

The app automatically detects which backend is available and switches accordingly.

---

## 🗄️ JSON Server Setup

Create a `db.json` in the project root:

```json
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "password": "admin123",
      "role": "admin"
    },
    {
      "id": "2",
      "username": "manager1",
      "email": "manager@example.com",
      "password": "manager123",
      "role": "manager"
    },
    {
      "id": "3",
      "username": "staff1",
      "email": "staff@example.com",
      "password": "staff123",
      "role": "staff"
    }
  ],
  "products": [],
  "categories": [],
  "suppliers": [],
  "inventory": []
}
```

Start it with:

```bash
json-server --watch db.json --port 3001
```

---

## 🔐 Authentication Flow

1. User logs in via `POST /api/auth/login`
2. Backend returns `{ access_token, user: { id, role } }`
3. Token + role stored in `localStorage`
4. `useAuth` hook reads from localStorage on mount
5. `ProtectedRoute` checks role before rendering dashboard
6. On `401` response → auto logout + redirect to `/login`

---

## 🛣️ Routes

| Path                 | Component          | Access       |
| -------------------- | ------------------ | ------------ |
| `/`                  | `Home`             | Public       |
| `/login`             | `Login`            | Public       |
| `/register`          | `Register`         | Public       |
| `/dashboard/staff`   | `DashboardStaff`   | Staff only   |
| `/dashboard/manager` | `DashboardManager` | Manager only |
| `/dashboard/admin`   | `DashboardAdmin`   | Admin only   |

---

## 🔧 Key Configuration Files

### `vite.config.js`

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // Flask
      changeOrigin: true,
    }
  }
}
```

### `src/api/axios.js`

- Base URL: `/api` (proxied by Vite)
- Auto-attaches JWT token to every request
- Auto-fallback to JSON Server if Flask is down
- Auto-logout on `401 Unauthorized`

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🐛 Common Issues

### Blank page / white screen

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### `index.css` not found

Make sure `main.jsx` imports from the correct path:

```js
import "./styles/index.css"; // ✅
```

### `ProtectedRoute` not found

File must exist at:
