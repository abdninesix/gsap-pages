"use client"

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { projects } from "@/components/Slides";
import Card from "@/components/Card";

const Projectspage = () => {

  const [openCard, setOpenCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline();

    // 1. Page entrance animation
    tl.fromTo(
      containerRef.current,
      { y: "-200vh" },
      { y: "0%", duration: 1, ease: "power2.out" }
    )
    // 2. Animate the main title
    .fromTo(
      ".portfolio-title",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "+=0.25" // Starts after the page slides in
    )
    // 3. Animate the project cards with a stagger effect
    .fromTo(
      ".project-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      "-=0.25" // Overlaps slightly with the title animation
    );

  }, []);

  return (
    <div ref={containerRef} className="h-full">
      <div className="h-full overflow-y-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-mytheme p-4 sm:px-8 md:px-12 lg:px-20 xl:px-40">

        <div className="portfolio-title h-[calc(100vh-6rem)] flex flex-col items-center justify-center text-6xl md:text-8xl text-center">My work</div>

        <div className="grid gap-5 justify-items-center items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.flat().map((project, index) => (
            // Added a class here for GSAP to target
            <div key={project.alt} className="project-card w-full">
              <Card
                image={project.src}
                alt={project.alt}
                title={project.title}
                cat={project.cat}
                desc={project.desc}
                link={project.link}
                isOpen={openCard === index}
                onToggle={() => setOpenCard(openCard === index ? null : index)}
              />
            </div>
          ))}
        </div>

        <div className="w-full mt-10 flex flex-col items-center justify-center">
          <div className="w-fit p-2 flex flex-col items-start">
            <div className="flex gap-2">
              <svg className="w-5 h-5 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <p className="font-semibold">Work In Progress</p>
            </div>
            <p className="text-sm">Some features in my showcased projects are still under development and may not function as expected. I&apos;m actively working to improve them. Thank you for your understanding!</p>
          </div>
        </div>

        <div className="h-screen flex flex-col gap-5 items-center justify-center text-center">
          <h1 className="text-4xl">Want to start your projects?</h1>
          <Link href="/Contact" className="bg-mytheme hover:bg-black dark:hover:bg-gray-200 dark:hover:text-black text-white rounded-md p-2">Let&apos;s work</Link>
        </div>

      </div>

    </div>
  )
}

export default Projectspage;