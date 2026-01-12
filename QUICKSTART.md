# Quick Start Guide

Get the platform running in 5 minutes!

## Step 1: Clone & Install

```bash
cd api-testing-platform
pnpm install
```

## Step 2: Configure MongoDB

**Option A: Cloud (Easiest)**
- Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create M0 cluster, get connection string
- Add to `backend/.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/api-testing`

**Option B: Local**
- Windows: `net start MongoDB`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`
- Then `backend/.env`: `MONGODB_URI=mongodb://localhost:27017/api-testing`

## Step 3: Start Services

**Terminal 1:**
```bash
cd backend && pnpm run dev
```
Expected: `✅ MongoDB connected`, `🚀 Server on http://localhost:5000`

**Terminal 2:**
```bash
cd frontend && pnpm run dev
```
Expected: `✓ Ready at http://localhost:3000`

## Step 4: Test

1. Open http://localhost:3000
2. Click "New Collection"
3. Try this request:
   - URL: `https://jsonplaceholder.typicode.com/posts`
   - Click "Send"
4. See response in right panel 🎉

## Common Issues

| Problem | Fix |
|---------|-----|
| MongoDB connection error | Ensure MongoDB is running, check `backend/.env` |
| Backend won't start | Run `pnpm install` in backend folder |
| Frontend won't start | Delete `.next`, run `pnpm install` |
| Port in use | Change `PORT` in `backend/.env` |

## Next Steps

- See [README.md](README.md) for full documentation
- See [EXAMPLES.md](EXAMPLES.md) for API examples
