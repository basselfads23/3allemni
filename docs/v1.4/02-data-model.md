# Data Model Changes

## Overview

Separate authentication (User) from domain profiles (Tutor) using a one-to-one relationship.

## New Models

### User Model

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  role      Role     @default(TUTOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tutor     Tutor?   // One-to-one relationship
}

enum Role {
  TUTOR
  PARENT  // For future use
  ADMIN   // For future use
}
```

**Fields:**

- `email`: Provided by Google OAuth, unique identifier
- `role`: User type (currently only TUTOR is functional)
- `tutor`: Optional relationship to Tutor profile

## Modified Models

### Tutor Model Changes

```prisma
model Tutor {
  id                 Int      @id @default(autoincrement())
  userId             Int      @unique  // NEW: Foreign key to User
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name               String
  // email field REMOVED (now in User model)
  subject            String
  bio                String?
  price              Float?
  location           String?
  profilePictureUrl  String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

**Changes:**

- ✅ Add `userId` field (unique, required)
- ✅ Add `user` relation
- ❌ Remove `email` field (use User.email instead)
- ✅ Add `onDelete: Cascade` (delete tutor when user deleted)

## Relationships

```text
User (1) ←→ (0..1) Tutor
```

- One User can have zero or one Tutor profile
- One Tutor must belong to exactly one User
- Deleting a User cascades to delete their Tutor profile

## Migration Strategy

Since database contains only test data:

1. Drop existing Tutor table
2. Create new User and Tutor tables with relationships
3. No data migration needed

**Prisma Commands:**

```bash
npx prisma migrate dev --name add_user_model
npx prisma generate
```
