# API Testing & Documentation Platform

A modern, Postman-like tool for building, testing, and documenting REST APIs. Built with Next.js, TypeScript, Node.js, Express, and MongoDB.

![API Testing Platform](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green)

## 🚀 Features

- **API Request Builder**: Create and execute HTTP requests with support for GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS methods
- **Collections**: Organize requests into collections for better project management
- **Multiple Auth Types**: Support for Bearer Token, Basic Auth, and API Key authentication
- **Custom Headers**: Add custom headers to your requests
- **Request Body**: Send JSON, XML, or plain text in request bodies
- **Response Viewer**: Beautiful syntax-highlighted response viewer with multiple tabs (Body, Headers, Raw)
- **Real-time Execution**: See response status, time, and data instantly
- **Persistent Storage**: Save collections and requests to MongoDB for later use
- **Modern UI**: Clean, dark-themed interface built with Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **npm** or **yarn** package manager

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
cd api-testing-platform
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
# On Windows: Start MongoDB service from Services
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Recommended for beginners)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Whitelist your IP address

### 3. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Copy the example below or edit the existing .env file
```

**Backend `.env` Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/api-tester
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/api-tester

PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_this_in_production
```

```bash
# Start the backend server
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

### 4. Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# The .env.local file is already created with the correct configuration
# Verify it contains: NEXT_PUBLIC_API_URL=http://localhost:5000

# Start the frontend development server
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage Guide

### Creating Your First Collection

1. Click the **"+ New Collection"** button in the sidebar
2. Enter a name for your collection (e.g., "My API Tests")
3. Click **"Create"**

### Making Your First Request

1. Click on a collection to expand it
2. In the main area, select the HTTP method (GET, POST, etc.)
3. Enter a URL (try: `https://jsonplaceholder.typicode.com/posts`)
4. Click **"Send"**
5. View the response in the Response Viewer below

### Adding Headers

1. Click on the **"Headers"** tab
2. Enter header in format: `Content-Type: application/json`
3. Click **"Add Header"**

### Adding Authentication

1. Click on the **"Auth"** tab
2. Select auth type from dropdown:
   - **None**: No authentication
   - **Bearer**: Token-based authentication
   - **Basic**: Username and password
   - **API Key**: API key authentication
3. Enter your credentials

### Sending Request Body

1. Select POST, PUT, or PATCH method
2. Click on the **"Body"** tab
3. Enter your JSON data:
```json
{
  "title": "Test Post",
  "body": "This is a test",
  "userId": 1
}
```
4. Click **"Send"**

## 🏗️ Project Structure

```
api-testing-platform/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Collection.js
│   │   │   ├── Request.js
│   │   │   └── TestResult.js
│   │   ├── routes/          # API endpoints
│   │   │   ├── collections.js
│   │   │   ├── requests.js
│   │   │   └── execute.js
│   │   └── server.js        # Express server
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   └── components/      # React components
│   │       ├── CollectionSidebar.tsx
│   │       ├── RequestBuilder.tsx
│   │       └── ResponseViewer.tsx
│   ├── .env.local           # Frontend environment variables
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create new collection
- `GET /api/collections/:id` - Get single collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `GET /api/requests/collection/:collectionId` - Get requests by collection

### Execute
- `POST /api/execute` - Execute an HTTP request

## 🧪 Quick Test Examples

Try these public APIs to get started:
- **GET**: `https://jsonplaceholder.typicode.com/posts`
- **POST**: `https://jsonplaceholder.typicode.com/posts` with body: `{"title": "Test", "body": "Content", "userId": 1}`

## 🐛 Troubleshooting

### Backend Issues

**Problem**: MongoDB connection error
```
Solution: 
1. Ensure MongoDB is running (check services)
2. Verify MONGODB_URI in .env file
3. For Atlas: Check IP whitelist and connection string
```

**Problem**: Port 5000 already in use
```
Solution: Change PORT in backend/.env to another port (e.g., 5001)
```

### Frontend Issues

**Problem**: Cannot connect to backend
```
Solution: 
1. Ensure backend is running (npm run dev in backend folder)
2. Check NEXT_PUBLIC_API_URL in frontend/.env.local
3. Verify backend URL in browser: http://localhost:5000/health
```

**Problem**: Styling not working
```
Solution: 
1. Delete .next folder and node_modules
2. Run: npm install
3. Run: npm run dev
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Backend is deployed at: https://api-testing-platform.onrender.com
Ensure `NEXT_PUBLIC_API_URL` in frontend/.env.local points to this URL.

## 📝 License

MIT License - see LICENSE file for details.

---

**Built with Next.js, TypeScript, Node.js, Express, and MongoDB**
