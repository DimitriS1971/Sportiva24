'use client';

import Link from 'next/link';

interface StatCardNewProps {
  icon: React.ReactNode;
  value: string;
  title: string;
  detail: string;
  accent: 'blue' | 'orange' | 'violet' | 'green';
  href?: string;
}

const accentStyles = {
  blue: {
    shell: 'from-blue-500/20 to-blue-600/10 border-blue-500/25',
    dot: 'bg-blue-400',
  },
  orange: {
    shell: 'from-orange-500/20 to-amber-500/10 border-orange-500/25',
    dot: 'bg-orange-400',
  },
  violet: {
    shell: 'from-violet-500/20 to-indigo-500/10 border-violet-500/25',
    dot: 'bg-violet-400',
  },
  green: {
    shell: 'from-emerald-500/20 to-green-500/10 border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
};

export default function StatCardNew({ icon, value, title, detail, accent, href }: StatCardNewProps) {
  const style = accentStyles[accent];
  const isNumericValue = /^[0-9.]+$/.test(value.trim());

  const cardContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100" />

      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-300" />

      <div className="relative z-10 flex items-center gap-3.5 w-full">
        <div className={`flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br ${style.shell} transition-all duration-300 backdrop-blur-sm border shrink-0`}>
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className={`${isNumericValue ? 'text-[2.45rem] truncate' : 'text-[1.4rem] whitespace-normal'} text-white font-bold leading-tight tracking-tight`}>
            {value}
          </div>
          <div className="text-sm text-gray-300 font-medium leading-tight mt-1 whitespace-normal">
            {title}
          </div>
          {detail ? (
            <div className="text-xs text-gray-400 font-medium mt-1.5 flex items-center gap-1.5 leading-tight whitespace-normal">
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {detail}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/55 via-gray-950/75 to-black border border-gray-800/80 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-md p-4 md:p-5 flex items-center h-[96px] md:h-[104px] shadow-lg hover:shadow-2xl hover:shadow-blue-500/10"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/55 via-gray-950/75 to-black border border-gray-800/80 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-md p-4 md:p-5 flex items-center h-[96px] md:h-[104px] shadow-lg hover:shadow-2xl hover:shadow-blue-500/10">
      {cardContent}
    </div>
  );
}
