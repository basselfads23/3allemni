# 3allemni v1.4 Documentation

## 1. Authentication System (Google OAuth)

Implement secure authentication using NextAuth.js with Google OAuth to allow tutors to manage their profiles.

- Add NextAuth.js v5 with Google OAuth provider
- Create User model with role-based architecture (TUTOR, PARENT, ADMIN)
- Implement session management with Prisma adapter
- Protect tutor dashboard with authentication middleware

## 2. User Model and Data Separation

Separate authentication data (User) from profile data (Tutor) for better data architecture and future scalability.

- Create User model for authentication (id, email, role, timestamps)
- Add userId foreign key to Tutor model with one-to-one relationship
- Remove email field from Tutor model (use User.email instead)
- Implement cascade delete (deleting User deletes associated Tutor)

## 3. Tutor Dashboard (Protected)

Create a protected dashboard where tutors can create and edit their profiles after authentication.

- Move tutor registration form to `/tutor/dashboard` (protected route)
- Reuse existing TutorForm component with create/edit modes
- Display user email and logout button in dashboard header
- Support both profile creation (new tutors) and editing (existing tutors)

## 4. Route Changes

Rename and reorganize routes for better clarity and implement protected routes.

- Rename `/student` → `/parent` (all references and folder structure)
- Remove public `/tutor` route, replace with protected `/tutor/dashboard`
- Add NextAuth auto-generated routes: `/auth/signin`, `/auth/signout`, `/auth/error`
- Update navigation in Header component and landing page

## 5. UI Polish (Minimal)

Add focused UI improvements for better user feedback during authentication and form operations.

- Add loading states for authentication and form submissions
- Implement success/error notifications (simple alerts or inline messages)
- Add file upload feedback showing selected filename
- Update LoadingSpinner component with size variants (sm, md, lg)

## Updated Project Structure

```text
3allemni/
├── docs/                    # Documentation
│   ├── v1.3/               # v1.3 documentation
│   └── v1.4/               # v1.4 documentation
├── prisma/                 # Database configuration
│   ├── schema.prisma      # Database schema (User, Tutor, Account, Session models)
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   │   ├── auth/[...nextauth]/ # NextAuth configuration
│   │   │   ├── submit/
│   │   │   ├── tutor/[id]/
│   │   │   └── tutors/
│   │   ├── parent/      # Parent page (renamed from student)
│   │   ├── tutor/
│   │   │   └── dashboard/ # Protected tutor dashboard
│   │   ├── tutors/[id]  # Individual tutor profile pages
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Landing page
│   ├── components/      # React components
│   │   ├── layout/      # Header, Footer
│   │   ├── tutor/       # TutorCard, TutorFilters, TutorForm, DashboardHeader
│   │   └── shared/      # Button, ErrorMessage, SuccessMessage, LoadingSpinner
│   ├── lib/
│   │   ├── constants.ts # Centralized constants
│   │   ├── logger.ts    # Centralized logging
│   │   ├── prisma.ts    # Prisma client singleton
│   │   ├── utils.ts     # Utility functions
│   │   └── validations.ts # Zod validation schemas
│   ├── services/        # Business logic layer
│   │   ├── tutorService.ts   # Tutor CRUD operations
│   │   └── uploadService.ts  # File upload handling
│   └── middleware.ts    # NextAuth middleware for protected routes
└── package.json         # Dependencies and scripts
```
