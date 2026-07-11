# OptiFitness 

A modern fitness tracking web app built with React + Vite (frontend) and Node.js + Express + MySQL (backend).

## Features
-  Water / Hydration Tracker
-  Exercise Logger
-  Meal Logger
-  Daily Challenges & Points
-  Badges & Achievements
-  Global & Squad Leaderboard
-  Community Feed
-  Profile with Biometric Info (BMI, Weight, Height, Age)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) running locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/optifitness.git
cd optifitness
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in your MySQL credentials and a secure `JWT_SECRET`.

### 4. Initialize the database
```bash
node server/init-db.js
```
This will automatically create the `optifitness` database and apply the schema.

### 5. Start the backend
```bash
node server/index.js
```
Backend runs on `http://localhost:5005`

### 6. Start the frontend (dev)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## Project Structure
```
optifitness/
├── src/               # React frontend
│   ├── components/    # Reusable UI components
│   ├── pages/         # App pages (Dashboard, Water, Meals, etc.)
│   ├── context/       # Auth & Badge Toast context
│   └── utils/         # API helpers & App Inventor bridge
├── server/
│   ├── index.js       # Express API server
│   ├── init-db.js     # Database initializer
│   └── schema.sql     # Database schema & seed data
├── public/            # Static assets
├── .env.example       # Environment variable template
└── package.json
```

---

## Tech Stack
- **Frontend:** React 19, Vite, Framer Motion, Vanilla CSS
- **Backend:** Node.js, Express, MySQL2, JWT, bcryptjs
- **Database:** MySQL

---

## Environment Variables
See `.env.example` for all required variables. Never commit your real `.env` file.
