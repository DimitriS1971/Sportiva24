interface HeroCropIconProps {
  source: string;
  alt: string;
  className?: string;
}

export default function HeroCropIcon({ source, alt, className = '' }: HeroCropIconProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={`relative inline-flex overflow-hidden rounded-full border border-blue-300/45 bg-slate-950 shadow-[0_0_18px_rgba(37,99,235,0.35)] ${className}`}
      style={{ backgroundImage: `url("${source}")`, backgroundPosition: 'center', backgroundSize: '235% auto' }}
    />
  );
}
