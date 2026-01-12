# Setup & Troubleshooting Guide

## Installation & Setup

### Prerequisites
- Node.js v18+ [Download](https://nodejs.org/)
- MongoDB v6+ ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or [Community](https://www.mongodb.com/try/download/community))
- pnpm: `npm install -g pnpm`

### Step 1: Install Dependencies
```bash
cd api-testing-platform
pnpm install
```

### Step 2: Configure MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Create a Deployment" → Select free M0 cluster
3. Go to "Database" → "Connect" → "Drivers"
4. Copy connection string: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/api-testing`
5. Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/api-testing
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
```

#### Option B: Local MongoDB

**Windows:**
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install MSI (select "Install MongoDB as Windows Service")
3. Start service: `net start MongoDB`
4. Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/api-testing
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### Option C: Docker

```bash
docker run -d --name mongodb-api-testing -p 27017:27017 mongo:7.0
```

Then use: `MONGODB_URI=mongodb://localhost:27017/api-testing`

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run dev
```
Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```
Expected output:
```
✓ Ready at http://localhost:3000
```

### Step 4: Verify Setup

1. Open http://localhost:3000 in browser
2. Backend health check: http://localhost:5000/health
3. Should see: `{"status": "API Testing Backend is running"}`

---

## Troubleshooting

### MongoDB Connection Error

**Error:**
```
❌ MongoDB error: MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions:**
1. **Check if MongoDB is running:**
   ```bash
   # Windows
   Get-Service MongoDB
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mongod
   ```

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **For MongoDB Atlas:**
   - Verify connection string in `backend/.env`
   - Check IP whitelist in Atlas dashboard
   - Verify username/password credentials

### Backend Won't Start

**Error:** `TypeError: Cannot read properties of undefined`

**Solutions:**
1. Reinstall dependencies:
   ```bash
   cd backend
   rm -r node_modules pnpm-lock.yaml
   pnpm install
   ```

2. Check `.env` file exists:
   ```bash
   cd backend
   ls -la .env  # Should exist and have MONGODB_URI, PORT, NODE_ENV, JWT_SECRET
   ```

3. Verify Node.js version:
   ```bash
   node --version  # Should be v18+
   ```

### Frontend Won't Start

**Error:** `Next.js build error or localhost:3000 not accessible`

**Solutions:**
1. Clear Next.js cache:
   ```bash
   cd frontend
   rm -r .next node_modules
   pnpm install
   pnpm run dev
   ```

2. Check port 3000 is available:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

3. Verify `.env.local` exists:
   ```bash
   cd frontend
   cat .env.local  # Should contain: NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

### Can't Connect Frontend to Backend

**Error:** `Failed to fetch from http://localhost:5000`

**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:5000/health
   # Or open in browser: http://localhost:5000/health
   ```

2. Check `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000  # Should match backend URL
   ```

3. Verify CORS is enabled (check `backend/src/server.js`)

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001  # Or any free port
   ```

2. Kill process using port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### TypeError: collections.map is not a function

**Cause:** Backend returned error object instead of array

**Solution:**
- Ensure MongoDB is running
- Check MongoDB connection string in `backend/.env`
- Restart backend: `pnpm run dev`

---

## Performance Optimization

Response viewer is optimized for large responses:
- Responses >500KB are automatically truncated
- Memoized calculations prevent unnecessary re-renders
- Only active tabs are rendered in DOM
- See [docs/RESPONSE_VIEWER_OPTIMIZATIONS.md](docs/RESPONSE_VIEWER_OPTIMIZATIONS.md) for details

---

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/api-testing
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Next Steps

1. Read [README.md](README.md) for feature overview
2. Check [EXAMPLES.md](EXAMPLES.md) for test requests
3. See [QUICKSTART.md](QUICKSTART.md) for quick start
4. Explore [docs/RESPONSE_VIEWER_OPTIMIZATIONS.md](docs/RESPONSE_VIEWER_OPTIMIZATIONS.md) for performance details
