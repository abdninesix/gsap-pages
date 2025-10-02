"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";
import { SplitText } from "gsap/SplitText";

const Homepage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  useLayoutEffect(() => {
    const tl = gsap.timeline();

    tl
      .fromTo(
        containerRef.current,
        { y: "-200vh" },
        { y: "0%", duration: 1, ease: "power2.out" }
      )
      .fromTo(
        ".intro-text",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
        "+=0.25"
      )
      .fromTo(
        ".hero-image",
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "expo.in" },
        "+=0.25"
      )
      .fromTo(
        ".text-block",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
        "+=0.25"
      )
      .fromTo(
        ".button-block",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
        "+=0.25"
      );

    if (nameRef.current) {
      const split = new SplitText(nameRef.current, { type: "chars" });

      tl.from(split.chars, {
        y: -700,
        scale: 10,
        opacity: 25,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.in",
      }, "+=0.25");

      // cleanup
      return () => {
        split.revert();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col md:justify-center gap-4 md:gap-8 lg:gap-16 h-full overflow-hidden">
      {/* Intro Text */}
      <span className="intro-text text-center text-4xl mt-4 md:mt-0 md:text-5xl">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
      </span>

      <div className="items-center flex flex-col gap-4 md:gap-10 lg:flex-row">
        {/* IMAGE CONTAINER */}
        <div onContextMenu={handleRightClick} className="hero-image group relative flex-none overflow-hidden size-52 lg:size-80 bg-gradient-to-r from-mytheme/0 to-mytheme rounded-full active:rounded-t-full active:rounded-b-none select-none duration-200">
          <div className="group-active:opacity-0 absolute top-[35%] ml-[31.5%] flex gap-1 lg:gap-3 w-fit -rotate-[12deg] z-10 duration-500">
            <div className="h-3 w-5 lg:h-5 lg:w-7 rounded-b-full bg-mytheme" />
            <div className="h-3 w-5 lg:h-5 lg:w-7 rounded-b-full bg-mytheme" />
          </div>
          <Image
            src="/hero.png"
            alt="hero"
            width={500}
            height={500}
            priority
            className="group brightness-0 group-active:brightness-150 duration-500"
          />
        </div>

        {/* TEXT & BUTTON CONTAINER */}
        <div className="h-auto lg:h-fit flex flex-col gap-5 lg:gap-6 justify-center text-center lg:text-left">
          {/* Main Text */}
          <div className="text-block flex flex-col gap-4">
            <span ref={nameRef} className="text-4xl md:text-6xl font-semibold">
              meet&nbsp;<span className="text-mytheme">Abdullah</span>
            </span>
            <h2 className="relative text-2xl md:text-4xl font-medium flex flex-wrap justify-center lg:justify-start">
              <span>
                <span className="text-green-700">M</span>
                <span className="text-gray-500">E</span>
                <span className="text-cyan-600">R</span>
                <span className="text-green-500">N</span>
                <span>&nbsp;Stack</span>
              </span>
              &nbsp;+&nbsp;
              <span>
                NEXT.js
              </span>
              &nbsp;
              <span className="p-1">Developer</span>
            </h2>

            <p className="text-justify md:text-md">
              Crafting web experiences that leave a lasting impression. With MERN stack and Next.js, I build sleek, powerful fullstack apps that are as intuitive as they are robust.
            </p>
          </div>

          {/* Buttons */}
          <div className="button-block flex justify-center lg:justify-start gap-3 lg:gap-4 text-sm">
            <TransitionLink
              href="/about"
              className="bg-mytheme hover:bg-black dark:hover:bg-white dark:hover:text-black text-white p-2"
            >
              About me
            </TransitionLink>
            <TransitionLink
              href="/projects"
              className="bg-mytheme hover:bg-black dark:hover:bg-white dark:hover:text-black text-white p-2"
            >
              My work
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="ring hover:ring-2 p-2"
            >
              Work with me
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
