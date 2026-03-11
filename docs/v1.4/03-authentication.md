# Authentication System

## Technology Stack

- **NextAuth.js v5** (Auth.js)
- **Google OAuth** (only provider for v1.4)
- **Session-based** authentication with JWT

## Setup Requirements

### 1. Install Dependencies

```bash
npm install next-auth@beta
```

### 2. Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

**Note:** Google Cloud project already set up and ready.

### 3. NextAuth Configuration

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      // Add user ID and role to session
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Authentication Flow

### New Tutor Signup

1. User clicks "I'm a Tutor" on landing page
2. Redirect to `/auth/signin`
3. Click "Sign in with Google"
4. Google OAuth consent screen
5. Callback to app → User record created (if new)
6. Redirect to `/tutor/dashboard`
7. Dashboard shows empty TutorForm
8. User fills profile → Tutor record created with userId

### Returning Tutor Login

1. User clicks "I'm a Tutor" on landing page
2. Redirect to `/auth/signin`
3. Sign in with Google
4. Redirect to `/tutor/dashboard`
5. Dashboard shows pre-filled TutorForm (existing tutor data)

### Session Management

- Sessions stored in database (via PrismaAdapter)
- JWT token in HTTP-only cookie
- Session includes: user.id, user.email, user.role

## Protected Routes

Use middleware to protect tutor routes:

```typescript
// src/middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/tutor/dashboard/:path*"],
};
```

## Helper Functions

### Check Authentication Status

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Server components
const session = await getServerSession(authOptions);

// Client components
import { useSession } from "next-auth/react";
const { data: session, status } = useSession();
```

### Get Current User

```typescript
// Returns User with Tutor relation if exists
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { tutor: true },
});
```

## Sign Out

```typescript
import { signOut } from "next-auth/react";

<button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>;
```
