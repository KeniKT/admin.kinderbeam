"use client";
// ---------------------------------------------------------------
// src/app/students/new/page.jsx  →  route: /students/new
// Form to add a new student.
// ---------------------------------------------------------------

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const CLASSES = [
  { id: 1, name: "Kindergarten" },
  { id: 2, name: "Grade 1" },
  { id: 3, name: "Grade 2" },
  { id: 4, name: "Grade 3" },
  { id: 5, name: "Grade 4" },
  { id: 6, name: "Grade 5" },
];

export default function NewStudentPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [classId, setClassId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !classId || !dateOfBirth) {
      setError("Please fill in all fields");
      return;
    }

    router.push("/students");
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
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
                    />
                    <div className="flex flex-row gap-2">
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue focus:outline-none cursor-pointer"
                      />
                      <div className="relative w-full">
                        <select
                          value={classId}
                          onChange={(e) => setClassId(e.target.value)}
                          className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue focus:outline-none cursor-pointer appearance-none"
                        >
                          <option value="">Select Class</option>
                          {CLASSES.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
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

                  <button
                    type="submit"
                    className="w-full p-3 bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer"
                  >
                    Confirm
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