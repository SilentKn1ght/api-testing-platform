# Quick Start Guide

Get your API Testing Platform running in 5 minutes!

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Start MongoDB

**Option A: Local MongoDB**
- Windows: Start MongoDB service from Services app
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Easier)**
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for free
- Create a cluster
- Get connection string
- Update `backend/.env` with your connection string

## Step 3: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

## Step 4: Start Frontend

Open a NEW terminal:

```bash
cd frontend
npm run dev
```

Expected output:
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
- Visit http://localhost:5000/health in browser
- Should see: `{"status": "API Testing Backend is running"}`

## Need Help?

Check the main README.md for detailed documentation!
