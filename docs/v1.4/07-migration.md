# Migration Guide

## Overview

Step-by-step guide for implementing v1.4 features in order of dependencies.

## Prerequisites

- Database contains only test data (can be dropped)
- Google Cloud OAuth credentials ready
- Current codebase is on branch `v1.4`

## Migration Steps

### Step 1: Install Dependencies

```bash
npm install next-auth@beta @next-auth/prisma-adapter
```

**Verify installation:**

```bash
npm list next-auth
```

### Step 2: Update Environment Variables

Add to `.env.local`:

```env
# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_random_secret_here
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### Step 3: Update Prisma Schema

Edit `prisma/schema.prisma`:

**Add User model and Role enum:**

```prisma
enum Role {
  TUTOR
  PARENT
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  role      Role     @default(TUTOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tutor     Tutor?

  // NextAuth fields
  accounts      Account[]
  sessions      Session[]
}

// NextAuth required models
model Account {
  id                String  @id @default(cuid())
  userId            Int
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       Int
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

**Update Tutor model:**

```prisma
model Tutor {
  id                 Int      @id @default(autoincrement())
  userId             Int      @unique
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name               String
  // REMOVE: email field
  subject            String
  bio                String?
  price              Float?
  location           String?
  profilePictureUrl  String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

### Step 4: Create Migration

```bash
# This will drop existing tables and create new ones
npx prisma migrate dev --name add_authentication_system

# Generate Prisma Client
npx prisma generate
```

**Verify migration:**

```bash
npx prisma studio
# Check that User, Account, Session, VerificationToken, and updated Tutor tables exist
```

### Step 5: Create NextAuth Configuration

Create `src/app/api/auth/[...nextauth]/route.ts` as documented in `03-authentication.md`

**Test authentication:**

1. Run `npm run dev`
2. Navigate to `http://localhost:3000/api/auth/signin`
3. Verify Google sign-in page appears

### Step 6: Rename Student → Parent Routes

**Rename folder:**

```bash
# In src/app/
mv student parent
```

**Update imports:**

- Search for `/student` in all files
- Replace with `/parent`
- Update Header.tsx navigation link
- Update landing page link

**Files to update:**

- `src/components/layout/Header.tsx`
- `src/app/page.tsx` (landing page)
- Any other references

### Step 7: Move Tutor Page to Dashboard

**Create dashboard:**

```bash
mkdir -p src/app/tutor/dashboard
```

**Move and update:**

1. Copy `src/app/tutor/page.tsx` → `src/app/tutor/dashboard/page.tsx`
2. Update as documented in `05-dashboard.md`
3. Delete `src/app/tutor/page.tsx`

### Step 8: Create Middleware

Create `src/middleware.ts`:

```typescript
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/tutor/dashboard/:path*"],
};
```

### Step 9: Update API Routes

**Update `/api/submit/route.ts`:**

- Add session check
- Link tutor to user via userId
- Support create and update operations
- See `05-dashboard.md` for implementation

**Update tutorService.ts:**

- Modify `createTutor` to accept `userId`
- Ensure all operations validate ownership

### Step 10: Add UI Polish Components

Create components from `06-ui-polish.md`:

- Update `LoadingSpinner.tsx` with size variants
- Create `SuccessMessage.tsx`
- Ensure `ErrorMessage.tsx` exists
- Add CSS to `globals.css`

### Step 11: Update TutorForm Component

Modify `src/components/tutor/TutorForm.tsx`:

- Add `initialData` prop
- Support both create and edit modes
- Add loading states
- Add success/error feedback

### Step 12: Testing Checklist

**Authentication:**

- [ ] Google OAuth sign-in works
- [ ] Session persists after sign-in
- [ ] Protected routes redirect to sign-in when not authenticated
- [ ] Sign-out works correctly

**Dashboard:**

- [ ] New users see empty TutorForm
- [ ] Existing tutors see pre-filled form
- [ ] Profile creation works
- [ ] Profile update works
- [ ] User email displays correctly
- [ ] Logout button works

**Parent Browse:**

- [ ] `/parent` route works (renamed from `/student`)
- [ ] All tutors display
- [ ] Filters work
- [ ] Individual tutor pages work (`/tutors/[id]`)

**UI Polish:**

- [ ] Loading states appear during operations
- [ ] Success messages show after saves
- [ ] Error messages display on failures
- [ ] Buttons disable during submission

### Step 13: Build and Deploy Test

**Local build:**

```bash
npm run build
```

**Fix any build errors, then:**

```bash
npm start
```

**Verify production mode:**

- Authentication works
- Dashboard accessible
- All routes function correctly

### Step 14: Deploy to Vercel

**Before deploying:**

1. Update environment variables in Vercel dashboard
2. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
3. Update `NEXTAUTH_URL` to production URL

**Deploy:**

```bash
git add .
git commit -m "Implement v1.4 authentication and dashboard"
git push origin v1.4
```

**Create PR:**

- Create pull request to main
- Review changes
- Merge when ready

## Rollback Plan

If issues occur:

**Revert migration:**

```bash
npx prisma migrate reset
# Then restore from backup if needed
```

**Revert code:**

```bash
git revert <commit-hash>
git push
```

## Common Issues

### Issue: NextAuth callback URL mismatch

**Solution:** Ensure NEXTAUTH_URL matches current environment

### Issue: Google OAuth not working

**Solution:** Verify Google Cloud Console authorized redirect URIs include:

- `http://localhost:3000/api/auth/callback/google` (dev)
- `https://yourdomain.com/api/auth/callback/google` (prod)

### Issue: Session not persisting

**Solution:** Check that Account and Session models exist in database

### Issue: Tutor creation fails

**Solution:** Verify userId is being passed and User exists

## Post-Migration

After successful deployment:

1. Test all flows with real Google accounts
2. Monitor logs for any authentication errors
3. Verify database relationships are correct
4. Document any additional findings in this file
