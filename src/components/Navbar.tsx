"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import ThemeButton from "./ThemeButton";

const links = [
  { url: "/", title: "Home" },
  { url: "/about", title: "About" },
  { url: "/projects", title: "Projects" },
  { url: "/contact", title: "Contact" },
];

const Navbar = () => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  // refs for menu button lines
  const topRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ref for mobile menu container
  const menuRef = useRef<HTMLDivElement>(null);
  // refs for each menu item
  const itemRefs = useRef<HTMLDivElement[]>([]);

  // ====== MOBILE MENU ANIMATIONS ======
  useEffect(() => {
    if (open) {
      gsap.to(topRef.current, { rotate: 45, x: 10, duration: 0.3 });
      gsap.to(centerRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: -45, x: 10, duration: 0.3 });

      gsap.fromTo(
        menuRef.current,
        { x: 50, y: -50 },
        { x: 0, y: 0, duration: 0.6, ease: "bounce" }
      );

      gsap.fromTo(
        itemRefs.current,
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.4, ease: "back.inOut", stagger: 0.2, delay: 0.6 },
      );
    } else {
      gsap.to(topRef.current, { rotate: 0, x: 0, duration: 0.3 });
      gsap.to(centerRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: 0, x: 0, duration: 0.3 });

      if (menuRef.current) {
        gsap.to(menuRef.current, { opacity: 0, duration: 0.3 });
      }
    }
  }, [open]);

  // ====== MAGNETIC HOVER EFFECT ======
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".nav-magnetic");
    const listeners: { item: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];

    items.forEach((item) => {

      // GSAP quickTo for smooth performance
      const xTo = gsap.quickTo(item, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(item, "y", { duration: 0.3, ease: "power3.out" });

      const move = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.3);
        yTo(y * 0.3);
      };

      const leave = () => {
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)",
        });
      };

      item.addEventListener("mousemove", move);
      item.addEventListener("mouseleave", leave);

      listeners.push({ item, move, leave });
    });

    // cleanup
    return () => {
      listeners.forEach(({ item, move, leave }) => {
        item.removeEventListener("mousemove", move);
        item.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div className="h-[4rem] flex items-center justify-between select-none text-lg">
      {/* LOGO */}
      <TransitionLink href="/" className="text-3xl md:pr-10 z-30 nav-magnetic">
        A<span className="text-lg">BS</span>
      </TransitionLink>

      {/* DESKTOP MENU */}
      <div className="flex gap-4">
        <div className="nav-magnetic p-2"><ThemeButton /></div>
        <div className="hidden md:flex h-full">
          {links.map((link) => (
            <TransitionLink key={link.url} className='relative px-4 py-2 group nav-magnetic' href={link.url}>
              {link.title.toUpperCase()}
              <div className={`duration-200 absolute bottom-[0.2rem] left-1/2 -translate-x-1/2 w-0 h-[0.15rem] bg-black dark:bg-white ${pathName === link.url && "bg-black dark:bg-white w-1/2"}`} />
            </TransitionLink>
          ))}
        </div>
      </div>

      {/* DESKTOP SOCIALS */}
      <div className="hidden md:flex md:justify-end gap-2">
        <Link className="nav-magnetic pl-2" target="_blank" href="https://github.com/abdninesix"><FaGithub className="size-6" /></Link>
        <Link className="nav-magnetic pl-2" target="_blank" href="https://www.linkedin.com/in/muhammad-abdullah-4065b7339/"><FaLinkedin className="size-6" /></Link>
      </div>

      {/* MOBILE MENU TOGGLE BUTTON */}
      <div className="md:hidden">
        <button
          className="w-10 h-6 flex flex-col items-center justify-between z-30 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div ref={topRef} className="w-7 h-1 bg-black dark:bg-white origin-left" />
          <div ref={centerRef} className="w-7 h-1 bg-black dark:bg-white" />
          <div ref={bottomRef} className="w-7 h-1 bg-black dark:bg-white origin-left" />
        </button>
      </div>

      {/* MOBILE MENU ITEMS */}
      {open && (
        <div
          ref={menuRef}
          className="absolute overflow-hidden rounded-lg top-0 right-0 w-screen h-screen bg-gray-900 flex flex-col items-center justify-center gap-10 text-4xl font-medium z-20"
        >
          {links.map((link, index) => (
            <div
              key={link.title}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
            >
              <TransitionLink className="focus:underline" onComplete={() => setOpen(false)} href={link.url}>{link.title}</TransitionLink>
            </div>
          ))}
          <div className="absolute bottom-20 flex gap-4 justify-center md:justify-end w-fit rounded-lg">
            <Link className="hover:scale-105" target="_blank" href="https://github.com/abdninesix"><FaGithub className="size-8" /></Link>
            <Link className="hover:scale-105" target="_blank" href="https://www.linkedin.com/in/muhammad-abdullah-4065b7339/"><FaLinkedin className="size-8" /></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
