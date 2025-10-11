# 3allemni v1.2 Documentation

## Improvements and Additions

### 1. Application Metadata Update (**DONE**)

- The browser tab title will be updated from "Create Next App" to "3allemni".
- A placeholder icon will be added to replace the default favicon. The final logo can be implemented in a future version.

### 2. Tutor Page (`/tutor`): Add Contact Information (**DONE**)

- To enable students to contact tutors, a new **Email** field (required) will be added to the tutor registration form, appearing below the "Name" field.
- The backend and database schema will be updated to store this new information.

### 3. Student Page (`/student`): Filtering (**DONE**)

- To enhance usability, a filter mechanism will be added to the student dashboard.
- A dropdown menu will allow students to select a subject and view only the tutors who teach it. An "All Subjects" option will be included to clear the filter.

### 4. New Individual Tutor Pages (`/tutor/[id]`)

- To allow students to view tutor details and access their contact information, dynamic profile pages will be created for each tutor.
- On the `/student` page, each tutor's entry will now link to their unique profile page (e.g., `/tutor/123`).
- This page will display all of the tutor's details: **Name, Subject, Bio, and the new Email address**.
