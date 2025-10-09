"use client"

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { FaCaretDown } from "react-icons/fa";
import ProjectStack from "@/components/ProjectStack";
import { projects } from "@/utils/data";
import { MdErrorOutline } from "react-icons/md";
import TransitionLink from "@/components/TransitionLink";

const Projectspage = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);

    const ctx = gsap.context(() => {

      setTimeout(() => {
        const tl = gsap.timeline();

        if (titleRef.current) {
          const split = new SplitText(titleRef.current, { type: "chars, words" });
          tl.from(split.chars, {
            y: 1000,
            scale: 20,
            opacity: 0,
            stagger: 0.1,
            ease: "back.in",
          }, "+=0.25")
            .from(".scroll-icon", { y: -40, opacity: 0, duration: 0.5 }, "+=0.2");
        }
      }, 50);

    }, containerRef);

    return () => ctx.revert(); // Cleanup

  }, []);

  return (
    <div ref={containerRef} className="overflow-x-clip">

      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <span ref={titleRef} className="text-4xl md:text-6xl font-semibold">My work collection</span>
        <FaCaretDown className="scroll-icon animate-bounce size-8" />
      </div>

      <div className="min-h-screen px-4 sm:px-14 py-40">
        <ProjectStack projects={projects} />
        <div className="w-full flex flex-col items-start mt-20">
          <div className="flex gap-2 items-center">
            <MdErrorOutline className="size-5" />
            <p className="text-lg font-semibold">Work In Progress</p>
          </div>
          <p className="text-sm">Some features in my showcased projects are still under development and may not function as expected. I&apos;m actively working to improve them. Thank you for your understanding!</p>
        </div>
      </div>

      <div className="h-screen flex flex-col gap-5 items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-semibold">Want a project?</h1>
        <TransitionLink href="/contact" className="ring hover:bg-black dark:hover:bg-white dark:text-white text-black hover:text-white dark:hover:text-black p-2">Let&apos;s work</TransitionLink>
      </div>

    </div>
  )
}

export default Projectspage;