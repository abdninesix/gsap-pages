"use client"

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PiMouseScroll } from "react-icons/pi";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, skills } from "@/utils/data";
import InfoCard from "@/components/InfoCard";
import ModelViewer from "@/components/ModelViewer";

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
                }, "+=1")
                    .from(".scroll-icon", { y: -40, opacity: 0, duration: 0.5 }, "+=0.2");
            }

            /** --- 2️⃣ SCROLLTRIGGERED ANIMATIONS --- **/
            const scrollAnimations = () => {
                /** Sticky model viewer fade-in **/
                const sticky = document.querySelector(".sticky-container");
                gsap.from(".sticky-container", {
                    autoAlpha: 0,
                    x: 100,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: ".sticky-container",
                        start: "top 70%",
                        end: "top center",
                        scrub: true,
                    },
                });

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
            };

            // Run scroll animations slightly after intro
            setTimeout(scrollAnimations, 800);

        }, containerRef);

        return () => ctx.revert();
    }, []);




    return (
        <div ref={containerRef} className="h-full  overflow-x-hidden">

            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
                <span ref={titleRef} className="text-4xl md:text-6xl font-semibold">Get to know me</span>
                <PiMouseScroll className="scroll-icon animate-bounce size-8" />
            </div>

            <div className="flex gap-6">

                {/*INFO CONTAINER*/}
                <div className="flex flex-col gap-48 md:gap-56 lg:gap-36 xl:gap-64 lg:w-3/5">
                    {/*BIO*/}
                    <div className="flex flex-col gap-12 justify-center">
                        <h1 className="heading-animate font-bold text-4xl">BIOGRAPHY</h1>
                        <div className="content-animate md:text-xl space-y-4">
                            <p>In my journey as a tech enthusiast, I&apos;ve had the privilege of diving deep into various tools and technologies that shape our digital world. My experience spans across Visual Studio, where I&apos;ve honed my skills in developing robust software solutions, and Android Studio, which has enabled me to create engaging and user-friendly mobile applications. These platforms have been instrumental in my growth as a versatile developer, allowing me to bring innovative ideas to life and solve complex problems with ease.</p>
                            <p>Beyond the realm of software development, I have explored the fascinating world of 3D design and manufacturing. Using CAD modeling, I&apos;ve developed intricate and detailed models that serve both artistic and practical purposes. My expertise in 3D printing has brought these designs into the physical world, offering tangible solutions and creative expressions. This blend of digital and physical creation has not only expanded my technical skill set but also fueled my passion for continuous learning of what technology can achieve.</p>
                        </div>
                        <PiMouseScroll className="scroll-icon animate-bounce size-8" />
                    </div>

                    {/*SKILLS*/}
                    <div className="flex flex-col gap-12 justify-center">
                        <h1 className="heading-animate font-bold text-4xl">SKILLS</h1>
                        <div className="content-animate flex flex-wrap gap-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="p-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-black">{skill}</div>))}
                        </div>
                        <PiMouseScroll className="scroll-icon animate-bounce size-8" />
                    </div>

                    {/*EXPERIENCE*/}
                    <div className="flex flex-col gap-12 justify-center">
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

                    {/*CERTIFICATIONS*/}
                    <div className="flex flex-col gap-12 justify-center">
                        <h1 className="heading-animate font-bold text-3xl">MORE INFO</h1>
                        <div className="content-animate flex flex-wrap gap-4 mb-20">
                            <div className="size-28 bg-gray-500">gray</div>
                            <div className="size-28 bg-slate-500">slate</div>
                            <div className="size-28 bg-zinc-500">zinc</div>
                            <div className="size-28 bg-stone-500">stone</div>
                            <div className="size-28 bg-neutral-500">neutral</div>
                        </div>
                    </div>
                </div>

                {/*STICKY CONTENT CONTAINER*/}
                <div className="sticky-container w-1/2 h-[100vh] hidden lg:flex items-center justify-center sticky top-0">
                    <ModelViewer modelPath="/people.glb" />
                </div>

            </div>
        </div >
    )
}

export default Aboutpage;