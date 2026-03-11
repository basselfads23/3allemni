# Tutor Dashboard

## Overview

Protected page where tutors create and edit their profiles using the existing TutorForm component.

## Route

`/tutor/dashboard` (protected by middleware)

## Features

- **Create profile**: Empty form for new tutors
- **Edit profile**: Pre-filled form for existing tutors
- **Auto-save**: Single form handles both create and update
- **Session info**: Display user email and logout button

## Implementation

### Page Structure

```typescript
// src/app/tutor/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TutorForm from "@/components/tutor/TutorForm";

export default async function DashboardPage() {
  // Get session
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  // Fetch user with tutor relation
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { tutor: true },
  });

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        {/* Header with user info */}
        <DashboardHeader user={user} />

        {/* Profile form (create or edit) */}
        <TutorForm initialData={user?.tutor || null} />
      </div>
    </main>
  );
}
```

### Dashboard Header Component

```typescript
// src/components/tutor/DashboardHeader.tsx
import { signOut } from "next-auth/react";

export default function DashboardHeader({ user }) {
  return (
    <div className="dashboard-header">
      <div>
        <h1 className="page-title-sm">Tutor Dashboard</h1>
        <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="btn-secondary">
        Logout
      </button>
    </div>
  );
}
```

## TutorForm Updates

### Component Props

```typescript
interface TutorFormProps {
  initialData?: Tutor | null;
}
```

### Behavior

- **If initialData is null**: Form is empty (create mode)
- **If initialData exists**: Form is pre-filled (edit mode)
- **On submit**:
  - Create mode: POST to `/api/submit` with userId
  - Edit mode: POST to `/api/submit` with tutor id (update)

### Form State

```typescript
const [formData, setFormData] = useState({
  name: initialData?.name || "",
  subject: initialData?.subject || "",
  bio: initialData?.bio || "",
  price: initialData?.price || null,
  location: initialData?.location || "",
  profilePicture: null,
});

const isEditMode = !!initialData;
```

### Submit Handler

```typescript
const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("subject", formData.subject);
  // ... other fields

  if (isEditMode) {
    formDataToSend.append("tutorId", initialData.id.toString());
  }

  const response = await fetch("/api/submit", {
    method: "POST",
    body: formDataToSend,
  });

  if (response.ok) {
    // Show success message
    // Refresh page or update state
  }
};
```

## API Route Updates

### `/api/submit` Changes

```typescript
// src/app/api/submit/route.ts
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  // 1. Require authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // 3. Parse form data
  const formData = await request.formData();
  const tutorId = formData.get("tutorId");

  // 4. Create or update
  if (tutorId) {
    // Update existing tutor
    const tutor = await updateTutor(Number(tutorId), validatedData);
  } else {
    // Create new tutor linked to user
    const tutor = await createTutor({
      ...validatedData,
      userId: user.id,
    });
  }

  return NextResponse.json({ success: true });
}
```

## UI States

### Loading State

Display while checking session or fetching tutor data:

```typescript
if (loading) {
  return <LoadingSpinner message="Loading dashboard..." />;
}
```

### Empty State (New Tutor)

```typescript
<div className="info-banner">
  <p>Welcome! Complete your tutor profile to appear in search results.</p>
</div>
```

### Profile Complete State

```typescript
{
  user.tutor && (
    <div className="success-banner">
      <p>
        ✓ Profile active. <Link href="/tutors/{id}">View public profile</Link>
      </p>
    </div>
  );
}
```

## Validation

- **Client-side**: Same validation as current TutorForm
- **Server-side**: Use existing Zod validators in `/api/submit`
- **Authorization**: Tutors can only edit their own profile (check userId)

## Error Handling

- **Not authenticated**: Redirect to `/auth/signin` (handled by middleware)
- **API errors**: Display error message in form
- **Network errors**: Show retry option
