'use client';

import Link from 'next/link';

export default function HeroNew() {
  return (
    <section className="w-full bg-black relative overflow-hidden px-4 md:px-12 pt-24 pb-4 md:pt-24 md:pb-5">
      <div className="absolute inset-0 opacity-75">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_26%,rgba(30,58,138,0.24),transparent_38%),radial-gradient(circle_at_80%_55%,rgba(37,99,235,0.2),transparent_42%),linear-gradient(to_bottom,rgba(2,6,23,0.9),rgba(2,6,23,1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_1.38fr] gap-6 lg:gap-7 items-center">
          <div className="space-y-6">
            <h1 className="text-[2.3rem] sm:text-[3.7rem] md:text-[4.3rem] font-bold text-white leading-[0.98] tracking-tight max-w-[640px]">
              La plataforma líder en
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Inteligencia Deportiva</span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-lg">
              Analizamos miles de variables, estadísticas e inteligencia artificial para ayudarte a comprender mejor cada partido.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-1">
              <Link href="/analisis" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold h-12 px-7 rounded-xl transition-all shadow-[0_10px_28px_rgba(37,99,235,0.38)] flex items-center justify-center gap-2 whitespace-nowrap">
                Ver análisis de hoy
                <span>→</span>
              </Link>
              <Link href="/match" className="border border-blue-500/65 bg-blue-500/5 text-blue-300 hover:bg-blue-500/15 font-semibold h-12 px-7 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                Explorar partidos
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-2xl pt-1">
              <div className="flex items-center gap-2.5 px-1 py-1">
                <span className="w-7 h-7 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 flex items-center justify-center text-xs">✦</span>
                <div>
                  <p className="text-sm text-gray-200 font-semibold leading-none">IA Avanzada</p>
                  <p className="text-xs text-gray-500 mt-1">Modelos predictivos</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-1 py-1">
                <span className="w-7 h-7 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 flex items-center justify-center text-xs">◴</span>
                <div>
                  <p className="text-sm text-gray-200 font-semibold leading-none">Estadísticas</p>
                  <p className="text-xs text-gray-500 mt-1">En tiempo real</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-1 py-1">
                <span className="w-7 h-7 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 flex items-center justify-center text-xs">◎</span>
                <div>
                  <p className="text-sm text-gray-200 font-semibold leading-none">Cobertura Global</p>
                  <p className="text-xs text-gray-500 mt-1">Múltiples deportes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[340px] md:h-[430px] lg:h-[470px] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[99%] h-[95%] rounded-[24px] border border-blue-500/25 bg-gradient-to-br from-blue-500/8 via-transparent to-blue-700/18 backdrop-blur-sm" />
              <div className="absolute w-96 h-96 bg-blue-500/24 rounded-full blur-3xl" />
            </div>
            <img
              src="/hero/hero-portada.png"
              alt="Visual IA deportiva"
              className="relative z-10 w-[99%] h-[95%] object-cover"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
