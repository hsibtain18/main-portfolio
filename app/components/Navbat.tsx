"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Resume", href: "#resume" },
  { label: "Projects", href: "#pastProject" },
  { label: "Contact", href: "/" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <header className="w-full shadow-sm bg-header sticky top-0 z-50 mx-auto ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Syed Hassan Sibtain
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="  hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="  hover:text-blue-600 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden  "
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 px-4 pb-4">
          <nav className="flex flex-col gap-3 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mt-4"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
