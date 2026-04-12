"use client";
// ---------------------------------------------------------------
// src/app/students/page.jsx  →  route: /students
// Responsive — table on desktop, cards on mobile.
// Integration unchanged.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FiEdit, FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";

const RECORDS_PER_PAGE = 5;

export default function StudentsPage() {
  const router = useRouter();

  const [students,    setStudents]    = useState([]);
  const [classes,     setClasses]     = useState([]);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetch("/api/students/", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }),
        fetch("/api/classes/", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }),
      ]);

      if (studentsRes.status === 401 || classesRes.status === 401) {
        localStorage.clear(); router.push("/"); return;
      }

      let classesMap = {};
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        classesData.forEach(c => { classesMap[c.class_id] = c.class_name; });
        setClasses(classesData);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.map(s => ({
          ...s,
          class_name: classesMap[s.class_id] || `Class ${s.class_id}`,
        })));
      } else {
        setError("Failed to load students.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nPages = Math.ceil(filteredStudents.length / RECORDS_PER_PAGE) || 1;
  const indexOfFirst = (currentPage - 1) * RECORDS_PER_PAGE;
  const currentRecords = filteredStudents.slice(indexOfFirst, indexOfFirst + RECORDS_PER_PAGE);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-dark-blue">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-2xl sm:text-3xl font-semibold">All Students</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-64 px-4 py-2 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
              />
              <Link href="/students/new">
                <button className="flex flex-row items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer">
                  <FiPlus size={18} />
                  <span>Add Student</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-cream rounded-2xl p-4">
            <div className="bg-light-cream rounded-xl p-2 sm:p-4">
              {loading ? (
                <div className="p-10 text-center text-dark-cream">Loading students...</div>
              ) : error ? (
                <div className="p-10 text-center text-red-500">{error}</div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-center text-dark-blue border-collapse">
                      <thead>
                        <tr className="border-b-2 border-medium-cream text-xs uppercase font-bold">
                          <th className="p-4">Full Name</th>
                          <th className="p-4">Class</th>
                          <th className="p-4">Date of Birth</th>
                          <th className="p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.length > 0 ? (
                          currentRecords.map((student) => (
                            <tr key={student.student_id} className="border-t-2 border-cream hover:bg-cream font-medium transition-colors">
                              <td className="p-4 text-sm">{student.full_name}</td>
                              <td className="p-4 text-sm">{student.class_name}</td>
                              <td className="p-4 text-sm">{student.date_of_birth}</td>
                              <td className="p-4">
                                <Link href={`/students/${student.student_id}/edit`}>
                                  <button className="text-light-blue cursor-pointer hover:text-light-blue/70 transition-colors">
                                    <FiEdit size={20} />
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-10 text-gray-400 italic text-sm">
                              {searchTerm ? `No students match "${searchTerm}"` : "No students found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden flex flex-col gap-3">
                    {currentRecords.length > 0 ? (
                      currentRecords.map((student) => (
                        <div key={student.student_id} className="bg-cream rounded-xl p-4 flex flex-row items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <p className="font-bold text-dark-blue text-sm">{student.full_name}</p>
                            <p className="text-xs text-dark-cream">{student.class_name}</p>
                            <p className="text-xs text-dark-cream">DOB: {student.date_of_birth}</p>
                          </div>
                          <Link href={`/students/${student.student_id}/edit`}>
                            <button className="text-light-blue cursor-pointer hover:text-light-blue/70 transition-colors ml-4">
                              <FiEdit size={20} />
                            </button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="p-10 text-center text-gray-400 italic text-sm">
                        {searchTerm ? `No students match "${searchTerm}"` : "No students found"}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-row items-center justify-center gap-4 mt-4 pb-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-dark-blue ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-light-blue hover:border-light-blue hover:text-white transition-colors cursor-pointer"}`}
              >
                <FiArrowLeft size={18} />
              </button>
              <p className="text-sm font-normal">
                Page <span className="font-bold">{currentPage}</span> of {nPages}
              </p>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, nPages))}
                disabled={currentPage === nPages}
                className={`p-2 rounded-lg border border-dark-blue ${currentPage === nPages ? "opacity-30 cursor-not-allowed" : "hover:bg-light-blue hover:border-light-blue hover:text-white transition-colors cursor-pointer"}`}
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}