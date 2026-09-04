import React from 'react';

interface StatCardProps {
  iconType: 'football' | 'basketball' | 'analytics' | 'model';
  value: string;
  label: string;
}

const IconComponent = ({ type }: { type: string }) => {
  switch(type) {
    case 'football':
      return (
        <svg className="w-14 h-14" style={{ width: '56px', height: '56px' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="footballGrad" cx="35%" cy="35%">
              <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
              <stop offset="70%" style={{stopColor: '#F5F5F5', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#D0D0D0', stopOpacity: 1}} />
            </radialGradient>
            <filter id="shadowFootball" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#footballGrad)" filter="url(#shadowFootball)" stroke="#999" strokeWidth="0.5"/>
          <path d="M50 15 L55 28 L68 28 L58 36 L62 49 L50 41 L38 49 L42 36 L32 28 L45 28 Z" fill="#333333"/>
          <ellipse cx="50" cy="50" rx="38" ry="36" fill="none" stroke="#999" strokeWidth="0.5" opacity="0.4"/>
          <path d="M30 45 Q50 40 70 45" stroke="#999" strokeWidth="0.5" opacity="0.3" fill="none"/>
        </svg>
      );
    case 'basketball':
      return (
        <svg className="w-14 h-14" style={{ width: '56px', height: '56px' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="basketballGrad" cx="30%" cy="30%">
              <stop offset="0%" style={{stopColor: '#FFB84D', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#FF8C00', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#E67E00', stopOpacity: 1}} />
            </radialGradient>
            <filter id="shadowBasketball" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35"/>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#basketballGrad)" filter="url(#shadowBasketball)" stroke="#000" strokeWidth="1"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#000" strokeWidth="2"/>
          <line x1="50" y1="8" x2="50" y2="92" stroke="#000" strokeWidth="1.5"/>
          <line x1="8" y1="50" x2="92" y2="50" stroke="#000" strokeWidth="1.5"/>
          <path d="M 25 32 Q 50 22 75 32" stroke="#000" strokeWidth="1.2" fill="none"/>
          <path d="M 25 68 Q 50 78 75 68" stroke="#000" strokeWidth="1.2" fill="none"/>
          <circle cx="50" cy="35" r="2" fill="#000"/>
        </svg>
      );
    case 'analytics':
      return (
        <svg className="w-14 h-14" style={{ width: '56px', height: '56px' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadowAnalytics" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.25"/>
            </filter>
          </defs>
          <g filter="url(#shadowAnalytics)">
            <rect x="12" y="48" width="14" height="38" fill="url(#grad1)" rx="2" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#10B981', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#059669', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#DB2777', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#2563EB', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <rect x="34" y="28" width="14" height="58" fill="url(#grad2)" rx="2" />
            <rect x="56" y="18" width="14" height="68" fill="url(#grad3)" rx="2" />
            <rect x="78" y="38" width="14" height="48" fill="url(#grad1)" rx="2" />
          </g>
        </svg>
      );
    case 'model':
      return (
        <svg className="w-14 h-14" style={{ width: '56px', height: '56px' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="modelGrad" cx="35%" cy="35%">
              <stop offset="0%" style={{stopColor: '#6EE7B7', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#34D399', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 1}} />
            </radialGradient>
            <filter id="shadowModel" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35"/>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#modelGrad)" filter="url(#shadowModel)" stroke="#059669" strokeWidth="1"/>
          <circle cx="50" cy="50" r="30" fill="#34D399" opacity="0.7"/>
          <circle cx="50" cy="50" r="15" fill="#6EE7B7" opacity="0.5"/>
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.8"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function StatCard({ iconType, value, label }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-5 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-xl h-28 flex flex-col items-center justify-center">
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex-shrink-0 mb-2">
          <IconComponent type={iconType} />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="text-4xl font-bold text-white" style={{ fontSize: '36px' }}>{value}</p>
          <p className="text-lg text-gray-400 font-light mt-1" style={{ fontSize: '18px' }}>{label}</p>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl" />
    </div>
  );
}
