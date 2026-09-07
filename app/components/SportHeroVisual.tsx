import Image from 'next/image';

interface SportHeroVisualProps {
  imageSrc: string;
  alt: string;
  width: number;
  height: number;
}

export default function SportHeroVisual({ imageSrc, alt, width, height }: SportHeroVisualProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
        }}
        priority
      />
    </div>
  );
}
