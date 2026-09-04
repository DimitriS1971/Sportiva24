import React from 'react';

export default function Hero() {
  return (
    <div className="relative w-full bg-black pt-12 pb-10 px-4 md:px-8">
      {/* Grid decorativo sutil */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 mx-auto" style={{ maxWidth: '900px' }}>
        <div>
          {/* Título principal */}
          <h1 className="text-5xl font-bold text-white tracking-tight leading-[1.05]">
            Centro de Inteligencia Deportiva
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xl text-gray-400 font-normal max-w-2xl mt-4 leading-relaxed">
            Análisis deportivos basados en datos e inteligencia artificial.
          </p>
        </div>
      </div>
    </div>
  );
}
