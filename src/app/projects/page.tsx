"use client"

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { projects } from "@/components/Slides";
import Card from "@/components/Card";
import { PiMouseScroll } from "react-icons/pi";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdErrorOutline } from "react-icons/md";
import TransitionLink from "@/components/TransitionLink";

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
          y: -1000,
          scale: 10,
          opacity: 25,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.in",
        }, "+=0.25"
        )
          .fromTo(
            ".scroll-icon",
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
            "+=0.25"
          )
      }
      gsap.from(".project-card", {
        opacity: 0,
        y: 100,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.2, // Animate cards one after another
        scrollTrigger: {
          trigger: ".grid-container", // The element that triggers the animation
          start: "top 30%", // Start animation when top of trigger hits 80% of viewport height
          toggleActions: "play none none none", // Play the animation once and don't replay
        }
      });

    }, containerRef);

    return () => ctx.revert(); //Cleanup

  }, []);

  return (
    <div ref={containerRef} className="h-full">

      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <span ref={titleRef} className="text-4xl md:text-6xl font-semibold">My&nbsp; work</span>
        <PiMouseScroll className="scroll-icon animate-bounce size-12" />
      </div>

      <div className="grid-container grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="w-full mt-10 flex flex-col items-start">
        <div className="flex gap-2 items-center">
          <MdErrorOutline className="size-5" />
          <p className="font-semibold">Work In Progress</p>
        </div>
        <p className="text-sm">Some features in my showcased projects are still under development and may not function as expected. I&apos;m actively working to improve them. Thank you for your understanding!</p>
      </div>

      <div className="h-screen flex flex-col gap-5 items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-semibold">Want to start your projects?</h1>
        <TransitionLink href="/contact" className="ring hover:bg-black dark:hover:bg-white dark:text-white text-black hover:text-white dark:hover:text-black p-2">Let&apos;s work</TransitionLink>
      </div>



    </div>
  )
}

export default Projectspage;