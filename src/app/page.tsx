"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";
import { SplitText } from "gsap/SplitText";
import { RiNextjsFill } from "react-icons/ri";
import { SiExpress, SiMongodb, SiPrisma } from "react-icons/si";
import { FaNodeJs, FaReact } from "react-icons/fa";

const Homepage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);

    const timeout = setTimeout(() => {

      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        /** --- SplitText Animation --- **/
        if (nameRef.current) {
          const split = new SplitText(nameRef.current, { type: "chars" });

          tl.fromTo(
            ".intro-text",
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
            "+=0.25"
          )
            .from(
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
            .fromTo(
              ".hero-image",
              { x: -10, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.5, ease: "expo.in" },
              "+=0.25"
            )
            .fromTo(
              ".hero-subtitle",
              { y: -50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
              "+=0.25"
            )
            .fromTo(
              ".hero-paragraph",
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

          // Cleanup SplitText safely and global cleanup
          return () => {
            split.revert();
            ctx.revert();
          }
        }
      }, containerRef);

    }, 100)

  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-hidden">
      <div className="flex flex-col gap-6 lg:gap-16 mt-12 lg:mt-28">
        {/* Intro Text */}
        <span className="intro-text text-center text-4xl md:text-5xl">
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
          <div className="h-auto lg:h-fit flex flex-col gap-4 justify-center text-center lg:text-left">
            <div className="flex flex-col gap-4">
              <span ref={nameRef} className="text-4xl md:text-6xl font-semibold">
                meet&nbsp;<span className="text-mytheme">Abdullah</span>
              </span>
              <h2 className="hero-subtitle relative text-2xl md:text-4xl font-medium flex flex-col gap-4 justify-center lg:justify-start">
                <span>Fullstack Developer</span>
                <div className="flex justify-center lg:justify-start gap-4">
                  <RiNextjsFill /><SiMongodb /><SiExpress /><FaReact /><FaNodeJs /><SiPrisma />
                </div>
              </h2>
              <p className="hero-paragraph md:text-md">
                Crafting web experiences that leave a lasting impression. With MERN stack and Next.js, I build sleek, powerful fullstack apps that are as intuitive as they are robust.
              </p>
            </div>

            {/* Buttons */}
            <div className="button-block flex justify-center lg:justify-start gap-4 text-sm">
              <TransitionLink
                href="/about"
                className="ring hover:bg-black dark:hover:bg-white dark:text-white text-black hover:text-white dark:hover:text-black p-2"
              >
                Learn more
              </TransitionLink>
              <TransitionLink
                href="/projects"
                className="ring hover:bg-black dark:hover:bg-white dark:text-white text-black hover:text-white dark:hover:text-black p-2"
              >
                My work
              </TransitionLink>
              <TransitionLink
                href="/contact"
                className="ring hover:bg-black dark:hover:bg-white dark:text-white text-black hover:text-white dark:hover:text-black p-2"
              >
                Work with me
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;