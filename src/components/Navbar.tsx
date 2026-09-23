'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/features', label: 'Features' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Bharat Niyojak Logo" 
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-primary-700 hover:bg-primary-50/70 rounded-md font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center gap-2.5">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs sm:text-sm text-primary-700 font-semibold border border-primary-200 hover:bg-primary-50 rounded-md transition-all shadow-xs"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2.5 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <div className="px-3">
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-3 py-1.5 text-center text-xs text-primary-700 font-semibold border border-primary-300 rounded-md hover:bg-primary-50 transition-all"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
