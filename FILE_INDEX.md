# API Testing Platform - File Index

Quick reference to all project files and their purposes.

## 📂 Root Directory

| File | Purpose |
|------|---------|
| `README.md` | Main documentation - start here! |
| `QUICKSTART.md` | 5-minute setup guide |
| `EXAMPLES.md` | Sample API requests to test |
| `FEATURES.md` | Complete feature list and portfolio tips |
| `PROJECT_SUMMARY.md` | Build summary and next steps |
| `FILE_INDEX.md` | This file - quick reference |
| `setup.ps1` | Automated setup script (Windows) |
| `start.ps1` | Easy server start script (Windows) |
| `.gitignore` | Git ignore rules |

## 📂 Backend Files

### Configuration
| File | Purpose |
|------|---------|
| `backend/package.json` | Node.js dependencies and scripts |
| `backend/.env` | Environment variables (MongoDB, port, etc.) |
| `backend/.gitignore` | Backend-specific git ignore |

### Source Code
| File | Purpose |
|------|---------|
| `backend/src/server.js` | Express server entry point |
| `backend/src/models/Collection.js` | Collection database schema |
| `backend/src/models/Request.js` | Request database schema |
| `backend/src/models/TestResult.js` | Test result database schema |
| `backend/src/routes/collections.js` | Collection CRUD endpoints |
| `backend/src/routes/requests.js` | Request CRUD endpoints |
| `backend/src/routes/execute.js` | Request execution endpoint |

## 📂 Frontend Files

### Configuration
| File | Purpose |
|------|---------|
| `frontend/package.json` | Frontend dependencies and scripts |
| `frontend/.env.local` | Frontend environment variables |
| `frontend/.gitignore` | Frontend-specific git ignore |
| `frontend/next.config.js` | Next.js configuration |
| `frontend/tailwind.config.js` | Tailwind CSS configuration |
| `frontend/postcss.config.js` | PostCSS configuration |
| `frontend/tsconfig.json` | TypeScript configuration |

### Source Code
| File | Purpose |
|------|---------|
| `frontend/src/app/layout.tsx` | Root layout with toast provider |
| `frontend/src/app/page.tsx` | Main application page |
| `frontend/src/app/globals.css` | Global styles and custom scrollbar |
| `frontend/src/components/CollectionSidebar.tsx` | Collections management UI |
| `frontend/src/components/RequestBuilder.tsx` | HTTP request builder UI |
| `frontend/src/components/ResponseViewer.tsx` | Response display UI |

## 🎯 Where to Start

### First Time Setup
1. Read `README.md` - comprehensive guide
2. Follow `QUICKSTART.md` - get running fast
3. Try examples from `EXAMPLES.md`

### Development
1. Edit backend: `backend/src/` files
2. Edit frontend: `frontend/src/` files
3. Update environment: `.env` files

### Configuration
1. Backend settings: `backend/.env`
2. Frontend settings: `frontend/.env.local`
3. Dependencies: `package.json` files

## 📚 Documentation Priority

**Essential Reading:**
1. `README.md` - Main documentation
2. `QUICKSTART.md` - Setup guide

**Additional Resources:**
3. `EXAMPLES.md` - Test examples
4. `FEATURES.md` - Feature details
5. `PROJECT_SUMMARY.md` - Overview

## 🔍 Find Files By Function

### Want to modify the UI?
- Collection sidebar: `frontend/src/components/CollectionSidebar.tsx`
- Request builder: `frontend/src/components/RequestBuilder.tsx`
- Response viewer: `frontend/src/components/ResponseViewer.tsx`
- Styles: `frontend/src/app/globals.css`

### Want to change API endpoints?
- Collections API: `backend/src/routes/collections.js`
- Requests API: `backend/src/routes/requests.js`
- Execute API: `backend/src/routes/execute.js`

### Want to modify database schema?
- Collections: `backend/src/models/Collection.js`
- Requests: `backend/src/models/Request.js`
- Test results: `backend/src/models/TestResult.js`

### Want to change configuration?
- Backend port/MongoDB: `backend/.env`
- Frontend API URL: `frontend/.env.local`
- Tailwind colors: `frontend/tailwind.config.js`

## 💻 Quick File Access

### Most Frequently Edited Files:
1. `frontend/src/components/RequestBuilder.tsx` - Add new features to request builder
2. `frontend/src/components/ResponseViewer.tsx` - Modify response display
3. `backend/src/routes/execute.js` - Change request execution logic
4. `frontend/src/app/globals.css` - Update styles

### Configuration Files:
1. `backend/.env` - Backend settings
2. `frontend/.env.local` - Frontend settings

### Entry Points:
1. Backend: `backend/src/server.js`
2. Frontend: `frontend/src/app/page.tsx`

## 🎨 Customization Guide

### Change Colors
Edit: `frontend/tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### Change Port
Edit: `backend/.env`
```
PORT=5001
```

### Add New Route
1. Create file in `backend/src/routes/`
2. Import in `backend/src/server.js`
3. Add route: `app.use('/api/your-route', require('./routes/your-route'))`

### Add New Component
1. Create file in `frontend/src/components/`
2. Import in page or other component
3. Use: `<YourComponent />`

## 📊 File Statistics

- **Total Files**: 25+
- **Backend Files**: 8
- **Frontend Files**: 8
- **Documentation Files**: 6
- **Configuration Files**: 8
- **Lines of Code**: ~1,500+

## ✅ Checklist

**Before First Run:**
- [ ] Read README.md
- [ ] Install Node.js
- [ ] Install/configure MongoDB
- [ ] Run `npm install` in backend
- [ ] Run `npm install` in frontend
- [ ] Update `.env` files

**Development:**
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Can create collections
- [ ] Can send requests

**Portfolio:**
- [ ] Project on GitHub
- [ ] README updated with screenshots
- [ ] Live demo deployed (optional)
- [ ] Added to resume

---

Need help? Check README.md for detailed documentation!
