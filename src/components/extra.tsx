"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

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
  const zCounter = useRef(projects.length);
  const activeIndex = useRef<number | null>(null);

  const resetStack = () => {
    const container = containerRef.current;
    if (!container) return;

    const imgs = container.querySelectorAll<HTMLDivElement>(".stack-img");
    imgs.forEach((img, i) => {
      img.classList.remove("absolute", "top-1/2", "left-1/2");
      img.classList.add("relative");

      gsap.to(img, {
        duration: 0.3,
        rotation: 5,
        scale: 1,
        x: 0,
        y: 0,
        zIndex: i + 1,
        ease: "power2.out",
      });

      const info = img.querySelector(".project-info");
      if (info) info.classList.remove("show-info");
      if (info) info.classList.add("hidden-info");
    });

    activeIndex.current = null;
  };

  const handleClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    const imgs = container.querySelectorAll<HTMLDivElement>(".stack-img");
    const clicked = imgs[index];

    // Toggle same card
    if (activeIndex.current === index) return resetStack();

    // Bring on top visually
    zCounter.current += 1;
    activeIndex.current = index;

    // Make clicked absolute so it doesn’t affect layout
    clicked.classList.remove("relative");
    clicked.classList.add("absolute", "top-1/2", "left-1/2");

    const rect = clicked.getBoundingClientRect();
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const offsetX = viewportCenterX - (rect.left + rect.width / 2);
    const offsetY = viewportCenterY - (rect.top + rect.height / 2);

    // Fit to viewport
    const scaleX = window.innerWidth * 0.8 / rect.width;
    const scaleY = window.innerHeight * 0.8 / rect.height;
    const scale = Math.min(scaleX, scaleY);

    gsap.to(clicked, {
      duration: 0.4,
      rotation: 0,
      scale,
      x: offsetX,
      y: offsetY,
      zIndex: zCounter.current,
      ease: "power3.out",
    });

    // Reset others
    imgs.forEach((img, i) => {
      if (i !== index) {
        img.classList.remove("absolute", "top-1/2", "left-1/2");
        img.classList.add("relative");
        gsap.to(img, {
          duration: 0.3,
          rotation: 5,
          scale: 1,
          x: 0,
          y: 0,
          zIndex: i + 1,
          ease: "power2.out",
        });

        const info = img.querySelector(".project-info");
        if (info) info.classList.remove("show-info");
        if (info) info.classList.add("hidden-info");
      }
    });

    // Show info
    const info = clicked.querySelector(".project-info");
    if (info) {
      info.classList.remove("hidden-info");
      info.classList.add("show-info");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(e.target as Node)) resetStack();
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start justify-center px-10 md:pr-32"
    >
      {projects.map((project, i) => (
        <div
          key={i}
          className="stack-img relative flex flex-col justify-center gap-2 bg-mytheme/90 w-full md:w-92 p-2 transition-transform rounded-xl shadow-lg"
          onClick={(e) => handleClick(i, e)}
          style={{
            transform: `rotate(5deg) scale(1)`,
            zIndex: i + 1,
            WebkitClipPath:
              "polygon(0% 8%, 10% 0%, 60% 0%, 70% 8%, 100% 8%, 100% 100%, 0% 100%)",
            clipPath:
              "polygon(0% 8%, 10% 0%, 60% 0%, 70% 8%, 100% 8%, 100% 100%, 0% 100%)",
          }}
        >
          <h2 className="text-2xl font-semibold mt-5">{project.title}</h2>
          <Image
            src={project.src}
            alt={`Stack image ${i}`}
            width={800}
            height={450}
            priority
            className="h-auto w-auto cursor-pointer max-w-full max-h-[70vh] object-contain select-none"
          />
          <div className="project-info hidden-info flex flex-col gap-2 items-start mt-3">
            <span className="px-1 w-fit bg-black text-white dark:bg-white dark:text-black font-medium text-xs">
              {project.type}
            </span>
            <p className="text-sm">{project.desc}</p>
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ring hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-sm p-2"
            >
              Demo
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}