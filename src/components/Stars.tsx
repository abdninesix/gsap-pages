"use client";

import React, { useEffect, useState } from "react";

interface Star {
    id: number;
    top: string;
    left: string;
    delay: number;
    duration: number;
    fadeInDelay: number;
}

const Stars = ({ count }: { count: number }) => {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: count }, (_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 5,
            duration: 2 + Math.random() * 3,
            fadeInDelay: Math.random() * 10,
        }));
        setStars(generated);
    }, []); // runs only on client

    return (
        <div className="absolute inset-0 pointer-events-none -z-20 hidden dark:block">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="bg-white rounded-full opacity-0 star fade-in"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: "2px",
                        height: "2px",
                        position: "absolute",
                        animationDelay: `${star.fadeInDelay}s, ${star.delay + star.fadeInDelay
                            }s`,
                        animationDuration: `1s, ${star.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Stars;
