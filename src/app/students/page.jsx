"use client";
// ---------------------------------------------------------------
// src/app/students/page.jsx  →  route: /students
// Shows a searchable, paginated table of all students from the API.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FiEdit, FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";

const RECORDS_PER_PAGE = 5;

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents]       = useState([]);
  const [classes, setClasses]         = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    setLoading(true);
    setError("");

    try {
      // Fetch students and classes in parallel
      const [studentsRes, classesRes] = await Promise.all([
        fetch("/api/students/", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }),
        fetch("/api/classes/", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        }),
      ]);

      // Handle token expiry
      if (studentsRes.status === 401 || classesRes.status === 401) {
        localStorage.clear();
        router.push("/");
        return;
      }

      let classesMap = {};
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        // Build a map of class_id → class_name for fast lookup
        classesData.forEach(c => { classesMap[c.class_id] = c.class_name; });
        setClasses(classesData);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        // Attach class_name to each student using the map
        const enriched = studentsData.map(s => ({
          ...s,
          class_name: classesMap[s.class_id] || `Class ${s.class_id}`,
        }));
        setStudents(enriched);
      } else {
        setError("Failed to load students.");
      }
    } catch (err) {
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
      <div className="flex flex-col h-full w-full bg-white text-dark-blue font-semibold items-center">
        <div className="flex flex-col py-4 w-[50%] gap-4">

          {/* Page header */}
          <div className="flex flex-row justify-between items-center h-12">
            <p className="text-3xl">All Students</p>
            <div className="flex flex-row gap-4 h-full">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="px-4 w-64 h-full bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
              />
              <Link href="/students/new">
                <button className="flex flex-row items-center gap-2 px-4 h-full bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer">
                  <FiPlus size={22} />
                  <p>Add Student</p>
                </button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col bg-cream w-full rounded-lg p-4 items-center">
              <div className="flex flex-col bg-light-cream w-full items-center rounded-lg p-4 gap-2">

                {loading ? (
                  <div className="p-10 text-center text-dark-cream">Loading students...</div>
                ) : error ? (
                  <div className="p-10 text-center text-red-500">{error}</div>
                ) : (
                  <table className="w-full text-center text-dark-blue border-collapse">
                    <thead>
                      <tr className="border-b-2 border-medium-cream text-sm uppercase font-bold">
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
                            <td className="p-4">{student.full_name}</td>
                            <td className="p-4">{student.class_name}</td>
                            <td className="p-4">{student.date_of_birth}</td>
                            <td className="p-4">
                              <Link href={`/students/${student.student_id}/edit`}>
                                <button className="text-light-blue cursor-pointer hover:text-light-blue/70 transition-colors">
                                  <FiEdit size={24} />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-10 text-gray-400 italic">
                            {searchTerm ? `No students match "${searchTerm}"` : "No students found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-row items-center gap-4 mt-4 pb-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border border-dark-blue ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-light-blue hover:border-light-blue hover:text-white transition-colors cursor-pointer"}`}
                >
                  <FiArrowLeft size={20} />
                </button>
                <p className="text-sm font-normal">
                  Page <span className="font-bold">{currentPage}</span> of {nPages}
                </p>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, nPages))}
                  disabled={currentPage === nPages}
                  className={`p-2 rounded-lg border border-dark-blue ${currentPage === nPages ? "opacity-30 cursor-not-allowed" : "hover:bg-light-blue hover:border-light-blue hover:text-white transition-colors cursor-pointer"}`}
                >
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}