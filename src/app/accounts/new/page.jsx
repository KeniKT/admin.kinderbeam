"use client";
// ---------------------------------------------------------------
// src/app/accounts/new/page.jsx  →  route: /accounts/new
// Form to create a new account. When Parent is selected, shows a
// student assignment section with search and class filter.
// Fully responsive for all screen sizes.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FiSearch, FiCheck } from "react-icons/fi";

const ROLES = [
  { role_id: 1, role_name: "Teacher"   },
  { role_id: 3, role_name: "Moderator" },
  { role_id: 4, role_name: "Parent"    },
];

export default function NewAccountPage() {
  const router = useRouter();

  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]     = useState("");
  const [username,    setUsername]     = useState("");
  const [email,       setEmail]        = useState("");
  const [phoneNumber, setPhoneNumber]  = useState("");
  const [roleId,      setRoleId]       = useState("");

  const [students,         setStudents]         = useState([]);
  const [classes,          setClasses]          = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSearch,    setStudentSearch]    = useState("");
  const [classFilter,      setClassFilter]      = useState("");
  const [loadingStudents,  setLoadingStudents]  = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isParent = parseInt(roleId) === 4;

  useEffect(() => {
    if (!isParent) {
      setSelectedStudents([]);
      setStudentSearch("");
      setClassFilter("");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchStudentsAndClasses(token);
  }, [roleId]);

  const fetchStudentsAndClasses = async (token) => {
    setLoadingStudents(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetch("/api/students/", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }),
        fetch("/api/classes/", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }),
      ]);
      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (classesRes.ok)  setClasses(await classesRes.json());
    } catch (err) {
      console.error("Failed to load students/classes:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.full_name.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass  = classFilter ? s.class_id === parseInt(classFilter) : true;
    return matchesSearch && matchesClass;
  });

  const getClassName = (classId) => {
    const cls = classes.find((c) => c.class_id === classId);
    return cls ? cls.class_name : `Class ${classId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !username || !email || !phoneNumber || !roleId) {
      setError("Please fill in all fields.");
      return;
    }

    if (isParent && selectedStudents.length === 0) {
      setError("Please select at least one student to assign to this parent.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const body = {
        role_id:      parseInt(roleId),
        first_name:   firstName,
        last_name:    lastName,
        email:        email,
        username:     username,
        phone_number: phoneNumber,
        ...(isParent && { student_ids: selectedStudents }),
      };

      const response = await fetch("/api/auth/register/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) { localStorage.clear(); router.push("/"); return; }

      if (response.ok) {
        router.push("/accounts");
      } else {
        const data = await response.json();
        const firstError = Object.values(data)[0];
        setError(
          typeof firstError === "string"
            ? firstError
            : Array.isArray(firstError)
            ? firstError[0]
            : data.detail || "Failed to create account."
        );
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

          <p className="text-2xl sm:text-3xl font-semibold mb-6">Add Account</p>

          <div className="bg-cream rounded-2xl p-4 sm:p-6">
            <div className="bg-light-cream rounded-xl p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                    {error}
                  </div>
                )}

                {/* Username */}
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />

                {/* First + Last name — stacked on mobile, side by side on sm+ */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />

                {/* Phone */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />

                {/* Role dropdown */}
                <div className="relative">
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    disabled={loading}
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >
                    <option value="" disabled>Select Role</option>
                    {ROLES.map((r) => (
                      <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Student assignment — Parent only */}
                {isParent && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center justify-between">
                      <p className="text-sm font-bold text-dark-blue">
                        Assign Students
                        {selectedStudents.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-light-blue text-white text-xs rounded-full">
                            {selectedStudents.length} selected
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Search + Class filter — stacked on mobile, side by side on sm+ */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-cream" />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
                        />
                      </div>

                      <div className="relative sm:w-40">
                        <select
                          value={classFilter}
                          onChange={(e) => setClassFilter(e.target.value)}
                          className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue focus:outline-none cursor-pointer appearance-none"
                        >
                          <option value="">All Classes</option>
                          {classes.map((cls) => (
                            <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Students list */}
                    <div className="flex flex-col bg-cream rounded-lg overflow-hidden max-h-64 overflow-y-auto border border-medium-cream">
                      {loadingStudents ? (
                        <p className="p-4 text-sm text-dark-cream text-center">Loading students...</p>
                      ) : filteredStudents.length === 0 ? (
                        <p className="p-4 text-sm text-dark-cream text-center italic">No students found</p>
                      ) : (
                        filteredStudents.map((student) => {
                          const isSelected = selectedStudents.includes(student.student_id);
                          return (
                            <div
                              key={student.student_id}
                              onClick={() => toggleStudent(student.student_id)}
                              className={`flex flex-row items-center justify-between px-4 py-3 cursor-pointer border-b border-light-cream last:border-0 transition-colors ${
                                isSelected
                                  ? "bg-light-blue/10 border-l-4 border-l-light-blue"
                                  : "hover:bg-light-cream"
                              }`}
                            >
                              <div className="flex flex-row items-center gap-3">
                                <div className="size-8 rounded-full bg-light-cream flex items-center justify-center text-dark-blue font-bold text-xs border border-medium-cream shrink-0">
                                  {student.full_name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-dark-blue truncate">{student.full_name}</p>
                                  <p className="text-xs text-dark-cream">{getClassName(student.class_id)}</p>
                                </div>
                              </div>
                              <div className={`size-5 rounded-full flex items-center justify-center border-2 shrink-0 ml-3 transition-colors ${
                                isSelected ? "bg-light-blue border-light-blue" : "border-medium-cream"
                              }`}>
                                {isSelected && <FiCheck size={11} className="text-white" strokeWidth={3} />}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-3 bg-light-blue text-white rounded-lg text-sm font-bold hover:bg-light-blue/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Confirm"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}