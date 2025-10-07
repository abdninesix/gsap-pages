"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface ProjectStackProps {
    images: string[];
}

export default function ProjectStack({ images }: ProjectStackProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const zCounter = useRef(images.length);
    const activeIndex = useRef<number | null>(null);

    /** Reset the stack to initial rotated layout */
    const resetStack = () => {
        const container = containerRef.current;
        if (!container) return;

        const imgs = container.querySelectorAll<HTMLDivElement>(".stack-img");
        imgs.forEach((img, i) => {
            gsap.to(img, {
                duration: 0.1,
                rotation: 10,
                scale: 1,
                x: 0,
                y: 0,
                zIndex: i + 1,
                ease: "power2.out",
            });
        });

        activeIndex.current = null;
    };

    /** Handle individual image click */
    const handleClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const container = containerRef.current;
        if (!container) return;

        const imgs = container.querySelectorAll<HTMLDivElement>(".stack-img");
        const clicked = imgs[index];

        // If already active → reset
        if (activeIndex.current === index) return resetStack();

        // Bring to top
        zCounter.current += 1;
        activeIndex.current = index;

        // Get element + viewport positions for centering
        const rect = clicked.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        const offsetX = viewportCenterX - (rect.left + rect.width / 2);
        const offsetY = viewportCenterY - (rect.top + rect.height / 2);

        // Animate clicked image
        gsap.to(clicked, {
            duration: 0.1,
            rotation: 0,
            scale: 2,
            x: offsetX,
            y: offsetY,
            zIndex: zCounter.current,
            ease: "power3.out",
        });

        // Reset others
        imgs.forEach((img, i) => {
            if (i !== index) {
                gsap.to(img, {
                    duration: 0.1,
                    rotation: 10,
                    scale: 1,
                    x: 0,
                    y: 0,
                    ease: "power2.out",
                });
            }
        });
    };

    /** Handle clicks outside the container */
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const container = containerRef.current;
            if (container && !container.contains(e.target as Node)) resetStack();
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    return (
        <div ref={containerRef} className="relative grid gap-y-12 grid-cols-3 lg:grid-cols-4 items-start justify-center pr-20 lg:pr-32">
            {images.map((src, i) => (
                <div
                    key={i}
                    className="stack-img relative cursor-pointer w-48 sm:w-60 md:w-92 aspect-video transition-transform"
                    onClick={(e) => handleClick(i, e)}
                    style={{
                        transform: `rotate(10deg) scale(1)`,
                        zIndex: i + 1,
                    }}
                >
                    <Image
                        src={src}
                        alt={`Stack image ${i}`}
                        fill
                        priority
                        className="h-auto w-auto max-w-[80vw] max-h-[80vh] object-contain select-none"
                    />
                </div>
            ))}
        </div>
    );
}
