// src/components/tutor/TutorCard.tsx
// BLOCK: Tutor Card Component
// Displays a single tutor's information as a clickable card

import Link from "next/link";
import Image from "next/image";
import { Tutor } from "@/lib/validations";
import { formatPrice, formatLocation, getInitials } from "@/lib/utils";

// BLOCK: Component props type definition
interface TutorCardProps {
  tutor: Tutor;
}

// BLOCK: TutorCard component
// Renders a card with tutor's profile picture, name, subject, price, and location
export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <li className="tutor-item">
      <Link href={`/tutors/${tutor.id}`} className="tutor-link">
        {/* BLOCK: Profile picture or placeholder */}
        {tutor.profilePictureUrl ? (
          <Image
            src={tutor.profilePictureUrl}
            alt={`${tutor.name}'s profile`}
            width={56}
            height={56}
            className="tutor-thumbnail"
          />
        ) : (
          <div className="tutor-thumbnail-placeholder">
            {getInitials(tutor.name)}
          </div>
        )}

        {/* BLOCK: Tutor information */}
        <div className="tutor-info">
          <p className="tutor-name">{tutor.name}</p>
          <p className="tutor-subject">{tutor.subject}</p>

          {/* Display price if available */}
          {tutor.price && <p className="tutor-meta">{formatPrice(tutor.price)}</p>}

          {/* Display location if available */}
          {tutor.location && (
            <p className="tutor-meta">{formatLocation(tutor.location)}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
