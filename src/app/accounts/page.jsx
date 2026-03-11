"use client";
// ---------------------------------------------------------------
// src/app/accounts/page.jsx  →  route: /accounts
// Shows a searchable, paginated table of all accounts.
// ---------------------------------------------------------------

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FiEdit, FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";

// Mock data — replace with API fetch later
const MOCK_ACCOUNTS = [
  { id: 1, fullName: "Abebe Kebede", username: "akebede", phoneNumber: "+251 91 123 4567", email: "abebe.k@mail.com", role: "teacher" },
  { id: 2, fullName: "Sara Tesfaye", username: "stefsaye", phoneNumber: "+251 92 234 5678", email: "sara.t@mail.com", role: "parent" },
  { id: 3, fullName: "Mulugeta Haile", username: "mhaile", phoneNumber: "+251 93 345 6789", email: "mulu.h@mail.com", role: "moderator" },
  { id: 4, fullName: "Tigist Belay", username: "tbelay", phoneNumber: "+251 94 456 7890", email: "tigist.b@mail.com", role: "teacher" },
  { id: 5, fullName: "Dawit Yohannes", username: "dyohannes", phoneNumber: "+251 95 567 8901", email: "dawit.y@mail.com", role: "parent" },
  { id: 6, fullName: "Etenesh Walelign", username: "ewalelign", phoneNumber: "+251 96 678 9012", email: "etenesh.w@mail.com", role: "teacher" },
  { id: 7, fullName: "Samuel Getachew", username: "sgetachew", phoneNumber: "+251 97 789 0123", email: "sammy.g@mail.com", role: "moderator" },
  { id: 8, fullName: "Hiwot Alemu", username: "halemu", phoneNumber: "+251 98 890 1234", email: "hiwot.a@mail.com", role: "parent" },
];

const RECORDS_PER_PAGE = 5;

export default function AccountsPage() {
  const [accounts] = useState(MOCK_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAccounts = accounts.filter((acc) =>
    acc.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
              {/* Link to the Add Account page */}
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
                <table className="w-full text-center text-dark-blue border-collapse">
                  <thead>
                    <tr className="border-b-2 border-medium-cream text-sm uppercase font-bold">
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((account) => (
                        <tr key={account.id} className="border-t-2 border-cream hover:bg-cream font-medium">
                          <td className="p-4">{account.fullName}</td>
                          <td className="p-4">{account.username}</td>
                          <td className="p-4">{account.phoneNumber}</td>
                          <td className="p-4">{account.email}</td>
                          <td className="p-4">{account.role}</td>
                          <td className="p-4">
                            <button className="text-light-blue cursor-pointer">
                              <FiEdit size={24} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-10 text-gray-400 italic">
                          No accounts match "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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