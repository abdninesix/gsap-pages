"use client"

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

const Projectspage = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars, words" });
        tl.from(
          split.chars,
          {
            y: 1000,
            scale: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.in",
          },
          "+=0.25"
        )
      }

    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-x-clip scrollbar-none">

      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <span ref={titleRef} className="text-3xl font-semibold">Page&nbsp;under&nbsp;maintenance</span>
      </div>

    </div>
  )
}

export default Projectspage;