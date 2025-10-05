"use client"

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Card from "@/components/Card";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdErrorOutline } from "react-icons/md";
import TransitionLink from "@/components/TransitionLink";
import { projects } from "@/utils/data";
import { FaCaretDown } from "react-icons/fa";

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
        ).fromTo(
          ".scroll-icon",
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
          "+=0.25"
        );
      }

      gsap.set(".project-card", { autoAlpha: 0, x: -100, rotate: -15 });

      ScrollTrigger.batch(".project-card", {
        scroller: containerRef.current,
        start: "top 85%",
        onEnter: batch => gsap.to(batch, {
          autoAlpha: 1,
          x: 0,
          rotate: 0,
          stagger: 0.1,
          ease: "expo.in",
          overwrite: true // Prevent conflicts
        }),
      });

    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-y-scroll overflow-x-clip scrollbar-none">

      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <span ref={titleRef} className="text-4xl md:text-6xl font-semibold">My&nbsp; work</span>
        <FaCaretDown className="scroll-icon animate-bounce size-8" />
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.flat().map((project, index) => (
          <div key={project.alt} className="project-card">
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
        <h1 className="text-4xl md:text-6xl font-semibold">Want to build yours?</h1>
        <TransitionLink href="/contact" className="ring hover:bg-black dark:hover:bg-white dark:text-white text-black hover:text-white dark:hover:text-black p-2">Let&apos;s work</TransitionLink>
      </div>
    </div>
  )
}

export default Projectspage;