"use client";
// ---------------------------------------------------------------
// src/app/page.jsx  →  route: /
// This is the Login page (the first page users see).
// ---------------------------------------------------------------

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-dark-blue">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome.</h1>
          <p className="text-md font-medium">Enter your username and password.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 font-semibold">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-cream border border-medium-cream rounded-lg text-sm text-dark-blue placeholder-medium-cream focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}