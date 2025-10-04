"use client"

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { projects } from "@/components/Slides";
import Card from "@/components/Card";
import { PiMouseScroll } from "react-icons/pi";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Projectspage = () => {

  const [openCard, setOpenCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {

      const tl = gsap.timeline();

      tl.fromTo(
        containerRef.current,
        { y: "-200vh" },
        { y: "0%", duration: 1, ease: "power2.out" }
      );

      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars, words" });
        tl.from(split.chars, {
          opacity: 0,
          y: 80,
          scale: 1.5,
          stagger: 0.05,
          duration: 0.5,
          ease: "back.out",
        }, "+=0.25"); // Start after the page slides in
      }
      gsap.from(".project-card", {
        opacity: 0,
        y: 100,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.2, // Animate cards one after another
        scrollTrigger: {
          trigger: ".grid-container", // The element that triggers the animation
          start: "top 80%", // Start animation when top of trigger hits 80% of viewport height
          toggleActions: "play none none none", // Play the animation once and don't replay
        }
      });

    }, containerRef);

    return () => ctx.revert(); //Cleanup

  }, []);

  return (
    <div ref={containerRef} className="h-full">
      <div className="h-full">

        <span ref={titleRef} className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-6xl md:text-8xl">My work<PiMouseScroll className="animate-bounce size-12" /></span>

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