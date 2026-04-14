"use client";
// ---------------------------------------------------------------
// src/app/students/new/page.jsx  →  route: /students/new
// Form to add a new student — classes loaded from API, submits to API.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NewStudentPage() {
  const router = useRouter();

  // Form fields
  const [fullName, setFullName]       = useState("");
  const [classId, setClassId]         = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Classes from API
  const [classes, setClasses]             = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError, setClassesError]   = useState("");

  // Submit state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

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
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        router.push("/");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setClassesError("Failed to load classes.");
      }
    } catch (err) {
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
          full_name: fullName,
          class_id: parseInt(classId), // must be a number
          date_of_birth: dateOfBirth,  // format: YYYY-MM-DD
        }),
      });

      if (response.status === 401) {
        localStorage.clear();
        router.push("/");
        return;
      }

      if (response.ok) {
        router.push("/students");
      } else {
        const data = await response.json();
        setError(data.detail || data.message || "Failed to add student.");
      }
    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full w-full bg-white text-dark-blue font-semibold items-center">
        <div className="flex flex-col py-4 w-[50%] gap-4">
          <div className="flex flex-row justify-between items-center h-12">
            <p className="text-3xl">Add Student</p>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col bg-cream w-full rounded-lg p-4 items-center">
              <div className="flex flex-col bg-light-cream w-full items-center rounded-lg p-4 gap-2">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-bold w-full">

                  {/* Error message */}
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                      {error}
                    </div>
                  )}

                  {/* Classes failed to load */}
                  {classesError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                      {classesError}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {/* Full Name */}
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none disabled:opacity-50"
                    />

                    <div className="flex flex-row gap-2">
                      {/* Date of Birth */}
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue focus:outline-none cursor-pointer disabled:opacity-50"
                      />

                      {/* Class dropdown — populated from API */}
                      <div className="relative w-full">
                        <select
                          value={classId}
                          onChange={(e) => setClassId(e.target.value)}
                          disabled={loading || loadingClasses}
                          className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue focus:outline-none cursor-pointer appearance-none disabled:opacity-50"
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
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || loadingClasses}
                    className="w-full p-3 bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Adding Student..." : "Confirm"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}