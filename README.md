# ⛳ Golf Charity Subscription Platform

A beginner-friendly MERN stack web application for managing golf charity subscriptions, score tracking, and monthly prize draws.

---

## 🗂️ Project Structure

```
golf-charity-platform/
├── backend/                   ← Express + MongoDB API
│   ├── config/db.js           ← MongoDB connection
│   ├── controllers/           ← Route logic
│   │   ├── authController.js
│   │   ├── scoreController.js
│   │   ├── charityController.js
│   │   ├── drawController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js            ← JWT protect middleware
│   │   └── role.js            ← Admin-only middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Score.js
│   │   ├── Charity.js
│   │   └── DrawResult.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── scoreRoutes.js
│   │   ├── charityRoutes.js
│   │   ├── drawRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js              ← Entry point
│   ├── .env                   ← Environment variables
│   └── package.json
│
└── frontend/                  ← React (Vite)
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx ← Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── AdminRoute.jsx
    │   │   ├── ScoreForm.jsx
    │   │   ├── ScoreList.jsx
    │   │   ├── CharityCard.jsx
    │   │   └── DrawResults.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── CharityList.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx             ← Router + route guards
    │   ├── main.jsx
    │   └── index.css           ← All styles
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (`mongod`) OR MongoDB Atlas connection string

---

### 1. Backend Setup

```bash
cd golf-charity-platform/backend

# Install dependencies
npm install

# Create/edit .env file (already created with defaults)
# Edit MONGO_URI if using MongoDB Atlas
notepad .env
```

**`.env` contents:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/golf-charity-db
JWT_SECRET=golfcharity_super_secret_key_2024
JWT_EXPIRE=7d
```

```bash
# Start the backend (development mode with auto-reload)
npm run dev

# OR for production
npm start
```

✅ Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd golf-charity-platform/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

---

## 👤 User Roles & How to Test

### Public Visitor
- Visit `/` (Home) and `/charities` — no login needed

### Registered User
1. Go to `/signup`
2. Fill in name, email, password, select a subscription plan, choose a charity
3. You'll be redirected to `/dashboard`

> **Note:** Charities must be added by an Admin first. Add one via the Admin panel before signing up as a user.

### Admin
1. Sign up as a regular user first
2. In MongoDB, manually set the `role` field to `"admin"` for that user:
   ```
   db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
   ```
3. Log back in → you'll be redirected to `/admin`

---

## 🔗 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get profile |
| PUT | `/api/auth/me/charity` | Private | Update charity |
| GET | `/api/scores` | Private | Get my scores |
| POST | `/api/scores` | Private | Add score (auto-caps at 5) |
| PUT | `/api/scores/:id` | Private | Edit score |
| DELETE | `/api/scores/:id` | Private | Delete score |
| GET | `/api/charities` | Public | List charities |
| POST | `/api/charities` | Admin | Add charity |
| PUT | `/api/charities/:id` | Admin | Edit charity |
| DELETE | `/api/charities/:id` | Admin | Delete charity |
| POST | `/api/draw/run` | Admin | Run monthly draw |
| GET | `/api/draw/results` | Admin | All draw results |
| GET | `/api/draw/myresults` | Private | My draw results |
| GET | `/api/admin/users` | Admin | All users |
| GET | `/api/admin/users/:id/scores` | Admin | User's scores |
| PUT | `/api/admin/users/:id/subscription` | Admin | Toggle subscription |

---

## 🎰 Monthly Draw Logic

1. Admin clicks **"Run Monthly Draw"** in Admin Panel → Draw tab
2. System generates **5 unique random numbers** (1–45)
3. Compares each active user's scores against drawn numbers
4. Users with **3, 4, or 5 matches** are recorded as winners
5. Results saved to `drawResults` collection and displayed in dashboards

---

## 📊 Database Collections

| Collection | Key Fields |
|-----------|-----------|
| `users` | name, email, password(hashed), role, subscription{type,status,renewalDate}, selectedCharity, contributionPercentage |
| `scores` | userId (ref), value (1–45), date |
| `charities` | name, description, imageUrl |
| `drawResults` | drawDate, numbers[5], winners[{userId, userName, matchCount, matchedNumbers}] |

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens expire in **7 days**
- All private routes protected with `protect` middleware
- Admin routes additionally protected with `requireAdmin` middleware
- Subscription status checked before allowing dashboard access

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Styling | Vanilla CSS with CSS Variables |
