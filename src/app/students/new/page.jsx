"use client";
// ---------------------------------------------------------------
// src/app/students/new/page.jsx  →  route: /students/new
// Responsive form — classes loaded from API, submits to API.
// Integration unchanged.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NewStudentPage() {
  const router = useRouter();

  const [fullName,    setFullName]    = useState("");
  const [classId,     setClassId]     = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [classes,        setClasses]        = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError,   setClassesError]   = useState("");

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchClasses(token);
  }, []);

  const fetchClasses = async (token) => {
    setLoadingClasses(true);
    setClassesError("");
    try {
      const response = await fetch("/api/classes/", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      if (response.status === 401) { localStorage.clear(); router.push("/"); return; }
      if (response.ok) {
        setClasses(await response.json());
      } else {
        setClassesError("Failed to load classes.");
      }
    } catch {
      setClassesError("Unable to connect to server.");
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
      const response = await fetch("/api/students/", {
        method: "POST",
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
        setError(data.detail || data.message || "Failed to add student.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none disabled:opacity-50";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-dark-blue">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <p className="text-2xl sm:text-3xl font-semibold mb-6">Add Student</p>

          <div className="bg-cream rounded-2xl p-4 sm:p-6">
            <div className="bg-light-cream rounded-xl p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                    {error}
                  </div>
                )}
                {classesError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                    {classesError}
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
                      disabled={loading || loadingClasses}
                      className={`${inputClass} cursor-pointer appearance-none`}
                    >
                      <option value="">
                        {loadingClasses ? "Loading classes..." : "Select Class"}
                      </option>
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || loadingClasses}
                  className="w-full p-3 bg-light-blue text-white rounded-lg text-sm font-bold hover:bg-light-blue/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Student..." : "Confirm"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}