"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/coaches", label: "Coach" },
  { href: "/schedule", label: "Schedule" },
  { href: "/rosters", label: "Roster" },
  { href: "/leaders", label: "Leadership" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-carleton-blue text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-carleton-maize transition-colors">
          Carleton Club Soccer
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-carleton-maize transition-colors ${
                  pathname === href ? "text-carleton-maize" : "text-blue-200"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/admin"
          className="text-xs font-semibold uppercase tracking-wider bg-carleton-maize hover:opacity-90 text-carleton-blue px-3 py-1.5 rounded transition-opacity"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
