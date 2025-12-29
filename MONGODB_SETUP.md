# MongoDB Setup Guide

Since you don't have elevated admin rights, here are two options:

## Option 1: MongoDB Atlas (Recommended - Cloud)

MongoDB Atlas is the easiest - it's cloud-hosted and free:

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Create Free Account**: Click "Try Free"
3. **Create a Cluster**: 
   - Choose free tier
   - Select your region
   - Click "Create Deployment"
4. **Get Connection String**:
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string
   - Replace `<password>` with your password

5. **Update `.env`** in `backend/`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/api-testing?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   ```

6. **Test Connection**:
   ```bash
   cd backend
   npm run dev
   ```

## Option 2: Docker (If Docker Desktop is running)

```bash
docker run -d --name mongodb-api-testing -p 27017:27017 mongo:7.0
```

Then use:
```
MONGODB_URI=mongodb://localhost:27017/api-testing
```

## Option 3: Portable MongoDB (Manual)

1. Download: https://www.mongodb.com/try/download/community
2. Extract to a folder
3. Create a data folder: `mkdir C:\mongodb-data`
4. Run:
   ```bash
   C:\path\to\mongodb\bin\mongod.exe --dbpath C:\mongodb-data
   ```

## Quick Test

After setting up, test with:

```bash
# From backend folder
npm run dev

# Should show: "Connected to MongoDB"
```

---

For this project, **Option 1 (MongoDB Atlas)** is recommended - it's free, requires no installation, and works great for development!
