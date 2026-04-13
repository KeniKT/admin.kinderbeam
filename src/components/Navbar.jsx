"use client";
// ---------------------------------------------------------------
// src/components/Navbar.jsx
// Shared navbar — responsive with hamburger menu on mobile.
// ---------------------------------------------------------------

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavbarLink from "./NavbarLink";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-cream px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between w-full">

        {/* Logo */}
        <div className="flex flex-col text-dark-blue">
          <h1 className="text-2xl sm:text-3xl tracking-tight">
            <span className="font-bold">Kinder</span>
            <span className="font-normal">Beam</span>
          </h1>
          <p className="font-bold text-dark-cream text-xs sm:text-sm">Admin Portal</p>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex flex-row items-center gap-8 lg:gap-16">
          <NavbarLink linkName="Dashboard" linkPath="/dashboard" />
          <NavbarLink linkName="Accounts"  linkPath="/accounts"  />
          <NavbarLink linkName="Students"  linkPath="/students"  />
        </div>

        {/* Desktop user + logout */}
        <div className="hidden md:flex flex-row items-end gap-4 font-bold">
          <div className="flex flex-col text-right gap-2">
            <p className="text-dark-blue text-sm">Admin Name</p>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-1 bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
          <div className="size-12 bg-white border border-dark-cream rounded-lg"></div>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-dark-blue"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 border-t border-medium-cream pt-4">
          <div onClick={() => setMenuOpen(false)}>
            <NavbarLink linkName="Dashboard" linkPath="/dashboard" />
          </div>
          <div onClick={() => setMenuOpen(false)}>
            <NavbarLink linkName="Accounts"  linkPath="/accounts"  />
          </div>
          <div onClick={() => setMenuOpen(false)}>
            <NavbarLink linkName="Students"  linkPath="/students"  />
          </div>
          <div className="flex flex-row items-center justify-between pt-2 border-t border-medium-cream">
            <p className="text-dark-blue font-bold text-sm">Admin Name</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-light-blue text-white rounded-lg text-sm hover:bg-light-blue/90 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}