"use client";

import { useLayoutEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { FaHandshakeAngle } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { RiThumbUpLine } from "react-icons/ri";

const Contactpage = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setErrors({});

    if (formRef.current) {
      const formValues = {
        user_message: (formRef.current.elements.namedItem("user_message") as HTMLTextAreaElement)?.value,
        user_email: (formRef.current.elements.namedItem("user_email") as HTMLInputElement)?.value,
      };

      const newErrors: { [key: string]: string } = {};

      if (!formValues.user_message) { newErrors.user_message = "Please write your message to collaborate"; }
      if (!formValues.user_email) { newErrors.user_email = "Please enter a valid email"; }
      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          process.env.NEXT_PUBLIC_TEMPLATE_ID!,
          formRef.current,
          {
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
          }
        )
        .then(
          () => {
            setSuccess(true);
            formRef.current?.reset();
          },
          () => {
            setError(true);
          }
        );
    }
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);
    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { y: "-200vh" },
      { y: "0%", duration: 1, ease: "power2.out" }
    );

    if (textRef.current) {
      const split = new SplitText(textRef.current, { type: "chars" });

      tl
        .from(split.chars, {
          y: -700,
          scale: 10,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.in",
        }, "+=0.25"
        )
        .fromTo(
          ".handshake",
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "expo.in" },
          "+=0.25"
        )
        .fromTo(
          formRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
          "+=0.25"
        );

      // Cleanup function to revert the SplitText
      return () => {
        split.revert();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-hidden">
      <div className="h-full flex flex-col items-center justify-center gap-8 lg:gap-28 lg:flex-row">

        <div className="w-full lg:w-1/2 flex lg:flex-col items-center justify-between">
          <span ref={textRef} className="text-4xl md:text-6xl font-semibold">Let&apos;s&nbsp;<span>collaborate</span></span>
          <div className="handshake"><FaHandshakeAngle className="size-16 lg:size-72" /></div>
        </div>

        <form onSubmit={sendEmail} ref={formRef} className="px-4 py-10 w-full lg:w-1/2 bg-mytheme/25 dark:bg-white/90 flex flex-col gap-10 justify-center transition-all">
          <div className="relative w-full">
            <textarea
              id="user_message"
              name="user_message"
              rows={8}
              placeholder=" "
              aria-invalid={!!errors.user_message}
              className={`peer block w-full resize-none border-2 bg-white p-2 placeholder-transparent focus:outline-none text-black
      ${errors.user_message ? "border-red-500 focus:border-red-600" : "border-mytheme focus:border-black"}`} />
            <label
              htmlFor="user_message"
              className={`absolute left-2 -top-2 bg-white px-1 rounded-t-lg transition-all
      peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-mytheme
      peer-focus:-top-6 peer-focus:text-base 
      ${errors.user_message ? "text-red-500 peer-focus:text-red-600" : "peer-focus:text-black"}
      peer-focus:border-2 peer-focus:border-b-0`}>
              Your message
            </label>
            {errors.user_message && (<span className="text-sm text-red-500 flex items-center mt-1 gap-1"><MdErrorOutline className="size-5" />{errors.user_message}</span>)}
          </div>

          <div className="relative w-full">
            <input
              id="user_email"
              name="user_email"
              type="text"
              placeholder=" "
              aria-invalid={!!errors.user_email}
              className={`peer block w-full border-2 bg-white p-2 placeholder-transparent focus:outline-none text-black
      ${errors.user_email ? "border-red-500 focus:border-red-600" : "border-mytheme focus:border-black"}`}
            />
            <label
              htmlFor="user_email"
              className={`absolute left-2 -top-2 bg-white px-1 rounded-t-lg transition-all duration-200 ease-in-out
      peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-mytheme
      peer-focus:-top-6 peer-focus:text-base 
      ${errors.user_email ? "text-red-500 peer-focus:text-red-600" : "peer-focus:text-black"}
      peer-focus:border-2 peer-focus:border-b-0`}
            >
              Your email
            </label>
            {errors.user_email && (<span className="text-sm text-red-500 flex items-center mt-1 gap-1"><MdErrorOutline className="size-5" />{errors.user_email}</span>)}
          </div>

          <button className="w-fit cursor-pointer ring hover:bg-black text-black hover:text-white p-2">Send</button>
          {success && (<span className=" text-sm text-green-500 flex items-center justify-center gap-1"><RiThumbUpLine className="size-5" />Your message has been delivered.</span>)}
          {error && (<span className=" text-sm text-red-500 flex items-center justify-center gap-1"><MdErrorOutline className="size-5" />Something went wrong. Please try again.</span>)}
        </form>

      </div>
    </div>
  )
}

export default Contactpage;