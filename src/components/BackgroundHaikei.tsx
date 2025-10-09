"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

const BackgroundHaikei = () => {
    const path1Ref = useRef<SVGPathElement | null>(null);
    const path2Ref = useRef<SVGPathElement | null>(null);

    useEffect(() => {

        const path1 = path1Ref.current;
        const path2 = path2Ref.current;

        if (path1 && path2) {
            // Animate paths with a subtle morph / float effect
            gsap.to([path1, path2], {
                y: 20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 2,
            });
        }

        return () => {
            gsap.killTweensOf([path1, path2]);
        };
    }, []);

    return (
        <div className="absolute inset-0 -z-20 block dark:hidden overflow-hidden pointer-events-none animate-fadeIn">
            <svg
                id="visual"
                viewBox="0 0 900 600"
                className="w-full h-full scale-110"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="0" y="0" width="900" height="600" fill="#eeeeee" />
                <g transform="translate(900, 600)">
                    <path
                        ref={path1Ref}
                        d="M-405.6 0C-390.6 -51.4 -375.6 -102.8 -352 -145.8C-328.3 -188.8 -296 -223.4 -263.8 -263.8C-231.5 -304.1 -199.2 -350.1 -155.2 -374.7C-111.3 -399.3 -55.6 -402.5 0 -405.6L0 0Z"
                        fill="#fbfbfb"
                    />
                </g>
                <g transform="translate(0, 0)">
                    <path
                        ref={path2Ref}
                        d="M405.6 0C404.8 58.2 403.9 116.5 374.7 155.2C345.6 194 288.2 213.2 249.6 249.6C211 286.1 191.2 339.8 152.7 368.6C114.2 397.5 57.1 401.6 0 405.6L0 0Z"
                        fill="#fbfbfb"
                    />
                </g>
            </svg>
        </div>
    );
};

export default BackgroundHaikei;