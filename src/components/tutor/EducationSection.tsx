// src/components/tutor/EducationSection.tsx
"use client";

import { useState } from "react";
import { Education, educationSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { clientLogger } from "@/lib/logger";

type EducationSectionProps = {
  educations: Education[];
};

export default function EducationSection({ educations }: EducationSectionProps) {
  const router = useRouter();
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [university, setUniversity] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // 1. Validate Form
    const result = educationSchema.safeParse({ degree, major, university });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        fieldErrors[error.path[0] as string] = error.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      // 2. Upload Document (if any)
      let documentUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        documentUrl = uploadData.url;
      }

      // 3. Submit Education Record
      const res = await fetch("/api/tutor/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          degree,
          major,
          university,
          documentUrl,
        }),
      });

      if (res.ok) {
        setDegree("");
        setMajor("");
        setUniversity("");
        setFile(null);
        router.refresh();
        clientLogger.success("Education record added successfully");
      } else {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
      }
    } catch (err) {
      clientLogger.error("Error adding education:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Educational Background</h2>
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">Verification Required</span>
      </div>

      {/* List of Educations */}
      {educations.length > 0 ? (
        <div className="grid gap-4">
          {educations.map((edu) => (
            <div key={edu.id} className="card p-4 flex justify-between items-center bg-white border border-gray-100 shadow-sm">
              <div>
                <h4 className="font-bold text-gray-900">{edu.degree} in {edu.major}</h4>
                <p className="text-sm text-gray-600">{edu.university}</p>
                {edu.documentUrl && (
                  <a href={edu.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    View Document
                  </a>
                )}
              </div>
              <div className="text-right">
                {edu.isVerified ? (
                  <span className="badge-success">Verified</span>
                ) : (
                  <span className="badge-warning">Pending Verification</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No educational records added yet.</p>
      )}

      {/* Add Education Form */}
      <div className="card p-6 bg-gray-50 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Add a New Degree</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="degree" className="form-label">Degree (e.g. Bachelor, Master)</label>
              <input 
                type="text" 
                id="degree" 
                className="form-input" 
                value={degree} 
                onChange={(e) => setDegree(e.target.value)} 
                required 
              />
              {errors.degree && <p className="form-error">{errors.degree}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="major" className="form-label">Major (e.g. Physics, Economics)</label>
              <input 
                type="text" 
                id="major" 
                className="form-input" 
                value={major} 
                onChange={(e) => setMajor(e.target.value)} 
                required 
              />
              {errors.major && <p className="form-error">{errors.major}</p>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="university" className="form-label">University Name</label>
            <input 
              type="text" 
              id="university" 
              className="form-input" 
              value={university} 
              onChange={(e) => setUniversity(e.target.value)} 
              required 
            />
            {errors.university && <p className="form-error">{errors.university}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="document" className="form-label">Verification Document (PDF or Image)</label>
            <input 
              type="file" 
              id="document" 
              className="form-input bg-white" 
              accept="application/pdf,image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
            <p className="text-xs text-gray-500 mt-1">Upload your diploma or transcript for verification. Max 5MB.</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="form-button px-8 py-2.5 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Add Education Record"}
          </button>
        </form>
      </div>
    </div>
  );
}
