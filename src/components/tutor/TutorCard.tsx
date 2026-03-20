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
          <div className="flex justify-between items-start">
            <p className="tutor-name">{tutor.name}</p>
            {tutor.educations && tutor.educations.some(e => e.isVerified) && (
              <span title="Verified Education" className="text-blue-600">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4.242 4.243a1 1 0 01-1.414 0L6.293 11.2a1 1 0 111.414-1.414l1.06 1.06 3.536-3.535a1 1 0 111.414 1.414z" />
                </svg>
              </span>
            )}
          </div>
          <p className="tutor-subject">{tutor.subject}</p>

          {tutor.educations && tutor.educations.length > 0 && (
            <p className="text-[10px] text-gray-500 mt-1 truncate">
              🎓 {tutor.educations[0].degree} from {tutor.educations[0].university}
            </p>
          )}

          <div className="flex justify-between items-end mt-2">
            <p className="tutor-meta font-bold text-blue-600">{formatPrice(tutor.hourlyRate)}</p>
            <p className="tutor-meta text-[10px]">
              {tutor.city}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
