"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import { FaGithub, FaLinkedin } from 'react-icons/fa'
// import ThemeButton from "./ThemeButton";

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
        { x: 0, y: 0, duration: 0.4, ease: "power2.out" }
      );

      // stagger menu items
      gsap.fromTo(
        itemRefs.current,
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.2 }
      );
    } else {
      // reset button lines
      gsap.to(topRef.current, { rotate: 0, x: 0, duration: 0.3 });
      gsap.to(centerRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(bottomRef.current, { rotate: 0, x: 0, duration: 0.3 });

      // hide menu
      gsap.to(menuRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [open]);

  return (
    <div className="h-[4rem] flex items-center justify-between text-xl">
      {/* LOGO */}
      <div className="z-30">
        <Link href="/" className="text-3xl">
          A<span className="text-2xl">BS</span>
        </Link>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-5 w-fit">
        {/* <ThemeButton /> */}
        {links.map((link) => (
          <TransitionLink key={link.url} className='relative text-lg rounded-md p-1 group' href={link.url} label={link.title}>
            <div className={`duration-100 absolute bottom-0 right-0 left-0 bg-mytheme w-0 h-1 group-hover:w-full group-hover:bg-mytheme ${pathName === link.url && "bg-mytheme w-full"}`} />
          </TransitionLink>
        ))}
      </div>

      {/* DESKTOP SOCIALS */}
        <div className="hidden md:flex gap-4 md:justify-end w-fit rounded-lg">
          <Link className="text-gray-900 dark:text-gray-200 hover:scale-105" href=""><FaGithub className="size-9" /></Link>
          <Link className="text-gray-900 dark:text-gray-200 hover:scale-105" href=""><FaLinkedin className="size-9" /></Link>
        </div>

      {/* MOBILE MENU TOGGLE BUTTON */}
      <div className="flex z-30 md:hidden">
        {/* <ThemeButton /> */}
      </div>
      <div className="md:hidden">
        <button
          className="w-10 h-8 flex flex-col justify-between z-30 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div
            ref={topRef}
            className="w-10 h-1 bg-black dark:bg-white rounded origin-left"
          ></div>
          <div
            ref={centerRef}
            className="w-10 h-1 bg-black dark:bg-white rounded"
          ></div>
          <div
            ref={bottomRef}
            className="w-10 h-1 bg-black dark:bg-white rounded origin-left"
          ></div>
        </button>
      </div>

      {/* MOBILE MENU ITEMS */}
      {open && (
        <div
          ref={menuRef}
          className="absolute overflow-hidden rounded-lg top-0 right-0 w-screen h-screen bg-gray-400 dark:bg-slate-950 flex flex-col items-center justify-center gap-10 text-4xl font-medium z-20"
        >
          {links.map((link, index) => (
            <div
              key={link.title}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
            >
              <TransitionLink className="focus:underline" href={link.url} label={link.title} />
            </div>
          ))}
          <div className="absolute bottom-20 flex gap-4 justify-center md:justify-end w-fit rounded-lg">
            <Link className="text-gray-900 dark:text-gray-200 hover:scale-105" href=""><FaGithub className="size-9" /></Link>
            <Link className="text-gray-900 dark:text-gray-200 hover:scale-105" href=""><FaLinkedin className="size-9" /></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
