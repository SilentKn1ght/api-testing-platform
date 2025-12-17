# Troubleshooting Guide

## Issue: TypeError - collections.map is not a function

### Problem Description
The frontend displays an unhandled runtime error when loading:
```
TypeError: collections.map is not a function
Location: src\components\CollectionSidebar.tsx (137:22)
```

### Root Cause
The backend API `/api/collections` is returning an error object instead of an array because:
1. **MongoDB is not running** - The backend cannot connect to MongoDB at `mongodb://localhost:27017`
2. When the database connection fails, the API route catches the error and returns `{ error: "..." }` instead of an array `[]`
3. The frontend React component tries to call `.map()` on this error object, causing the TypeError

### Backend Error Log
```
❌ MongoDB error: MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
Error fetching collections: MongooseError: Operation `collections.find()` buffering timed out after 10000ms
```

---

## Solutions

### Solution 1: Install and Start MongoDB Locally (Recommended for Development)

#### Option A: MongoDB Community Server

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Windows MSI installer
   - Version: 7.0+ recommended

2. **Install MongoDB**
   ```powershell
   # Run the downloaded MSI installer
   # Choose "Complete" installation
   # Install MongoDB as a Windows Service (default)
   ```

3. **Verify MongoDB is Running**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # If not running, start it
   Start-Service -Name MongoDB
   
   # Verify connection
   mongosh --eval "db.version()"
   ```

4. **Restart Backend Server**
   ```powershell
   cd backend
   npm run dev
   ```

#### Option B: MongoDB via Docker (Faster Setup)

1. **Start MongoDB Container**
   ```powershell
   docker run -d `
     --name mongodb-api-testing `
     -p 27017:27017 `
     -e MONGO_INITDB_DATABASE=api-tester `
     mongo:7.0
   ```

2. **Verify Container is Running**
   ```powershell
   docker ps | Select-String mongodb
   ```

3. **Restart Backend Server**
   ```powershell
   cd backend
   npm run dev
   ```

### Solution 2: Use MongoDB Atlas (Cloud - No Local Install Required)

1. **Create Free MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free M0 cluster (512MB)

2. **Get Connection String**
   - In Atlas Dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/api-tester
     ```

3. **Update Backend .env File**
   ```bash
   # backend/.env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/api-tester
   PORT=5000
   NODE_ENV=development
   ```

4. **Whitelist Your IP Address**
   - In Atlas Dashboard → Network Access
   - Add your current IP or use `0.0.0.0/0` (allow from anywhere - dev only!)

5. **Restart Backend Server**
   ```powershell
   cd backend
   npm run dev
   ```

### Solution 3: Run Without Database (Testing Mode)

If you want to test the frontend without setting up MongoDB:

1. **Create Mock Data Route** (temporary workaround)
   
   Edit `backend/src/server.js`:
   ```javascript
   // Add this BEFORE the database-dependent routes
   app.get('/api/collections', (req, res) => {
     res.json([
       {
         _id: '1',
         name: 'Sample Collection',
         description: 'Test collection',
         requests: [],
         createdAt: new Date().toISOString()
       }
     ]);
   });
   ```

2. **Restart Backend**
   ```powershell
   cd backend
   npm run dev
   ```

---

## Verification Steps

### 1. Check Backend Health
```powershell
Invoke-WebRequest http://localhost:5000/health -UseBasicParsing
```
Expected: `200 OK` with JSON response

### 2. Test Collections Endpoint
```powershell
Invoke-RestMethod http://localhost:5000/api/collections
```
Expected: Array (even if empty `[]`)
NOT: `{ error: "..." }`

### 3. Check Frontend
- Open http://localhost:3000
- Should load without errors
- Collections sidebar should be visible (even if empty)

---

## Fix Applied to Frontend

The following defensive programming fixes were applied to `CollectionSidebar.tsx`:

1. **Array Type Guard in fetchCollections**
   ```typescript
   if (Array.isArray(data)) {
     setCollections(data);
   } else {
     setCollections([]); // Fallback to empty array
     toast.error(`Failed to fetch collections: ${data.error}`);
   }
   ```

2. **Error State Handling**
   ```typescript
   catch (error) {
     setCollections([]); // Ensure collections remains an array
     toast.error('Failed to fetch collections');
   }
   ```

3. **Render Guard**
   ```typescript
   {!Array.isArray(collections) || collections.length === 0 ? (
     <div>No collections yet</div>
   ) : (
     collections.map(...)
   )}
   ```

These fixes prevent the TypeError even when the backend returns unexpected data.

---

## Quick Start Commands

### Start Everything (Once MongoDB is Running)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Or use the provided script:**
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

---

## Common Issues

### Issue: "ECONNREFUSED 127.0.0.1:27017"
- **Solution:** MongoDB is not running. Start MongoDB service or use Docker.

### Issue: "Authentication failed"
- **Solution:** Check MongoDB Atlas credentials in .env file.

### Issue: "Network timeout"
- **Solution:** Check MongoDB Atlas IP whitelist settings.

### Issue: "Port 5000 already in use"
- **Solution:** Kill existing process or change PORT in backend/.env

### Issue: Frontend shows blank page
- **Solution:** Check browser console (F12) for errors. Restart frontend dev server.

---

## Related Files
- Frontend: `frontend/src/components/CollectionSidebar.tsx`
- Backend: `backend/src/routes/collections.js`
- Backend: `backend/src/server.js`
- Config: `backend/.env`
- Issue: `.github/ISSUE_TEMPLATE/issue-collections-map-error.md`

---

**Last Updated:** December 16, 2025
**Status:** ✅ Frontend fix applied | ⚠️ MongoDB setup required
