# Quick Start Guide

Get your API Testing Platform running in 5 minutes!

## Prerequisites

- Node.js (v18+)
- MongoDB running locally OR MongoDB Atlas account

## Setup Steps

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 2. Configure Environment

Backend (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/api-tester
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

Frontend (`frontend/.env.local`) - already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start MongoDB

**Local MongoDB:**
- Windows: Start MongoDB service from Services app
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

**MongoDB Atlas:**
1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `backend/.env`

### 4. Start Servers

**Backend:**
```bash
cd backend
npm run dev
```
Expected: `✅ MongoDB connected` and `🚀 Server running on http://localhost:5000`

**Frontend (new terminal):**
```bash
cd frontend
npm run dev
```
Expected: `✓ Ready` on `http://localhost:3000`

### 5. Open Application

Visit: **http://localhost:3000**

## Quick Troubleshooting

**MongoDB connection error?**
- Ensure MongoDB service is running
- Check `MONGODB_URI` in `.env`

**Port 5000 in use?**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

**Frontend can't connect to backend?**
- Verify backend is running: visit `http://localhost:5000/health`
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

## Test It Out

Try this GET request:
- URL: `https://jsonplaceholder.typicode.com/posts`
- Click "Send"

You're all set! 🎉
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

## Step 5: Open Browser

Navigate to: **http://localhost:3000**

## Step 6: Test It Out

1. Click **"+ New Collection"**
2. Name it "Test Collection"
3. In the main area, enter this URL:
   ```
   https://jsonplaceholder.typicode.com/posts
   ```
4. Click **"Send"**
5. See the response! 🎉

## Common Issues

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in `backend/` folder
- Try: `npm install` again

### Frontend won't start
- Delete `.next` folder
- Try: `npm install` again
- Check if port 3000 is available

### Can't connect to backend
- Make sure backend is running on port 5000
- Visit https://api-testing-platform.onrender.com/health in browser (or http://localhost:5000/health for local development)
- Should see: `{"status": "API Testing Backend is running"}`

## Need Help?

Check the main README.md for detailed documentation!
