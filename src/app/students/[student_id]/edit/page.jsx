"use client";
// ---------------------------------------------------------------
// src/app/students/[student_id]/edit/page.jsx  →  /students/:student_id/edit
// Edit an existing student — loads data then PATCHes on submit.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EditStudentPage() {
  const router      = useRouter();
  const { student_id } = useParams();

  const [fullName,    setFullName]    = useState("");
  const [classId,     setClassId]     = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [classes,        setClasses]        = useState([]);
  const [loadingData,    setLoadingData]    = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    // Load student data and classes in parallel
    Promise.all([fetchStudent(token), fetchClasses(token)]);
  }, []);

  const fetchStudent = async (token) => {
    try {
      const response = await fetch(`/api/students/${student_id}/`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      if (response.status === 401) { localStorage.clear(); router.push("/"); return; }
      if (response.ok) {
        const data = await response.json();
        setFullName(data.full_name      || "");
        setClassId(String(data.class_id) || "");
        setDateOfBirth(data.date_of_birth || "");
      } else {
        setError("Failed to load student.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchClasses = async (token) => {
    try {
      const response = await fetch("/api/classes/", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      if (response.ok) setClasses(await response.json());
    } catch {
      console.error("Failed to load classes");
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !classId || !dateOfBirth) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/students/${student_id}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          full_name:     fullName,
          class_id:      parseInt(classId),
          date_of_birth: dateOfBirth,
        }),
      });

      if (response.status === 401) { localStorage.clear(); router.push("/"); return; }
      if (response.ok) {
        router.push("/students");
      } else {
        const data = await response.json();
        setError(data.detail || data.message || "Failed to update student.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none disabled:opacity-50";
  const isPageLoading = loadingData || loadingClasses;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-dark-blue">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <p className="text-2xl sm:text-3xl font-semibold mb-6">Edit Student</p>

          <div className="bg-cream rounded-2xl p-4 sm:p-6">
            <div className="bg-light-cream rounded-xl p-4 sm:p-6">

              {isPageLoading ? (
                <div className="py-16 text-center text-dark-cream">Loading student...</div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />

                  {/* Date + Class — stacked on mobile, side by side on sm+ */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={loading}
                      className={`${inputClass} cursor-pointer`}
                    />

                    <div className="relative w-full">
                      <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        disabled={loading}
                        className={`${inputClass} cursor-pointer appearance-none`}
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/students")}
                      className="w-full p-3 bg-cream border border-medium-cream text-dark-blue rounded-lg text-sm font-bold hover:bg-medium-cream/20 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full p-3 bg-light-blue text-white rounded-lg text-sm font-bold hover:bg-light-blue/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}