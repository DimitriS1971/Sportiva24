import Image from 'next/image';

interface SportHeroVisualProps {
  imageSrc: string;
  alt: string;
  width: number;
  height: number;
}

const iconByHero: Record<string, string> = {
  futbol: '/icons/football-premium.svg',
  basketball: '/icons/basketball-premium.svg',
  tenis: '/icons/tennis-premium.svg',
  f1: '/icons/f1-premium.svg',
  ciclismo: '/icons/cycling-premium.svg',
  beisbol: '/icons/baseball-premium.svg',
  egames: '/icons/egames-premium.svg',
  mas: '/icons/more-premium.svg',
};

function sportKey(imageSrc: string): string {
  return Object.keys(iconByHero).find((key) => imageSrc.includes(`/${key}/`)) ?? 'futbol';
}

export default function SportHeroVisual({ imageSrc, alt, width, height }: SportHeroVisualProps) {
  const icon = iconByHero[sportKey(imageSrc)];

  return (
    <div className="relative aspect-[1.3] w-full overflow-hidden rounded-[32px] border border-blue-500/25 bg-[#030a1e] shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_46%,rgba(30,91,255,0.28),transparent_38%),linear-gradient(135deg,#030a1e,#020617_60%,#06163a)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(30,58,138,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute left-[13%] top-[17%] text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200/80">Malla de inteligencia</div>
      <div className="absolute left-[13%] top-[25%] h-px w-[45%] bg-gradient-to-r from-blue-400/0 via-blue-300/80 to-emerald-400/70 shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
      <div className="absolute left-[18%] top-[26%] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_14px_#60a5fa]" />
      <div className="absolute left-[58%] top-[25%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_#34d399]" />
      <div className="absolute left-[10%] bottom-[18%] h-px w-[56%] rotate-[-14deg] bg-gradient-to-r from-blue-400/0 via-blue-300/80 to-emerald-400/70 shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
      <div className="absolute left-[18%] top-[36%] h-[38%] w-[38%] rounded-full border border-blue-300/35 shadow-[0_0_38px_rgba(37,99,235,0.35)]" />
      <div className="absolute left-[22%] top-[40%] flex h-[30%] w-[30%] items-center justify-center rounded-full border border-slate-600/50 bg-slate-950/70 p-6 shadow-[0_0_45px_rgba(37,99,235,0.28)]">
        <Image src={icon} alt={alt} width={width} height={height} className="h-full w-full object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.7)]" priority />
      </div>
      <div className="absolute right-[10%] top-[24%] w-[24%] rounded-2xl border border-blue-300/25 bg-slate-950/75 p-4">
        <p className="text-[9px] uppercase tracking-[0.18em] text-blue-200/80">Señal de rendimiento</p>
        <div className="mt-3 space-y-2"><div className="h-2 rounded-full bg-blue-950"><div className="h-2 w-[78%] rounded-full bg-blue-400" /></div><div className="h-2 rounded-full bg-blue-950"><div className="h-2 w-[54%] rounded-full bg-emerald-400" /></div><div className="h-2 rounded-full bg-blue-950"><div className="h-2 w-[66%] rounded-full bg-amber-400" /></div></div>
      </div>
      <div className="absolute bottom-[14%] right-[12%] flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/45 bg-blue-500/10 text-xl font-semibold text-blue-100 shadow-[0_0_28px_rgba(37,99,235,0.35)]">S24</div>
    </div>
  );
}
