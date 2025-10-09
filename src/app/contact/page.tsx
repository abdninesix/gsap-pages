"use client";

import { useLayoutEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { FaHandshakeAngle } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { RiThumbUpFill, RiThumbUpLine } from "react-icons/ri";

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
        user_name: (formRef.current.elements.namedItem("user_name") as HTMLInputElement)?.value,
        user_email: (formRef.current.elements.namedItem("user_email") as HTMLInputElement)?.value,
        user_message: (formRef.current.elements.namedItem("user_message") as HTMLTextAreaElement)?.value,
      };

      const newErrors: { [key: string]: string } = {};

      if (!formValues.user_name) { newErrors.user_name = "Please type in your name"; }
      if (!formValues.user_email) { newErrors.user_email = "Please type in a valid email"; }
      if (!formValues.user_message) { newErrors.user_message = "Please type your message"; }
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

    const ctx = gsap.context(() => {

      setTimeout(() => {

        const tl = gsap.timeline();

        if (textRef.current) {
          const split = new SplitText(textRef.current, { type: "chars, words" });

          tl
            .from(split.chars, {
              y: 1000,
              scale: 20,
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
              { opacity: 1, y: 0, duration: 0.25, ease: "expo.in" },
              "+=0.25"
            );

          // Cleanup function to revert the SplitText
          return () => {
            split.revert();
          };
        }
      }, 50);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-hidden">
      <div className="flex flex-col justify-center gap-6 lg:gap-16 lg:flex-row mt-12 lg:mt-28">

        <div className="w-full lg:w-1/2 flex lg:flex-col items-center justify-between lg:justify-center">
          <span ref={textRef} className="text-4xl md:text-6xl font-semibold">Let&apos;s collaborate</span>
          <div className="handshake"><FaHandshakeAngle className="size-16 lg:size-72" /></div>
        </div>

        <form onSubmit={sendEmail} ref={formRef} className="relative px-4 py-10 w-full lg:w-1/2 bg-mytheme/25 dark:bg-white/90 flex flex-col gap-10 justify-center transition-all">

          <div className="relative w-full">
            <input
              id="user_name"
              name="user_name"
              type="text"
              placeholder=" "
              aria-invalid={!!errors.user_name}
              className={`peer block w-full border-2 bg-white p-2 placeholder-transparent focus:outline-none text-black
      ${errors.user_name ? "border-red-500 focus:border-red-600" : "border-mytheme focus:border-black"}`}
            />
            <label
              htmlFor="user_name"
              className={`absolute left-2 -top-4 bg-white px-1 rounded-t-lg transition-all duration-200 ease-in-out
      peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400
      peer-focus:-top-6 peer-focus:text-base 
      ${errors.user_name ? "text-red-500 peer-focus:text-red-600" : "peer-focus:text-black text-black"}
      peer-focus:border-2 peer-focus:border-b-0`}
            >
              Your name
            </label>
            {errors.user_name && (<span className="absolute -bottom-6 right-0 text-sm text-red-500 flex items-center mt-1 gap-1"><MdErrorOutline className="size-4" />{errors.user_name}</span>)}
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
              className={`absolute left-2 -top-4 bg-white px-1 rounded-t-lg transition-all duration-200 ease-in-out
      peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400
      peer-focus:-top-6 peer-focus:text-base 
      ${errors.user_email ? "text-red-500 peer-focus:text-red-600" : "peer-focus:text-black text-black"}
      peer-focus:border-2 peer-focus:border-b-0`}
            >
              Your email
            </label>
            {errors.user_email && (<span className="absolute -bottom-6 right-0 text-sm text-red-500 flex items-center mt-1 gap-1"><MdErrorOutline className="size-4" />{errors.user_email}</span>)}
          </div>

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
              className={`absolute left-2 -top-4 bg-white px-1 rounded-t-lg transition-all
      peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400
      peer-focus:-top-6 peer-focus:text-base 
      ${errors.user_message ? "text-red-500 peer-focus:text-red-600" : "peer-focus:text-black text-black"}
      peer-focus:border-2 peer-focus:border-b-0`}>
              Your project requirements
            </label>
            {errors.user_message && (<span className="absolute -bottom-6 right-0 text-sm text-red-500 flex items-center mt-1 gap-1"><MdErrorOutline className="size-4" />{errors.user_message}</span>)}
          </div>

          <button className="w-fit cursor-pointer ring hover:bg-black text-black hover:text-white text-sm p-2">Send</button>
          {success && (<span className="absolute bottom-12 right-4 text-sm text-green-600 flex items-center justify-center gap-1">Your message has been delivered <RiThumbUpFill className="size-4" /></span>)}
          {error && (<span className="absolute bottom-12 right-4 text-sm text-red-500 flex items-center justify-center gap-1"><MdErrorOutline className="size-4" />Something went wrong. Please try again.</span>)}
        </form>

      </div>
    </div>
  )
}

export default Contactpage;