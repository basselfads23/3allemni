# v1.5 - Authentication & Dashboard Refactor

## Overview
Version 1.5 focuses on stabilizing the production authentication flow, standardizing the database schema, and introducing a dedicated tutor dashboard.

## Key Changes

### 1. Database & Authentication Stability
- **Schema Mapping:** Implemented explicit lowercase mappings (`@@map`) in `schema.prisma` to resolve PostgreSQL case-sensitivity issues on platforms like Neon.
- **NextAuth v5 (Auth.js) Refactor:**
  - Removed outdated custom sign-in configurations causing 404 errors.
  - Standardized the use of built-in Auth.js pages for better reliability.
  - Improved session handling by landing users directly on their relevant dashboards.
- **Production Debugging:** Implemented (and subsequently cleaned up) diagnostic routes and smoke tests to verify database connectivity in Vercel.

### 2. Navigation & UI Improvements
- **Header Reorganization:** Restructured the global header to group navigation links ("Find a Tutor", "Dashboard") on the left and authentication buttons ("Sign In", "Sign Out") on the right.
- **Global Styling:** Added new CSS classes (`.header-left`, `.header-auth`) for consistent layout management.

### 3. Tutor Dashboard Refactor
- **Dedicated Dashboard:** Created a new hub at `/tutor/dashboard` for logged-in tutors.
- **Profile Route:** Moved the registration and edit forms to `/tutor/profile` to separate management logic from the main dashboard.
- **Smart Redirection:** Implemented automatic redirects from `/tutor` to the dashboard.

## Project Tree (v1.5)

```text
src/
├── app/
│   ├── api/
│   │   └── auth/           # NextAuth handlers
│   ├── tutor/
│   │   ├── dashboard/      # NEW: Main tutor hub
│   │   ├── profile/        # NEW: Edit profile form
│   │   └── page.tsx        # Redirects to dashboard
│   ├── tutors/
│   │   └── [id]/           # Public tutor profile
│   ├── parent/             # Parent search page
│   ├── layout.tsx
│   └── page.tsx            # Role selection landing
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Updated navigation
│   │   └── Footer.tsx
│   └── tutor/
│       └── TutorForm.tsx   # Profile management
├── lib/
│   ├── auth.ts             # Auth.js configuration
│   └── prisma.ts           # Database client
└── services/
    └── tutorService.ts     # Data access logic
```

## Migration Notes
- Ensure `DATABASE_URL` is synchronized with the latest `schema.prisma` using `npx prisma db push`.
- Verify Google OAuth authorized redirect URIs match the production domain.
