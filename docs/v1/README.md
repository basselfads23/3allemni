# 3allemni - Version 1.0 Documentation

## Overview

3allemni is a tutor marketplace platform built with modern web technologies. The application connects tutors with students by providing a simple interface for tutors to register and for students to browse available tutors.

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL (Neon)** - Cloud-native serverless Postgres

### Deployment

- **Vercel** - Hosting and deployment platform
- **Node.js Runtime** - Server runtime for API routes

## Project Structure

```text
3allemni/
├── docs/                    # Documentation
│   └── v1/                 # Version 1 documentation
├── prisma/                 # Database configuration
│   ├── schema.prisma      # Database schema definition
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   │   ├── submit/  # Tutor registration endpoint
│   │   │   └── tutors/  # Fetch tutors endpoint
│   │   ├── student/     # Student page
│   │   ├── tutor/       # Tutor registration page
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Landing page
│   └── lib/
│       └── prisma.ts    # Prisma client singleton
└── package.json         # Dependencies and scripts
```

## Features

### 1. Landing Page

- Simple "Coming Soon" page
- Entry point for the application
- Route: `/`

### 2. Tutor Registration

- Form-based registration interface
- Fields: Name and Subject
- Real-time form validation
- Success/error feedback
- Route: `/tutor`

### 3. Student Dashboard

- Browse all registered tutors
- Clean card-based UI
- Displays tutor name and subject
- Auto-refreshes data from database
- Route: `/student`

## Database Schema

### Tutor Model

```prisma
model Tutor {
  id      Int    @id @default(autoincrement())
  name    String
  subject String
}
```

**Fields:**

- `id` - Auto-incrementing primary key
- `name` - Tutor's full name
- `subject` - Subject the tutor teaches

## API Endpoints

### POST `/api/submit`

Registers a new tutor in the database.

**Request Body:**

```json
{
  "name": "John Doe",
  "subject": "Mathematics"
}
```

**Response (Success - 200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "subject": "Mathematics"
}
```

**Response (Error - 400):**

```
Name and subject are required
```

**Response (Error - 500):**

```
Internal server error
```

---

### GET `/api/tutors`

Fetches all registered tutors from the database.

**Response (Success - 200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "subject": "Mathematics"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "subject": "English"
  }
]
```

**Response (Error - 500):**

```
Internal server error
```

## Pages

### Landing Page (`/`)

**Purpose:** Welcome page with coming soon message

**Features:**

- Centered layout
- Gradient background
- Simple messaging

---

### Tutor Registration (`/tutor`)

**Purpose:** Allow tutors to register their services

**Features:**

- Two-field form (Name, Subject)
- Client-side validation
- Async form submission
- Success/error alerts
- Form reset on success

**Styling:**

- Responsive container (max-width: 28rem)
- Card-based form design
- Focus states on inputs
- Hover effects on button

---

### Student Dashboard (`/student`)

**Purpose:** Display all available tutors

**Features:**

- Fetches tutors on page load
- Card-based list view
- Empty state message
- Responsive layout

**Styling:**

- Responsive container (max-width: 42rem)
- Card design for each tutor
- Subtle shadows and borders
- Clean typography

## Styling Architecture

### CSS Organization

All styles are centralized in `src/app/globals.css` using a class-based approach.

**Key Style Classes:**

- `.page-container` - Main page wrapper with centered layout
- `.content-wrapper` - Content width constraint (wide)
- `.content-wrapper-narrow` - Content width constraint (narrow, for forms)
- `.page-title` - Large page heading
- `.page-title-sm` - Smaller page heading
- `.card` - White card with shadow and border
- `.form` - Form container with vertical layout
- `.form-field` - Individual form field wrapper
- `.form-label` - Form field label
- `.form-input` - Form input with focus states
- `.form-button` - Form submit button with hover states
- `.tutor-list` - Tutor list container
- `.tutor-item` - Individual tutor card
- `.tutor-name` - Tutor name text
- `.tutor-subject` - Tutor subject text
- `.empty-message` - Empty state message

### Design System

- **Primary Color:** Blue (#3b82f6)
- **Background:** Light gray (#f9fafb)
- **Text:** Dark gray (#111827, #4b5563)
- **Borders:** Light gray (#e5e7eb, #d1d5db)
- **Spacing:** Consistent rem-based spacing
- **Typography:** System font stack with Geist Sans/Mono

## Environment Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Neon PostgreSQL account

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Connection (Neon Pooled Connection)
DATABASE_URL="postgresql://user:password@host.pooler.neon.tech/database?sslmode=require"

# Optional: Direct connection for migrations
DIRECT_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-version
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file with DATABASE_URL
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Run migrations**

   ```bash
   npx prisma migrate deploy
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

7. **Open browser**
   ```
   http://localhost:3000
   ```

## Deployment

### Vercel Deployment

The application is configured for seamless deployment on Vercel.

**Configuration:**

- Runtime: Node.js (required for Prisma)
- Build command: `prisma generate && next build`
- Install command: Includes `postinstall` script for Prisma generation

**Environment Variables on Vercel:**

1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` with your Neon pooled connection string
3. Ensure it's enabled for Production environment

**Deployment Process:**

1. Push code to GitHub
2. Vercel automatically deploys
3. Migrations are applied during build
4. Application goes live

### Important Notes

- **Use pooled connection:** Neon's pooled connection string (contains `.pooler.`) is required for serverless
- **Prisma generation:** Automatically runs during `postinstall` and `build`
- **Runtime configuration:** API routes explicitly use Node.js runtime via `export const runtime = "nodejs"`

## Scripts

```json
{
  "dev": "next dev", // Start development server
  "build": "prisma generate && next build", // Build for production
  "start": "next start", // Start production server
  "lint": "eslint", // Run linter
  "postinstall": "prisma generate" // Auto-generate Prisma Client
}
```

## Code Documentation

All code files include comprehensive inline comments explaining:

- **Syntax:** What each line does
- **Functionality:** What each block accomplishes
- **Purpose:** Why certain approaches were taken

This documentation approach supports learning and onboarding for developers new to the stack.

## Future Enhancements

Potential features for future versions:

- User authentication
- Tutor profiles with detailed information
- Search and filter functionality
- Rating and review system
- Booking/scheduling system
- Payment integration
- Messaging between students and tutors
- Admin dashboard

## Support

For issues or questions, refer to the codebase comments or reach out to the development team.

---

**Version:** 1.0
**Last Updated:** January 2025
**Status:** Production Ready
