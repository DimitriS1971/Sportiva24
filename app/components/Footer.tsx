'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Producto: [
      { label: 'Todos', href: '/todos' },
      { label: 'Fútbol', href: '/futbol' },
      { label: 'Basketball', href: '/basketball' },
      { label: 'E-games', href: '/egames' },
      { label: 'Más', href: '/mas' },
      { label: 'Análisis', href: '/analisis' },
      { label: 'Premium', href: '/premium' },
    ],
    Empresa: [
      { label: 'Sobre nosotros', href: '/sobre-nosotros' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contacto', href: '/contacto' },
      { label: 'Carreras', href: '/carreras' },
    ],
    Legal: [
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos', href: '/terminos' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  return (
    <footer className="bg-black border-t border-blue-950/45">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-14">
          <div className="space-y-4">
            <BrandLogo className="h-10 w-[190px]" />
            <p className="text-sm text-gray-400 font-normal leading-relaxed max-w-xs">
              Inteligencia deportiva basada en datos e inteligencia artificial.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-[0.12em]">Producto</h4>
            <ul className="space-y-2">
              {footerLinks.Producto.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-[0.12em]">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.Empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-[0.12em]">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.Legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/70 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400 font-medium">
            © {currentYear} Sportiva24. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="text-sm">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="text-sm">LinkedIn</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="text-sm">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
