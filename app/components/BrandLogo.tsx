import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function BrandLogo({ className = '', width = 220, height = 58 }: BrandLogoProps) {
  return (
    <Image
      src="/hero/logoS24.png"
      alt="Sportiva24"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      priority
    />
  );
}
