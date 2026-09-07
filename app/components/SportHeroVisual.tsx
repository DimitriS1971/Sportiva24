import Image from 'next/image';

interface SportHeroVisualProps {
  imageSrc: string;
  alt: string;
  width: number;
  height: number;
}

export default function SportHeroVisual({ imageSrc, alt, width, height }: SportHeroVisualProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[32px] border border-blue-500/25 bg-slate-950/80 shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
      <Image src={imageSrc} alt={alt} width={width} height={height} className="h-auto w-full" priority />
    </div>
  );
}
