import React, { useState } from "react";
import Image from "next/image";

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
		<div className="img">
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
