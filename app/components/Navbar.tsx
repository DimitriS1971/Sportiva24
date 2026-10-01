'use client';

import React, { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Fútbol', href: '#' },
    { label: 'Basketball', href: '#' },
    { label: 'Análisis', href: '/analisis' },
    { label: 'Noticias', href: '/noticias' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="text-3xl md:text-4xl font-bold text-white">
                SPORTIVA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">24</span>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 font-light"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/premium"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 font-light"
            >
              Premium
            </a>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col space-y-1.5 w-8 h-8 justify-center items-center"
          >
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-800/50">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 font-light"
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 py-2 border-t border-gray-800/50 mt-2 pt-2 space-y-2">
              <a
                href="/premium"
                className="block text-sm text-gray-300 hover:text-white transition-colors duration-200 font-light py-2"
              >
                Premium
              </a>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
