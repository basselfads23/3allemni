// src/app/tutors/[id]/page.tsx
import { auth } from "@/lib/auth";
import { getTutorById } from "@/services/tutorService";
import { prisma } from "@/lib/prisma"; // Added
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ContactTutorForm from "@/components/tutor/ContactTutorForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TutorProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  
  // 1. Fetch tutor data
  const tutor = await getTutorById(id);

  if (!tutor) {
    notFound();
  }

  // 2. Check for existing outreach if logged in
  let existingConversation = null;
  if (session?.user?.id) {
    existingConversation = await prisma.conversation.findUnique({
      where: {
        parentId_tutorId: {
          parentId: session.user.id,
          tutorId: tutor.id,
        },
      },
    });
  }

  // 3. Determine user's contact capability
  // Note: We might want to prevent tutors from contacting themselves
  const isOwnProfile = session?.user?.id === tutor.userId;

  return (
    <main className="page-container">
      <div className="content-wrapper">
        <Link href="/parent" className="back-link mb-6 inline-block">
          ← Back to Tutors List
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card profile-card">
              {tutor.profilePictureUrl ? (
                <Image
                  src={tutor.profilePictureUrl}
                  alt={`${tutor.name}'s profile`}
                  width={144}
                  height={144}
                  className="profile-picture"
                  priority
                />
              ) : (
                <div className="profile-picture-placeholder">
                  {tutor.name.charAt(0).toUpperCase()}
                </div>
              )}

              <h1 className="profile-name">{tutor.name}</h1>
              <div className="profile-subject-badge">{tutor.subject}</div>

              <div className="profile-details mt-8">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Rate:</span>
                  <p className="profile-detail-value font-bold text-blue-600">
                    ${tutor.hourlyRate.toFixed(2)}/hour
                  </p>
                </div>

                <div className="profile-detail-item">
                  <span className="profile-detail-label">Teaching Mode:</span>
                  <p className="profile-detail-value">
                    {tutor.teachingMode === "IN_PERSON" ? "In Person" : 
                     tutor.teachingMode === "ONLINE" ? "Online" : "In Person & Online"}
                  </p>
                </div>

                <div className="profile-detail-item">
                  <span className="profile-detail-label">Location:</span>
                  <p className="profile-detail-value">
                    {[tutor.city, tutor.district, tutor.governorate].filter(Boolean).join(", ")}
                  </p>
                </div>

                {tutor.bio && (
                  <div className="profile-detail-item pt-4 border-t border-gray-100">
                    <span className="profile-detail-label block mb-2 font-semibold">About Me</span>
                    <p className="profile-bio leading-relaxed text-gray-700 whitespace-pre-line">{tutor.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Section */}
          <div className="lg:col-span-1">
            {!session ? (
              <div className="card p-6 text-center shadow-sm border border-blue-100 bg-blue-50">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Interested in {tutor.name}?</h3>
                <p className="text-blue-800 mb-4 text-sm">Sign in to send a secure message and book your first session.</p>
                <Link href="/api/auth/signin" className="form-button block text-center no-underline">
                  Log in to Contact
                </Link>
              </div>
            ) : isOwnProfile ? (
              <div className="card p-6 text-center bg-gray-50 border border-gray-200">
                <p className="text-gray-600 italic">This is your public profile view.</p>
                <Link href="/tutor/profile" className="mt-4 inline-block text-blue-600 font-semibold underline">
                  Edit your profile
                </Link>
              </div>
            ) : existingConversation ? (
              <div className="card p-6 text-center bg-blue-50 border border-blue-100 shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Conversation Active</h3>
                <p className="text-blue-800 mb-6 text-sm">You have already contacted {tutor.name}. Click below to view your chat.</p>
                <Link 
                  href={`/messages/${existingConversation.id}`} 
                  className="form-button block text-center no-underline bg-blue-600 hover:bg-blue-700"
                >
                  View Conversation
                </Link>
              </div>
            ) : (
              <ContactTutorForm tutorId={tutor.id} tutorName={tutor.name} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
