# UI Polish

## Overview

Minimal, focused improvements to enhance user feedback during authentication and form interactions.

## Scope

- Loading states during async operations
- Success/error notifications
- Form submission feedback
- Clean, non-intrusive UI updates

**Out of scope:** Fancy animations, transitions, confetti effects

## Loading States

### 1. Authentication Loading

During Google OAuth sign-in:

```typescript
// src/app/auth/signin/page.tsx
const [isLoading, setIsLoading] = useState(false);

<button
  onClick={() => {
    setIsLoading(true);
    signIn("google");
  }}
  disabled={isLoading}
  className="btn-primary">
  {isLoading ? (
    <>
      <LoadingSpinner size="sm" />
      Signing in...
    </>
  ) : (
    <>
      <GoogleIcon />
      Sign in with Google
    </>
  )}
</button>;
```

### 2. Form Submission Loading

During profile save:

```typescript
// TutorForm component
const [isSubmitting, setIsSubmitting] = useState(false);

<button type="submit" disabled={isSubmitting} className="btn-primary">
  {isSubmitting
    ? "Saving..."
    : isEditMode
    ? "Update Profile"
    : "Create Profile"}
</button>;
```

### 3. Dashboard Data Loading

While fetching tutor data:

```typescript
// Dashboard page
if (loading) {
  return (
    <div className="page-container">
      <LoadingSpinner message="Loading dashboard..." />
    </div>
  );
}
```

## Notifications

### Implementation

Use simple toast notifications (or inline messages for now):

```typescript
// src/lib/notifications.ts
export function showSuccess(message: string) {
  // Simple implementation: could use react-hot-toast or custom
  alert(message); // Replace with toast library if desired
}

export function showError(message: string) {
  alert(message); // Replace with toast library if desired
}
```

### Usage Examples

**Profile Save Success:**

```typescript
if (response.ok) {
  showSuccess("Profile saved successfully!");
  router.refresh(); // Refresh server component
}
```

**Profile Save Error:**

```typescript
if (!response.ok) {
  const error = await response.json();
  showError(error.message || "Failed to save profile");
}
```

**Authentication Error:**

```typescript
// NextAuth automatically handles errors via /auth/error page
// Customize if needed
```

## Form Feedback

### Field Validation Feedback

Reuse existing validation from TutorForm:

```typescript
// Show error below field
{
  errors.name && <ErrorMessage message={errors.name} />;
}
```

### File Upload Feedback

Show selected file name:

```typescript
<input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, profilePicture: file });
  }}
/>;
{
  formData.profilePicture && (
    <p className="file-feedback">Selected: {formData.profilePicture.name}</p>
  );
}
```

## Loading Spinner Component

### Update Existing Component

```typescript
// src/components/shared/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClasses[size]}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}
```

### CSS (globals.css)

```css
.spinner {
  border: 2px solid #f3f4f6;
  border-top: 2px solid #0891b2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loading-message {
  color: #6b7280;
  font-size: 0.875rem;
}
```

## Button States

### Disabled State

Already defined in globals.css, ensure consistent usage:

```css
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Error Messages

### Standardize Error Display

Use existing ErrorMessage component:

```typescript
// src/components/shared/ErrorMessage.tsx
export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-message">
      <span className="error-icon">⚠</span>
      {message}
    </div>
  );
}
```

### CSS

```css
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
}
```

## Success Messages

### Component

```typescript
// src/components/shared/SuccessMessage.tsx
export default function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="success-message">
      <span className="success-icon">✓</span>
      {message}
    </div>
  );
}
```

### CSS

```css
.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
  color: #16a34a;
  font-size: 0.875rem;
}

.success-icon {
  font-size: 1rem;
  font-weight: bold;
}
```

## Implementation Priority

1. **High Priority** (Must Have)

   - Form submission loading states
   - Authentication loading state
   - Basic error/success messages

2. **Medium Priority** (Should Have)

   - Dashboard loading skeleton
   - File upload feedback
   - Disabled button states

3. **Low Priority** (Nice to Have)
   - Toast notifications (can use alerts for now)
   - Smooth transitions between states

## Testing Checklist

- [ ] Loading spinner appears during OAuth sign-in
- [ ] Button disabled during form submission
- [ ] Success message after profile save
- [ ] Error message on save failure
- [ ] File name displays after selection
- [ ] Dashboard shows loading state before data loads
