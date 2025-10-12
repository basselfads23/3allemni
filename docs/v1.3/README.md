# 3allemni v1.3 Documentation

## 1. Tutor Profile Pictures

To build trust and make the platform more personal, tutors will be able to add a profile picture.

- **Tutor Page (`/tutor`):** A new "Profile Picture" field (optional) will be added to the registration form. This will be a file upload input.
- **Backend:** Logic will be implemented to handle image uploads (e.g., storing them on a service like Cloudinary or Vercel Blob Storage) and linking the image URL to the tutor's record in the database.
- **Student Page (`/student`):** The tutor's profile picture will be displayed as a thumbnail next to their name in the list.
- **Tutor Profile Page (`/tutor/[id]`):** The profile picture will be displayed prominently at the top of the tutor's detail page.

## 2. Add Critical Information: Pricing and Location

To help students make informed decisions, two new crucial fields will be added.

- **Tutor Page (`/tutor`):**
  - Add a new **Price per Hour** field (e.g., a number input).
  - Add a new **Location** field (e.g., a simple text input for "City, Country").
- **Database:** The `Tutor` model in `schema.prisma` will be updated to include these new `price` and `location` fields.
- **Student & Tutor Pages:** The price and location will be displayed on both the main student dashboard list and the individual tutor profile pages. The student page filtering will also be updated to allow filtering by location.

## 3. UI/UX: Add a Consistent Navigation Bar and Footer

To unify the application and improve navigation, a persistent header and footer will be added.

- **Layout (`layout.tsx`):** A global `Header` component will be created and added to the root layout.
  - It will contain the "3allemni" name/logo on the left.
  - It will include navigation links: "Find a Tutor" (`/student`) and "Become a Tutor" (`/tutor`).
- **Layout (`layout.tsx`):** A simple global `Footer` component will be created with basic information (e.g., "© 2025 3allemni").

### Future Ideas (To be considered for v1.4+)

- **Tutor Authentication & Editing:** Allow tutors to create an account (e.g., with a password or social login) so they can log in and edit their own profiles later.
- **Admin Dashboard:** Revisit the idea of an admin page to manage tutors (view, edit, delete).
- **Advanced Filtering:** Allow students to filter by price range in addition to subject and location.
