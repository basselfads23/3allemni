# v1.4 Overview

## Vision

Enable tutors to manage their own profiles through authentication, improving data ownership and profile accuracy.

## Goals

- Allow tutors to edit/update their profiles
- Implement secure authentication using Google OAuth
- Separate user accounts from tutor profiles
- Improve UX with better feedback and loading states

## Scope

### In Scope

- Google OAuth authentication (NextAuth.js)
- User model with role-based architecture
- Protected tutor dashboard for profile management
- Route renaming: `/student` → `/parent`
- Move tutor registration form to protected dashboard
- Minimal UI polish (loading states, notifications)

### Out of Scope

- Parent/student authentication
- Email/password login
- Landing page redesign
- Messaging or booking features
- Profile verification/approval system
- Advanced animations or transitions

## Target Users

- **Tutors**: Can create accounts, register profiles, and edit their information
- **Parents**: Continue browsing tutors anonymously (no changes to current experience)

## Success Criteria

- Tutors can sign up with Google
- Tutors can create and edit their profiles
- Existing tutor browsing experience remains unchanged
- Clean separation between User (auth) and Tutor (profile) data
