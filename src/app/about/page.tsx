"use client"

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { certifications, experiences, skills } from "@/utils/data";
import InfoCard from "@/components/InfoCard";
import { FaCaretDown } from "react-icons/fa6";
import ThreeObject from "@/components/ThreeObject";
import ImageStack from "@/components/ImageStack";
import Image from "next/image";

const Line = () => {
    return (
        <div className="z-5 line-container flex justify-center">
            <div className="relative w-1 h-full">
                <div className="size-full bg-gray-600 dark:bg-gray-300 line"></div>
                <div className="absolute top-0 -left-2.5 size-6 shadow-mytheme rounded-full bg-mytheme line-dot"></div>
            </div>
        </div>
    );
};

const Aboutpage = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        gsap.registerPlugin(ScrollTrigger, SplitText);

        const ctx = gsap.context(() => {

            /** --- 1️⃣ HERO INTRO ANIMATION --- **/
            const introTl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });

            if (titleRef.current) {
                const split = new SplitText(titleRef.current, { type: "chars, words" });
                introTl.from(split.chars, {
                    y: 1000,
                    scale: 20,
                    opacity: 0,
                    stagger: 0.1,
                    ease: "back.in",
                }, "+=0.25")
                    .from(".scroll-icon", { y: -40, opacity: 0, duration: 0.5 }, "+=0.2");
            }

            /** --- 2️⃣ SCROLLTRIGGERED ANIMATIONS --- **/

            /** Line growth + timeline card animations **/
            const lines = gsap.utils.toArray<HTMLElement>(".line-container");

            lines.forEach((lineContainer) => {
                const line = lineContainer.querySelector(".line");
                const dot = lineContainer.querySelector(".line-dot");
                const card = lineContainer.closest(".timeline-card");
                if (!line || !dot || !card) return;

                // Line grow
                gsap.fromTo(
                    line,
                    { scaleY: 0, transformOrigin: "top" },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: lineContainer,
                            start: "top 70%",
                            end: "top 40%",
                            scrub: true,
                        },
                    }
                );

                // Dot and card reveal
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: lineContainer,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                });

                tl.from(dot, { scale: 0, duration: 0.4, ease: "bounce.out" })
                    .from(card, { autoAlpha: 0, ease: "expo.out", duration: 0.5 }, "-=0.25");
            });

            /** Headings + content slide-in **/
            const headings = gsap.utils.toArray<HTMLElement>(".heading-animate");

            headings.forEach((heading) => {
                const content = heading.parentElement?.querySelectorAll(".content-animate");

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });

                tl.from(heading, { x: -150, opacity: 0, ease: "elastic", duration: 1 })
                if (content && content.length > 0) {
                    tl.from(content, {
                        x: -120,
                        opacity: 0,
                        ease: "elastic",
                        duration: 1,
                        stagger: 0.15,
                    }, "-=0.4");
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="h-auto scrollbar-none overflow-x-clip">

            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
                <span ref={titleRef} className="text-4xl md:text-6xl font-semibold">Get to know me</span>
                <FaCaretDown className="scroll-icon animate-bounce size-8" />
            </div>

            <div className="relative h-[460vh] overflow-visible">

                {/*STICKY CONTENT CONTAINER*/}
                <div className="hidden lg:block w-full h-screen sticky top-0 z-10">
                    <ThreeObject modelPath="/scifi_robot.glb" />
                </div>


                {/*INFO CONTAINER*/}
                <div className="flex flex-col absolute top-0 gap-48 md:gap-56 lg:gap-36 xl:gap-64">

                    {/*BIO*/}
                    <div className="flex justify-start">
                        <div className="flex flex-col gap-12 justify-center lg:w-3/5">
                            <h1 className="heading-animate font-bold text-4xl">ABOUT</h1>
                            <div className="content-animate md:text-xl space-y-4">
                                <p>In my journey as a tech enthusiast, I&apos;ve had the privilege of diving deep into various tools and technologies that shape our digital world. My experience spans across Visual Studio, where I&apos;ve honed my skills in developing robust software solutions, and Android Studio, which has enabled me to create engaging and user-friendly mobile applications. These platforms have been instrumental in my growth as a versatile developer, allowing me to bring innovative ideas to life and solve complex problems with ease.</p>
                                <p>Beyond the realm of software development, I have explored the fascinating world of 3D design and manufacturing. Using CAD modeling, I&apos;ve developed intricate and detailed models that serve both artistic and practical purposes. My expertise in 3D printing has brought these designs into the physical world, offering tangible solutions and creative expressions. This blend of digital and physical creation has not only expanded my technical skill set but also fueled my passion for continuous learning of what technology can achieve.</p>
                            </div>
                            <FaCaretDown className="scroll-icon animate-bounce size-8" />
                        </div>
                    </div>

                    {/*SKILLS*/}
                    <div className="flex justify-end">
                        <div className="flex flex-col gap-12 justify-center lg:w-3/5">
                            <h1 className="heading-animate font-bold text-4xl">SKILLS</h1>
                            <div className="content-animate flex flex-wrap gap-4">
                                {skills.map((skill, index) => (
                                    <div key={index} className="p-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-black">{skill}</div>))}
                            </div>
                            <FaCaretDown className="scroll-icon animate-bounce size-8" />
                        </div>
                    </div>

                    {/*EXPERIENCE*/}
                    <div className="flex justify-start">
                        <div className="flex flex-col gap-12 justify-center lg:w-3/5">
                            <h1 className="heading-animate font-bold text-4xl">MY JOURNEY</h1>
                            <div>
                                {experiences.map((exp, index) => {
                                    const isLeft = index % 2 === 0; // alternate sides
                                    return (
                                        <div key={index} className="flex justify-between h-fit timeline-card" >
                                            {isLeft ? (
                                                <>
                                                    <div className="w-5/12 relative" />
                                                    <Line />
                                                    <InfoCard {...exp} />
                                                </>
                                            ) : (
                                                <>
                                                    <InfoCard {...exp} />
                                                    <Line />
                                                    <div className="w-5/12 relative" />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/*CERTIFICATIONS*/}
                    <div className="flex justify-end">
                        <div className="flex flex-col gap-12 justify-center lg:w-3/5">
                            <h1 className="heading-animate font-bold text-3xl">CERTIFICATIONS</h1>
                            <div className="content-animate z-20">
                                <div className="relative grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 items-start justify-center">
                                    {certifications.map((src, i) => (
                                        <div
                                            key={i}
                                            className="stack-img relative -mr-40 rotate-6 flex flex-col  hover:rotate-6 hover:-translate-y-10 justify-center cursor-pointer duration-200"
                                            style={{ zIndex: i + 1, }}
                                        >
                                            <Image src={src} alt={`Stack image ${i}`} width={800} height={450} priority className="h-auto w-full object-contain select-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default Aboutpage;