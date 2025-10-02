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

  const pathName = usePathname()

  const [open, setOpen] = useState(false);

  // refs for menu button lines
  const topRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ref for mobile menu container
  const menuRef = useRef<HTMLDivElement>(null);
  // refs for each menu item
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (open) {
      // animate button lines
      gsap.to(topRef.current, { rotate: 45, x: 10, duration: 0.3 });
      gsap.to(centerRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: -45, x: 10, duration: 0.3 });

      // show menu
      gsap.fromTo(
        menuRef.current,
        { x: 50, y: -50 },
        { x: 0, y: 0, duration: 0.6, ease: "bounce" }
      );
      // stagger menu items
      gsap.fromTo(
        itemRefs.current,
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.4, ease: "back.inOut", stagger: 0.2, delay: 0.6 },
      );
    } else {
      // reset button lines
      gsap.to(topRef.current, { rotate: 0, x: 0, duration: 0.3 });
      gsap.to(centerRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: 0, x: 0, duration: 0.3 });

      // hide menu
      if (menuRef.current) {
        gsap.to(menuRef.current, { opacity: 0, duration: 0.3 });
      }
    }
  }, [open]);

  return (
    <div className="h-[4rem] flex items-center justify-between select-none">
      {/* LOGO */}
      <TransitionLink href="/" className="text-3xl z-30 hover:scale-105">
        A<span className="text-xl">BS</span>
      </TransitionLink>

      {/* DESKTOP MENU */}
      <div className="flex gap-5">
        <ThemeButton />
        <div className="hidden md:flex gap-5 w-fit">
          {links.map((link) => (
            <TransitionLink key={link.url} className='relative text-base rounded-md p-1 group' href={link.url}>
              {link.title}
              <div className={`duration-500 absolute bottom-0 right-0 left-0 w-0 h-[0.15rem] group-hover:w-full bg-black dark:bg-white ${pathName === link.url && "bg-black dark:bg-white w-full"}`} />
            </TransitionLink>
          ))}
        </div>
      </div>

      {/* DESKTOP SOCIALS */}
      <div className="hidden md:flex gap-4 md:justify-end w-fit rounded-lg">
        <Link className="hover:scale-105" href="https://github.com/abdninesix"><FaGithub className="size-6" /></Link>
        <Link className="hover:scale-105" href="https://www.linkedin.com/in/muhammad-abdullah-4065b7339/"><FaLinkedin className="size-6" /></Link>
      </div>

      {/* MOBILE MENU TOGGLE BUTTON */}
      <div className="md:hidden">
        <button
          className="w-10 h-6 flex flex-col items-center justify-between z-30 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div ref={topRef} className="w-7 h-1 bg-black dark:bg-white rounded origin-left" />
          <div ref={centerRef} className="w-7 h-1 bg-black dark:bg-white rounded" />
          <div ref={bottomRef} className="w-7 h-1 bg-black dark:bg-white rounded origin-left" />
        </button>
      </div>

      {/* MOBILE MENU ITEMS */}
      {open && (
        <div
          ref={menuRef}
          className="absolute overflow-hidden rounded-lg top-0 right-0 w-screen h-screen bg-gray-300 dark:bg-gray-900 flex flex-col items-center justify-center gap-10 text-4xl font-medium z-20"
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
            <Link className="hover:scale-105" href="https://github.com/abdninesix"><FaGithub className="size-8" /></Link>
            <Link className="hover:scale-105" href="https://www.linkedin.com/in/muhammad-abdullah-4065b7339/"><FaLinkedin className="size-8" /></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
