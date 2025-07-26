// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, Package,  Menu, X, Newspaper, MessageSquareHeart } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'News', icon: Newspaper, href: '/orders' },
  { name: 'Wishlist', icon: MessageSquareHeart, href: '/orders' },
  { name: 'Wallet', icon: Package, href: '/products' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="lg:hidden p-4 border-b dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-lg font-bold">Dashboard</span>
      </div>

      {/* Sidebar Content */}
      <aside
        className={clsx(
          'lg:static lg:translate-x-0 fixed top-0 left-0 z-50 h-full lg:h-auto w-64 bg-gray-100 dark:bg-gray-900 p-6 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-10">🚀 My Admin</div>
        <nav className="space-y-3">
          {navItems.map(({ name, icon: Icon, href }) => (
            <Link
              key={name}
              href={href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)} // close menu on mobile
            >
              <Icon size={18} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-30 lg:hidden z-40"
        />
      )}
    </>
  );
}
