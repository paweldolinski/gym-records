import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ImageWithFallbackProps {
	src?: string;
	fallbackSrc: string;
	width: number;
	height: number;
	alt: string;
}

export const ImageWithFallback = ({
	src,
	fallbackSrc,
	width,
	height,
	alt,
}: ImageWithFallbackProps) => {
	const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

	return (
		<div className="nav__avatar">
			<Image
				src={imgSrc}
				onError={() => setImgSrc(fallbackSrc)}
				width={width}
				height={height}
				alt={alt}
			/>
		</div>
	);
};
