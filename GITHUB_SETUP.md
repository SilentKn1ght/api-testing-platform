# GitHub Setup Guide

Follow these steps to create and push your API Testing Platform to GitHub.

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `api-testing-platform`
3. **Description**: `A Postman-like tool for testing and documenting REST APIs`
4. **Visibility**: Public (for portfolio)
5. **Do NOT initialize with README** (we already have one)
6. Click **"Create repository"**

You'll see a screen with commands to push your code.

## Step 2: Add and Commit Files

Copy and paste these commands into PowerShell:

```powershell
cd C:\Users\Naveen\api-testing-platform

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: API Testing Platform

- Backend: Express server with MongoDB integration
- Frontend: Next.js with TypeScript and Tailwind CSS
- Features: Collections, requests, response viewer, auth support
- Full CRUD operations for managing API requests"
```

## Step 3: Add Remote and Push

After creating the repository on GitHub, you'll see instructions like:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/api-testing-platform.git
git branch -m main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/api-testing-platform`
2. Verify all files are there
3. README.md should be displayed

## Commits Made

This repository tracks the following commits:

### Commit 1: Initial Project Setup
- Project structure and directories
- Backend configuration
- Frontend configuration
- Documentation files

### Commit 2: Backend Implementation
- Express server
- MongoDB models
- API routes
- Request execution logic

### Commit 3: Frontend Development
- Next.js app setup
- React components
- UI/UX implementation
- Response viewer

## What's Included in This Push

✅ Complete backend with all endpoints
✅ Full frontend application
✅ MongoDB models and schemas
✅ Comprehensive documentation
✅ Setup and start scripts
✅ Environment configuration examples

## Portfolio-Ready Content

This push includes everything you need for a portfolio:

1. **README.md** - Professional documentation
2. **QUICKSTART.md** - Easy setup guide
3. **EXAMPLES.md** - API testing examples
4. **FEATURES.md** - Feature documentation
5. **Clean code** - Well-organized structure
6. **Best practices** - TypeScript, validation, error handling

## Next Steps (Optional)

After pushing:

1. **Add GitHub badges** to README
2. **Create releases** for versions
3. **Add topics** to repository (api, testing, postman, typescript)
4. **Enable GitHub Pages** for documentation
5. **Create issues** for future features

## Troubleshooting

### Command not found: git
- Install Git from: https://git-scm.com/

### Authentication failed
- Use GitHub Personal Access Token instead of password
- Go to: Settings → Developer settings → Personal access tokens
- Create token with `repo` scope
- Use token as password when pushing

### Remote already exists
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/api-testing-platform.git
```

---

**You're all set!** Your API Testing Platform is now on GitHub and ready for employers to see! 🚀
