"use client";
// ---------------------------------------------------------------
// src/app/accounts/page.jsx  →  route: /accounts
// Shows a searchable, paginated table of all accounts from the API.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FiEdit, FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";

const RECORDS_PER_PAGE = 5;

// Map role_id to readable name
const ROLE_NAMES = {
  1: "Teacher",
  2: "Admin",
  3: "Moderator",
  4: "Parent",
};

export default function AccountsPage() {
  const router = useRouter();

  const [accounts, setAccounts]     = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchAccounts(token);
  }, []);

  const fetchAccounts = async (token) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users/", {
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
        setAccounts(data);
      } else {
        setError("Failed to load accounts.");
      }
    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) =>
    `${acc.first_name} ${acc.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nPages = Math.ceil(filteredAccounts.length / RECORDS_PER_PAGE) || 1;
  const indexOfFirst = (currentPage - 1) * RECORDS_PER_PAGE;
  const currentRecords = filteredAccounts.slice(indexOfFirst, indexOfFirst + RECORDS_PER_PAGE);

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full w-full bg-white text-dark-blue font-semibold items-center">
        <div className="flex flex-col py-4 w-[50%] gap-4">

          {/* Page header */}
          <div className="flex flex-row justify-between items-center h-12">
            <p className="text-3xl">All Accounts</p>
            <div className="flex flex-row gap-4 h-full">
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="px-4 w-64 h-full bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
              />
              <Link href="/accounts/new">
                <button className="flex flex-row items-center gap-2 px-4 h-full bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer">
                  <FiPlus size={22} />
                  <p>Add Account</p>
                </button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col bg-cream w-full rounded-lg p-4 items-center">
              <div className="flex flex-col bg-light-cream w-full items-center rounded-lg p-4 gap-2">

                {loading ? (
                  <div className="p-10 text-center text-dark-cream">Loading accounts...</div>
                ) : error ? (
                  <div className="p-10 text-center text-red-500">{error}</div>
                ) : (
                  <table className="w-full text-center text-dark-blue border-collapse">
                    <thead>
                      <tr className="border-b-2 border-medium-cream text-sm uppercase font-bold">
                        <th className="p-4">Full Name</th>
                        <th className="p-4">Username</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.length > 0 ? (
                        currentRecords.map((account) => (
                          <tr key={account.user_id} className="border-t-2 border-cream hover:bg-cream font-medium transition-colors">
                            <td className="p-4">{account.first_name} {account.last_name}</td>
                            <td className="p-4">{account.username}</td>
                            <td className="p-4">{account.phone_number || "—"}</td>
                            <td className="p-4">{account.email}</td>
                            <td className="p-4">{ROLE_NAMES[account.role_id] || "Unknown"}</td>
                            <td className="p-4">
                              <Link href={`/accounts/${account.user_id}/edit`}>
                                <button className="text-light-blue cursor-pointer hover:text-light-blue/70 transition-colors">
                                  <FiEdit size={24} />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-10 text-gray-400 italic">
                            {searchTerm ? `No accounts match "${searchTerm}"` : "No accounts found"}
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