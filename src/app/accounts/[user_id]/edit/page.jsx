"use client";
// ---------------------------------------------------------------
// src/app/accounts/[user_id]/edit/page.jsx  →  route: /accounts/:user_id/edit
// Edit an existing account — loads user data then PATCHes on submit.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const ROLES = [
  { role_id: 1, role_name: "Teacher"   },
  { role_id: 3, role_name: "Moderator" },
  { role_id: 4, role_name: "Parent"    },
];

export default function EditAccountPage() {
  const router      = useRouter();
  const { user_id } = useParams();

  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [username,    setUsername]    = useState("");
  const [email,       setEmail]       = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roleId,      setRoleId]      = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchUser(token);
  }, []);

  const fetchUser = async (token) => {
    setLoadingData(true);
    try {
      // No trailing slash — Next.js strips it before matching the route handler
      const response = await fetch(`/api/users/${user_id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      if (response.status === 401) { localStorage.clear(); router.push("/"); return; }
      if (response.ok) {
        const data = await response.json();
        setFirstName(data.first_name    || "");
        setLastName(data.last_name      || "");
        setUsername(data.username       || "");
        setEmail(data.email             || "");
        setPhoneNumber(data.phone_number || "");
        setRoleId(String(data.role_id)  || "");
      } else {
        setError("Failed to load account.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !username || !email || !phoneNumber || !roleId) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      // No trailing slash here either
      const response = await fetch(`/api/users/${user_id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          first_name:   firstName,
          last_name:    lastName,
          username:     username,
          email:        email,
          phone_number: phoneNumber,
          role_id:      parseInt(roleId),
        }),
      });

      if (response.status === 401) { localStorage.clear(); router.push("/"); return; }
      if (response.ok) {
        router.push("/accounts");
      } else {
        const data = await response.json();
        const firstError = Object.values(data)[0];
        setError(
          typeof firstError === "string" ? firstError
          : Array.isArray(firstError)    ? firstError[0]
          : data.detail || "Failed to update account."
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

          <p className="text-2xl sm:text-3xl font-semibold mb-6">Edit Account</p>

          <div className="bg-cream rounded-2xl p-4 sm:p-6">
            <div className="bg-light-cream rounded-xl p-4 sm:p-6">

              {loadingData ? (
                <div className="py-16 text-center text-dark-cream">Loading account...</div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-normal">
                      {error}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />

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

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />

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

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/accounts")}
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