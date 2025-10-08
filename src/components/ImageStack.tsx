"use client";

import { useRef } from "react";
import Image from "next/image";

interface ImageStackProps {
    images: string[];
}

export default function ImageStack({ images }: ImageStackProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 items-start justify-center">
            {images.map((src, i) => (
                <div
                    key={i}
                    className="stack-img relative -mr-40 rotate-6 flex flex-col  hover:rotate-6 hover:-translate-y-10 justify-center cursor-pointer duration-200"
                    style={{ zIndex: i + 1, }}
                >
                    <Image src={src} alt={`Stack image ${i}`} width={800} height={450} priority className="h-auto w-full object-contain select-none" />
                </div>
            ))}
        </div>
    );
}
