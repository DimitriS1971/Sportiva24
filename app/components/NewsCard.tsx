import React from 'react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default function NewsCard({ title, excerpt, date, category }: NewsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between h-full">
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/5 transition-all duration-300" />
      
      <div className="relative z-10 space-y-4">
        {/* Category Badge */}
        <div className="inline-block">
          <span className="text-xs font-semibold text-green-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white leading-tight hover:text-green-400 transition-colors duration-200 cursor-pointer line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-400 font-light line-clamp-2">
          {excerpt}
        </p>

        {/* Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-light pt-2 border-t border-gray-700/50">
          <span>{date}</span>
          <span className="text-green-400 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-green-500 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl" />
    </div>
  );
}
