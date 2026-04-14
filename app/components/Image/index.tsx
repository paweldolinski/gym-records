import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  fallbackSrc: string;
  width?: number;
  height?: number;
  alt: string;
  variant?: string;
  onAction?: () => void;
}

export const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  variant,
  onAction,
}: ImageWithFallbackProps) => {
  const validSrc =
    src && (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://"))
      ? src
      : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(validSrc);

  return (
    <div className={`img ${variant}`} onClick={onAction}>
      <Image
        src={imgSrc}
        onError={() => setImgSrc(fallbackSrc)}
        alt={alt}
        fill
        sizes="40px"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};
