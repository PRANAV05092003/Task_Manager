# Ithara.ai Team Task Manager

A simple, clean, and professional team task manager built with the MERN stack. Frontend and backend are separate apps designed for Railway deployment.

## Project Structure

```
ROOT/
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
└── README.md
```

No root `package.json`, no monorepo, no workspaces.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router DOM  
**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs

## Features

- User signup, login, logout (JWT)
- Create, edit, delete tasks
- Update task status (pending, in-progress, completed)
- Dashboard with task stats
- Responsive UI

## Quick Start Checklist

1. Clone the repo and open two terminals
2. Set `MONGO_URI` in `server/.env` (MongoDB Atlas connection string)
3. Run backend: `cd server && npm install && npm run dev`
4. Run frontend: `cd client && npm install && npm run dev`
5. Open `http://localhost:5173` — sign up and create tasks

For Railway: deploy **server** first, copy its URL, set `VITE_API_URL` on **client**, then set `CLIENT_URL` on **server**.

## Local Development

### Prerequisites

- Node.js 18+ (Node 20 recommended for Railway)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

### Frontend Setup

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Railway Deployment

Deploy **two separate services** from the same GitHub repository.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Ithara.ai Team Task Manager"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Create Railway Project

1. Go to [Railway](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Select your repository

### 3. Server Service

Create a service for the backend:

| Setting | Value |
|---------|-------|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

**Environment Variables:**

| Variable | Value |
|----------|-------|
| `PORT` | (Railway sets automatically) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret string |
| `CLIENT_URL` | Your frontend Railway URL (set after client deploys) |

After deploy, copy the server public URL (e.g. `https://your-server.up.railway.app`).

Health check: `GET /health` → `OK`

### 4. Client Service

Create a second service for the frontend:

| Setting | Value |
|---------|-------|
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

**Environment Variables:**

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your server Railway URL (e.g. `https://your-server.up.railway.app`) |

> **Important:** `VITE_API_URL` is baked in at build time. Redeploy the client after changing it.

### 5. Update CORS

Go back to the **server** service and set:

```
CLIENT_URL=https://your-client.up.railway.app
```

Redeploy the server so CORS allows your frontend origin.

### 6. Verify Deployment

- Server: visit `https://your-server.up.railway.app/health` → `OK`
- Server: visit `https://your-server.up.railway.app/` → `Backend running`
- Client: visit `https://your-client.up.railway.app/health` → `OK`
- Client: open app URL, sign up, create tasks

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Tasks (all protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List user tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Health Checks

Both services expose `/health` for Railway:

- **Server:** Express responds with `OK` immediately
- **Client:** `server.js` serves static files and responds with `OK` on `/health`

The client uses Express to serve the `dist` folder (not `vite preview`) for reliable Railway health checks.

## License

MIT
