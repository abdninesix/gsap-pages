"use client"

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PiMouseScroll } from "react-icons/pi";
import InfoCard from "@/components/InfoCard";
import { skills } from "@/utils/data";
import { SplitText } from "gsap/SplitText";

const Line = () => {
  return (
    <div className="z-5">
      <div className="relative w-1 mt-2 h-full bg-gray-600 dark:bg-gray-300">
        <div className="absolute -left-2.5 w-6 h-6 shadow-mytheme rounded-full bg-mytheme"></div>
      </div>
    </div>
  )
}

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      // 1. Main timeline for the initial page load animations
      const tl = gsap.timeline();

      tl.fromTo(
        containerRef.current,
        { y: "-200vh" },
        { y: "0%", duration: 1, ease: "power2.out" }
      );

      // SplitText animation for the title
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars" });
        tl.from(split.chars, {
          y: 1000,
          scale: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.in",
        }, "+=0.25")
          .fromTo(
            ".scroll-icon",
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
            "+=0.25"
          );
      }

      tl.fromTo(
        ".laptop-container",
        { y: -200, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "easeInOut" },
        "+=0.5" // Start 0.5s after the page slides in
      );

      // 2. Animate each content section as it scrolls into view
      const sections = gsap.utils.toArray<HTMLElement>('.scroll-reveal-section');
      sections.forEach((section) => {
        // Animate the title of the section
        gsap.from(section.querySelector('.section-title'), {
          x: -300,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            scroller: scrollWrapperRef.current, // Specify our scrolling container
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none none",
          }
        });

        // Animate the content of the section
        gsap.from(section.querySelector('.section-content'), {
          x: -300,
          opacity: 0,
          duration: 0.8,
          delay: 0.2, // Animate slightly after the title
          ease: 'power2.out',
          scrollTrigger: {
            scroller: scrollWrapperRef.current,
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none none",
          }
        });
      });

    }, containerRef); // Scope all GSAP animations to the main container for easy cleanup

    return () => ctx.revert(); // Cleanup function
  }, []);

  return (
    <div ref={containerRef} className="h-full">

      {/* TITLE SECTION */}
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <h1 ref={titleRef} className="text-4xl md:text-6xl text-center font-semibold">Get to know me</h1>
        <PiMouseScroll className="scroll-icon animate-bounce size-8" />
      </div>

      <div ref={scrollWrapperRef} className="h-full overflow-x-hidden lg:flex gap-4">
        {/*TEXT CONTAINER*/}
        <div className="flex flex-col gap-48 md:gap-56 lg:gap-36 xl:gap-64 lg:w-3/5">
          {/*BIO*/}
          <div className="flex flex-col gap-8 justify-center">
            <h1 className="font-bold text-4xl">BIOGRAPHY</h1>
            <p className="md:text-xl">In my journey as a tech enthusiast, I&apos;ve had the privilege of diving deep into various tools and technologies that shape our digital world. My experience spans across Visual Studio, where I&apos;ve honed my skills in developing robust software solutions, and Android Studio, which has enabled me to create engaging and user-friendly mobile applications. These platforms have been instrumental in my growth as a versatile developer, allowing me to bring innovative ideas to life and solve complex problems with ease.</p>
            <p className="md:text-xl">Beyond the realm of software development, I have explored the fascinating world of 3D design and manufacturing. Using CAD modeling, I&apos;ve developed intricate and detailed models that serve both artistic and practical purposes. My expertise in 3D printing has brought these designs into the physical world, offering tangible solutions and creative expressions. This blend of digital and physical creation has not only expanded my technical skill set but also fueled my passion for continuous learning of what technology can achieve.</p>
            <PiMouseScroll className="scroll-icon animate-bounce size-8" />
          </div>

          {/*SKILLS*/}
          <div className="scroll-reveal-section flex flex-col gap-12 justify-center">
            <h1 className="section-title font-bold text-4xl">SKILLS</h1>
            <div className="section-content flex flex-wrap gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="p-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-black">{skill}</div>))}
            </div>
            <PiMouseScroll className="scroll-icon animate-bounce size-8" />
          </div>

          {/*EXPERIENCE*/}
          <div className="scroll-reveal-section flex flex-col gap-12 justify-center">
            <h1 className="section-title font-bold text-4xl">MY JOURNEY</h1>
            <div className="section-content">
              {/*LIST ITEM 6*/}
              <div className="flex justify-between h-fit">
                <div className="w-5/12 relative"></div>
                <Line />
                <InfoCard
                  title="Laravel Web"
                  description="I&apos;m a Next.js developer, proficient in building high-performance, server-rendered web applications. With a good foundation in the MERN stack—MongoDB, Express, React, and Node.js. I&apos;m eager to craft seamless, user-friendly digital experiences. Every line of code I write aims to elevate the web."
                  date="2025-Present" />
              </div>

              {/*LIST ITEM 5*/}
              <div className="flex justify-between h-fit">
                <InfoCard
                  title="Next.js Web"
                  description="I&apos;m a Next.js developer, proficient in building high-performance, server-rendered web applications. With a good foundation in the MERN stack—MongoDB, Express, React, and Node.js. I&apos;m eager to craft seamless, user-friendly digital experiences. Every line of code I write aims to elevate the web."
                  date="2023-Present" />
                <Line />
                <div className="w-5/12 relative"></div>
              </div>

              {/*LIST ITEM 4*/}
              <div className="flex justify-between h-fit">
                <div className="w-5/12 relative"></div>
                <Line />
                <InfoCard
                  title="MERN Stack Web"
                  description="I&apos;m a MERN stack developer, wielding MongoDB, Express, React, and Node.js like a pro. My passion lies in creating seamless, user-friendly applications that deliver powerful digital experiences. Every project is a chance to make the web a better place, one line of code at a time."
                  date="2023-Present" />
              </div>

              {/*LIST ITEM 3*/}
              <div className="flex justify-between h-fit">
                <InfoCard
                  title="Frontend and UX/UI design"
                  description="I&apos;m a frontend dev, crafting responsive, visually appealing interfaces with HTML, CSS, and JavaScript. Every project is a chance to enhance the digital experience and make the web more enjoyable for all."
                  date="2020-Present" />
                <Line />
                <div className="w-5/12 relative"></div>
              </div>

              {/*LIST ITEM 2*/}
              <div className="flex justify-between h-fit">
                <div className="w-5/12 relative"></div>
                <Line />
                <InfoCard
                  title="Android Studio"
                  description="Seasoned Android Studio Java developer with a knack for building user-friendly mobile applications. Expert in Java programming and Android SDK, focused on creating seamless, high-performance apps tailored to user needs."
                  date="2021-2022" />
              </div>

              {/*LIST ITEM 1*/}
              <div className="flex justify-between h-fit">
                <InfoCard
                  title="Visual Studio"
                  description="Experienced Visual Studio C# developer skilled in crafting robust applications using the .NET framework. Adept at problem-solving, writing clean code, and continuously updating projects to keep up with technological advancements."
                  date="2020-2021" />
                <Line />
                <div className="w-5/12 relative"></div>
              </div>
            </div>
          </div>
        </div>

        {/*IMAGE CONTAINER*/}
        <div className="laptop-container hidden lg:flex items-center justify-center sticky top-0 bg-mytheme/50 w-2/5">
          Content coming soon
        </div>
      </div>
    </div>
  )
}

export default AboutPage;