'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

// Define the types for the component's props
interface CardProps {
    image: string;
    alt: string;
    title: string;
    desc: string;
    cat: string;
    link: string;
    isOpen: boolean;
    onToggle: () => void;
}

const Card = ({ image, alt, title, desc, cat, link, isOpen, onToggle }: CardProps) => {
    const descRef = useRef<HTMLParagraphElement>(null);
    const isFirstRender = useRef(true);

    useLayoutEffect(() => {
        // On the very first render, we don't want to animate.
        // We just immediately set the height based on the initial `isOpen` state.
        // This prevents a flicker of the description text on page load.
        if (isFirstRender.current) {
            gsap.set(descRef.current, { height: isOpen ? 'auto' : 0 });
            isFirstRender.current = false;
            return;
        }

        // On subsequent renders (when `onToggle` is clicked), we animate the height.
        if (isOpen) {
            // Animate from 0 to its natural height
            gsap.to(descRef.current, {
                height: 'auto',
                duration: 0.3,
                ease: 'power2.out',
            });
        } else {
            // Animate from its natural height back to 0
            gsap.to(descRef.current, {
                height: 0,
                duration: 0.3,
                ease: 'power2.in',
            });
        }
    }, [isOpen]);

    return (
        <div
            className="flex flex-col max-w-[25rem] gap-3 p-3 bg-mytheme shadow-lg duration-200"
        >
            <Image
                src={image}
                alt={alt}
                width={800}
                height={450}
                priority
                className="rounded-xl object-cover w-full h-fit"
            />
            <div className='flex justify-between'>
                <div className='flex flex-col gap-2'>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <span className='px-1 w-fit bg-white text-black font-semibold rounded-md text-xs'>{cat}</span>
                </div>
                <Link
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 ring hover:bg-black dark:hover:text-black text-white p-2 h-fit w-fit"
                >
                    Demo
                </Link>
            </div>
            {/* The paragraph is now always in the DOM. Its visibility is controlled by its height. */}
            <p
                ref={descRef}
                className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden"
            >
                {desc}
            </p>
            <button
                onClick={onToggle}
                className="text-xs font-semibold text-blue-500 hover:underline w-fit"
            >
                {isOpen ? 'Hide' : 'Read more'}
            </button>
        </div>
    );
};

export default Card;