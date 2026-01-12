# API Testing Platform

A modern, Postman-like tool for building and testing REST APIs. Built with Next.js, TypeScript, Node.js, Express, and MongoDB.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green)

## ✨ Features

- **HTTP Request Builder** - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Collections** - Organize requests into projects
- **Authentication** - Bearer Token, Basic Auth, API Key
- **Custom Headers & Body** - Full request customization
- **Response Viewer** - Multi-tab view (Body, Headers, Raw)
- **Real-time Execution** - Instant response with timing
- **Persistent Storage** - Save to MongoDB
- **Modern UI** - Dark theme with Tailwind CSS

## 📋 Prerequisites

- **Node.js** v18+ [Download](https://nodejs.org/)
- **MongoDB** v6+ - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free) or [Community](https://www.mongodb.com/try/download/community)
- **pnpm** - `npm install -g pnpm`

## ⚡ Quick Start

### 1. Install Dependencies
```bash
pnpm install  # Installs backend, frontend, and root packages
```

### 2. Setup MongoDB

**Cloud (Recommended):**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Create Free Account
2. Create M0 cluster → Get connection string
3. Add to `backend/.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/api-testing`

**Local:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 3. Run Servers

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run dev
```
✅ Expected: `✅ MongoDB connected`, `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```
✅ Expected: `✓ Ready at http://localhost:3000`

### 4. Test It
1. Open http://localhost:3000
2. Click "New Collection"
3. Try: `https://jsonplaceholder.typicode.com/posts`
4. Click "Send" 🎉

## 🏗️ Architecture

```
backend/  → Node.js + Express + MongoDB
├── models/        (Collection, Request, TestResult)
├── routes/        (CRUD + Execute endpoints)
└── server.js

frontend/ → Next.js 14 + TypeScript + Tailwind
├── components/    (CollectionSidebar, RequestBuilder, ResponseViewer)
└── app/          (layout, page)
```

## 📚 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST/PUT/DELETE | `/api/collections` | Manage collections |
| GET/POST/PUT/DELETE | `/api/requests` | Manage requests |
| POST | `/api/execute` | Execute HTTP request |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check `backend/.env`, ensure MongoDB is running |
| Backend won't start | Run `pnpm install` in backend folder |
| Frontend won't start | Delete `.next`, run `pnpm install` |
| Can't connect to backend | Verify backend is running on port 5000 |
| Port in use | Change `PORT` in `backend/.env` |

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[EXAMPLES.md](EXAMPLES.md)** - Sample API requests to test
- **[docs/RESPONSE_VIEWER_OPTIMIZATIONS.md](docs/RESPONSE_VIEWER_OPTIMIZATIONS.md)** - Performance details

## 🚀 Next Steps

- Add request history tracking
- Environment variables support
- Test scripts and assertions
- OpenAPI/Swagger import

## 📝 License

MIT - Free to use for learning and portfolio projects

---

**Built with Next.js • TypeScript • Node.js • MongoDB**
