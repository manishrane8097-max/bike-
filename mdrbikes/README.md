# 🏍️ MDR Bikes — Full Stack Website

A complete bike shop website with customer & admin login, order tracking, and bike inventory management.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML, CSS, Vanilla JS               |
| Backend    | Node.js + Express                   |
| Database   | MongoDB Atlas (free tier)           |
| Auth       | JWT + bcrypt                        |
| Deploy FE  | Vercel (free)                       |
| Deploy BE  | Railway (free tier)                 |

---

## Project Structure

```
mdrbikes/
├── frontend/
│   ├── index.html        ← Main website (your existing site)
│   ├── login.html        ← Login & Register page
│   ├── dashboard.html    ← Customer dashboard (order tracking)
│   └── admin.html        ← Admin panel (manage bikes & orders)
├── backend/
│   ├── server.js         ← Express app entry point
│   ├── package.json
│   ├── .env.example      ← Copy to .env and fill in values
│   ├── models/
│   │   ├── User.js
│   │   ├── Bike.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js       ← /api/auth/*
│   │   ├── bikes.js      ← /api/bikes/*
│   │   └── orders.js     ← /api/orders/*
│   └── middleware/
│       └── auth.js       ← JWT protect + adminOnly
└── vercel.json           ← Vercel frontend config
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Access   | Description              |
|--------|--------------------|----------|--------------------------|
| POST   | /api/auth/register | Public   | Create a new account     |
| POST   | /api/auth/login    | Public   | Login, returns JWT token |
| GET    | /api/auth/me       | Customer | Get logged-in user info  |
| PATCH  | /api/auth/me       | Customer | Update profile           |

### Bikes
| Method | Endpoint          | Access   | Description              |
|--------|-------------------|----------|--------------------------|
| GET    | /api/bikes        | Public   | List available bikes     |
| GET    | /api/bikes/all    | Admin    | All bikes (incl. hidden) |
| GET    | /api/bikes/:id    | Public   | Get single bike          |
| POST   | /api/bikes        | Admin    | Add new bike             |
| PATCH  | /api/bikes/:id    | Admin    | Edit bike                |
| DELETE | /api/bikes/:id    | Admin    | Delete bike              |

### Orders
| Method | Endpoint                  | Access   | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | /api/orders               | Customer | Place an order           |
| GET    | /api/orders/my            | Customer | Get my orders            |
| GET    | /api/orders               | Admin    | All orders               |
| PATCH  | /api/orders/:id/status    | Admin    | Update order status      |
| GET    | /api/orders/stats/summary | Admin    | Dashboard stats          |

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### Step 1 — MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/atlas and create a free account
2. Click **"Build a Database"** → choose **Free (M0)** tier → select a region close to India
3. Create a username and password (save these!)
4. Under **"Network Access"** → click **"Add IP Address"** → **"Allow Access From Anywhere"** (0.0.0.0/0)
5. Go to **"Database"** → click **"Connect"** → **"Connect your application"**
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password and add `/mdrbikes` before the `?`:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/mdrbikes?retryWrites=true&w=majority
   ```

---

### Step 2 — Deploy Backend on Railway

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial MDR Bikes commit"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/mdrbikes.git
   git push -u origin main
   ```

2. Go to https://railway.app → sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"** → select your repo
4. Railway will detect Node.js automatically
5. In the Railway project, click **"Variables"** tab and add:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://...  (your full Atlas URI from Step 1)
   JWT_SECRET=pick_any_long_random_string_here_min_32_chars
   FRONTEND_URL=https://your-site.vercel.app  (add this after Step 3)
   ```
6. Railway will auto-deploy. Copy the Railway URL (e.g. `https://mdrbikes-backend.up.railway.app`)

---

### Step 3 — Deploy Frontend on Vercel

1. Go to https://vercel.com → sign up with GitHub
2. Click **"New Project"** → import your GitHub repo
3. Set **Root Directory** to `/` (leave as default)
4. Click **Deploy**
5. Copy your Vercel URL (e.g. `https://mdrbikes.vercel.app`)
6. Go back to Railway → Variables → update `FRONTEND_URL` to your Vercel URL

---

### Step 4 — Connect Frontend to Backend

In **login.html**, **dashboard.html**, and **admin.html**, find this line near the top of the `<script>` tag:

```javascript
const API = 'https://your-backend.railway.app'; // 🔁 Replace with Railway URL
```

Replace it with your actual Railway URL, e.g.:
```javascript
const API = 'https://mdrbikes-backend.up.railway.app';
```

Commit and push — Vercel will auto-redeploy.

---

### Step 5 — Create Your First Admin Account

After deployment, open your browser and run this in the browser console (or use Postman):

```javascript
fetch('https://YOUR-RAILWAY-URL/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'MDR Admin',
    email: 'admin@mdrbikes.in',
    password: 'your_secure_password'
  })
}).then(r => r.json()).then(console.log)
```

Then in MongoDB Atlas → Browse Collections → Users → find the admin user → change `"role": "customer"` to `"role": "admin"`.

Now log in at `/login.html` with the admin email and you'll be redirected to the admin panel.

---

### Step 6 — Add Bikes (Optional Seed)

Log into the admin panel at `/admin.html` → **Manage Bikes** → click **Add Bike** to populate your inventory.

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm install
npm run dev       # Starts on http://localhost:5000

# Frontend — just open frontend/index.html in your browser
# Or use VS Code Live Server extension
```

---

## Features

- ✅ Customer registration & login (JWT auth)
- ✅ Admin login with role-based access control
- ✅ Customer dashboard with order history & live tracking
- ✅ Admin panel: stats, order management, bike inventory CRUD
- ✅ Order status pipeline: Pending → Confirmed → Processing → Ready → Delivered
- ✅ Full matching MDR Bikes design across all pages
- ✅ Mobile responsive

---

## Need Help?

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas
