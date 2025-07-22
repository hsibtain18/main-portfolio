 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Skills", href: "#techStack" },
  { label: "Work", href: "#resume" },
  { label: "Projects", href: "#pastProject" },
  { label: "Contact", href: "#contact" },
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Resume",
    href: "/Syed_Hassan_Sibtain.pdf",
    isButton: true,
    download: "Syed Hassan Sibtain.pdf",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Auto-close mobile nav on scroll
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);
  if (!mounted) return null;

  return (
    <header className="w-full shadow-sm bg-header sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Syed Hassan Sibtain
        </Link>

        {/* Right Controls (nav + theme toggle + menu) */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) =>
              link.isButton ? (
                <a
                  key={link.label}
                  href={link.href}
                  download={link.download}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                    border border-blue-600 text-blue-600
                    hover:bg-blue-600 hover:text-white
                    transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                    dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900
                    text-sm font-medium shadow-sm hover:shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-blue-600 transition"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
 
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button> 
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:text-blue-600 transition p-2 rounded-full"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
 
         
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 px-4 pb-4">
          <nav className="flex flex-col gap-3 mt-2">
            {navLinks.map((link) =>
              link.isButton ? (
                <a
                  key={link.label}
                  href={link.href}
                  download={link.download}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                    border border-blue-600 text-blue-600
                    hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                    dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900
                    text-sm font-medium shadow-sm hover:shadow-md w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}