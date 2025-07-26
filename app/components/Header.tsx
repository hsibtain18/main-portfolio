// components/Header.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { currencies } from '../constant/experienceData';
 

export default function Header() {
  const { theme, setTheme } = useTheme();
  const iconRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState(currencies[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: 0, scale: 1 },
        { rotate: 360, scale: 1.2, duration: 0.4, ease: 'power2.inOut' }
      );
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-white">📊 Dashboard</h1>

      <div className="flex items-center gap-3 sm:gap-5 ml-auto relative">
        {/* Currency Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <img src={currency.flag} alt={currency.code} className="h-4 w-5 object-cover" />
            <span>{currency.code}</span>
            <ChevronDown size={14} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 z-50 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              {currencies.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setCurrency(item);
                    setOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-left text-gray-800 dark:text-gray-100"
                >
                  <img src={item.flag} alt={item.code} className="h-4 w-5 mr-2 object-cover" />
                  <div>
                    <div className="font-medium">{item.code}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Login/Signup */}
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
        >
          Sign Up
        </Link>

        {mounted && (
          <button
            ref={iconRef}
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </div>
    </header>
  );
}
