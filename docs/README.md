# Documentation

This directory contains all the current features of the app, as well as planned features to implement later.

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
├── prisma/                 # Database configuration
│   ├── schema.prisma      # Database schema definition
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── student/     # Student page
│   │   ├── tutor/       # Tutor registration page
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Landing page
│   └── lib/
│       └── prisma.ts    # Prisma client singleton
└── package.json         # Dependencies and scripts
```
