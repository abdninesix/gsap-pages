"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  src: string;
  title: string;
  desc: string;
  type: string;
  link: string;
}

interface ProjectStackProps {
  projects: Project[];
}

export default function ProjectStack({ projects }: ProjectStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /** Close modal on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const modal = document.querySelector(".project-modal");
      if (modal && !modal.contains(e.target as Node)) setActiveIndex(null);
    };
    if (activeIndex !== null) {
      document.addEventListener("click", handleClick);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [activeIndex]);

  /** Modal open animation */
  useEffect(() => {
    if (activeIndex === null) return;

    const modal = document.querySelector(".project-modal");
    if (modal) {
      gsap.fromTo(
        modal,
        { y: 100, scale: 0.5 },
        { y: 0, scale: 1, duration: 0.5, ease: "elastic.out" }
      );
    }
  }, [activeIndex]);

  /** Animate cards on scroll with persistent random rotation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>(".project-card");

      cards.forEach((card, i) => {
        const randomRotation = gsap.utils.random(-6, 6);
        gsap.set(card, { rotate: randomRotation });

        gsap.fromTo(card,
          {
            x: gsap.utils.random(-500, -600),
            y: gsap.utils.random(150, 250),
            rotate: gsap.utils.random(-360, 360),
            opacity: 0,
            scale: 0.2,
          },
          {
            x: 0,
            y: 0,
            rotate: gsap.utils.random(-6, 6),
            opacity: 1,
            scale: 1,
            duration: 0.1,
            ease: "elastic.out",
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.1,
          }
        );

        // Hover animation
        let hoverAnim = gsap.to(card, {
          scale: 1.05,
          rotate: randomRotation + gsap.utils.random(-2, 2),
          y: -15,
          ease: "power3.out",
          duration: 0.1,
          paused: true,
        });

        card.addEventListener("mouseenter", () => hoverAnim.play());
        card.addEventListener("mouseleave", () => hoverAnim.reverse());
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Grid Layout */}
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start justify-center"
      >
        {projects.map((project, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className="project-card relative flex flex-col -mt-32 md:-mt-12 sm:-mr-10 rotate-6 hover:rotate-12 hover:-translate-y-10 justify-center gap-2 bg-mytheme/80 p-2 cursor-pointer duration-200"
            style={{
              WebkitClipPath:
                "polygon(0% 8%, 10% 0%, 60% 0%, 70% 8%, 100% 8%, 100% 100%, 0% 100%)",
              clipPath:
                "polygon(0% 8%, 10% 0%, 60% 0%, 70% 8%, 100% 8%, 100% 100%, 0% 100%)",
            }}
          >
            <h2 className="text-2xl font-semibold mt-6">{project.title}</h2>
            <Image
              src={project.src}
              alt={`Stack image ${i}`}
              width={800}
              height={450}
              priority
              className="h-auto w-full object-contain select-none"
            />
          </div>
        ))}
      </div>

      {/* Overlay + Modal */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="project-modal relative bg-white dark:bg-neutral-900 p-4 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-2 right-2 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold flex items-center mb-3">
              {projects[activeIndex].title}&nbsp;
              <span className="p-1 w-fit bg-black text-white dark:bg-white dark:text-black font-medium text-xs">
                {projects[activeIndex].type}
              </span>
            </h2>


            <div className="flex flex-col items-start gap-4">
              <Image
                src={projects[activeIndex].src}
                alt={projects[activeIndex].title}
                width={1200}
                height={800}
                className="w-auto h-auto max-w-full max-h-[60vh] object-contain"
              />

              <p className="text-sm leading-relaxed">
                {projects[activeIndex].desc}
              </p>
              <Link
                href={projects[activeIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="ring hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-sm p-2"
              >
                Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
