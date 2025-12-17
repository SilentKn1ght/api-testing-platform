---
name: TypeError - collections.map is not a function
about: Frontend runtime error when loading collections
title: '[BUG] TypeError: collections.map is not a function in CollectionSidebar'
labels: bug, frontend, high-priority
assignees: ''
---

## Bug Description
**Runtime Error:** `TypeError: collections.map is not a function`

The frontend throws an unhandled runtime error when attempting to render the CollectionSidebar component.

## Error Details
```
Unhandled Runtime Error
TypeError: collections.map is not a function

Source:
src\components\CollectionSidebar.tsx (137:22) @ map
```

## To Reproduce
Steps to reproduce the behavior:
1. Start the backend server (`cd backend && npm run dev`)
2. Start the frontend server (`cd frontend && npm run dev`)
3. Navigate to `http://localhost:3000`
4. The error appears immediately on page load

## Expected Behavior
The CollectionSidebar component should:
1. Fetch collections from the backend API (`GET /api/collections`)
2. Display them in a list format
3. Handle empty collections gracefully
4. Handle API errors with toast notifications

## Root Cause Analysis
The error occurs because the `collections` state variable is attempting to call `.map()` on a non-array value. Potential causes:
1. Backend API response format mismatch (not returning an array)
2. Failed API fetch resulting in undefined/null state
3. Error response being assigned to collections state
4. Initial state not being properly handled

## Environment
- **OS:** Windows
- **Browser:** Chrome/Edge (Simple Browser in VS Code)
- **Node Version:** 18.x+
- **Next.js Version:** 14.0.4
- **Backend:** Express + MongoDB/Mongoose

## Affected Code
**File:** `frontend/src/components/CollectionSidebar.tsx`
**Line:** 137:22

```tsx
collections.map((collection) => (
  <div key={collection._id} className="bg-gray-900 rounded-lg overflow-hidden">
    // ... collection rendering
  </div>
))
```

## Proposed Fix
1. Add type guard to ensure `collections` is always an array
2. Add defensive check before calling `.map()`
3. Improve error handling in `fetchCollections()` to ensure state remains array
4. Add backend response validation

## Priority
**High** - Blocks entire frontend UI from loading

## Related Files
- `frontend/src/components/CollectionSidebar.tsx`
- `backend/src/routes/collections.js`

---

**Reported:** December 16, 2025
**Next.js Version:** 14.0.4
