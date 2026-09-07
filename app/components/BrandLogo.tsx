import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function BrandLogo({ className = '', width = 220, height = 58 }: BrandLogoProps) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <Image
        src="/hero/logoS24.png"
        alt="Sportiva24"
        fill
        sizes={`${width}px`}
        className="object-cover object-center"
        priority
      />
    </span>
  );
}
