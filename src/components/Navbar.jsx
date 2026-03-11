"use client";
// ---------------------------------------------------------------
// src/components/Navbar.jsx
// Shared navbar used on every page except Login.
// ---------------------------------------------------------------

import { useRouter } from "next/navigation";
import NavbarLink from "./NavbarLink";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    router.push("/");
  };

  return (
    <nav className="bg-cream px-8 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col text-dark-blue">
          <h1 className="text-3xl tracking-tight">
            <span className="font-bold">Kinder</span>
            <span className="font-normal">Beam</span>
          </h1>
          <p className="font-bold text-dark-cream">Admin Portal</p>
        </div>

        <div className="flex flex-row items-center gap-16">
          <NavbarLink linkName="Dashboard" linkPath="/dashboard" />
          <NavbarLink linkName="Accounts" linkPath="/accounts" />
          <NavbarLink linkName="Students" linkPath="/students" />
        </div>

        <div className="flex flex-row items-end gap-4 font-bold">
          <div className="flex flex-col text-right gap-2">
            <p className="text-dark-blue">Admin Name</p>
            <button
              onClick={handleLogout}
              className="w-full p-1 bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
          <div className="size-16 bg-white border border-dark-cream rounded-lg"></div>
        </div>
      </div>
    </nav>
  );
}