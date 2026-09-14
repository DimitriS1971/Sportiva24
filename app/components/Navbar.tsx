'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SportCode } from '@/lib/domain/entities';
import { isSportActive } from '@/lib/data/config/activeSports';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: Array<{ label: string; href: string; sport?: SportCode }> = [
    { label: 'Fútbol', href: '/futbol', sport: 'football' as const },
    { label: 'Inteligencia Deportiva S24', href: '/centro-inteligencia-s24' },
    { label: 'Análisis', href: '/analisis' },
    { label: 'Noticias', href: '/noticias' },
  ];

  const visibleNavItems = navItems.filter((item) => !item.sport || isSportActive(item.sport));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-xl border-b border-blue-950/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-3xl md:text-4xl font-bold text-white">
                SPORTIVA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">24</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="ml-auto hidden items-center space-x-0.5 md:flex">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-10 ml-auto mr-3 flex h-11 w-11 shrink-0 flex-col items-center justify-center space-y-1.5 rounded-md border border-slate-600 bg-black text-white shadow-lg shadow-black/40 md:hidden"
            aria-label="Abrir menú"
            aria-expanded={isMobileMenuOpen}
          >
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-800 bg-black/95 px-4 pb-5 pt-3 shadow-2xl shadow-black/50 md:hidden">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
