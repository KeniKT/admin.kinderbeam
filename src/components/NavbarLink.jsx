"use client";
// ---------------------------------------------------------------
// src/components/NavbarLink.jsx
// A single nav link used inside Navbar.jsx.
// ---------------------------------------------------------------

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarLink({ linkName, linkPath }) {
  const pathname = usePathname(); // current URL path
  const isActive = pathname === linkPath;

  return (
    <Link
      href={linkPath}
      className={`text-dark-blue font-semibold hover:text-light-blue transition-all pb-1 ${
        isActive
          ? "border-b-2 border-light-blue text-light-blue"
          : "border-b-2 border-transparent"
      }`}
    >
      {linkName}
    </Link>
  );
}