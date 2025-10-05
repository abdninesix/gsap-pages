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

const Projectspage = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        const ctx = gsap.context(() => {
            /** --- HERO INTRO --- **/
            const introTl = gsap.timeline();

            introTl.fromTo(
                containerRef.current,
                { y: "0%" },
                { y: "0%", duration: 1, ease: "power2.out" }
            );

            if (titleRef.current) {
                const split = new SplitText(titleRef.current, { type: "chars, words" });

                introTl
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
                        ".scroll-icon",
                        { y: -40, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" },
                        "+=0.3"
                    );
            }

            const timeout = setTimeout(() => {
                gsap.from(".sticky-container", {
                    opacity: 0,
                    x: 100,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: ".sticky-container",
                        start: "top 80%",
                        end: "top center",
                        scrub: true,
                    },
                });

                /** --- TIMELINE ANIMATIONS --- **/
                gsap.set(".line", { scaleY: 0, transformOrigin: "top" });
                gsap.set(".line-dot", { scale: 0, opacity: 0 });
                gsap.set(".timeline-card", { autoAlpha: 0, x: -80, y: 80 });

                const lines = gsap.utils.toArray<HTMLElement>(".line-container");

                lines.forEach((lineContainer, index) => {
                    const line = lineContainer.querySelector(".line");
                    const dot = lineContainer.querySelector(".line-dot");
                    const card = lineContainer.closest(".timeline-card");

                    if (!line || !dot || !card) return;

                    gsap.to(line, {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: lineContainer,
                            start: "top 90%",
                            end: "top 50%",
                            scrub: true,
                        },
                    });

                    // Reveal dot and card
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: lineContainer,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        },
                    });

                    tl.to(dot, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: "bounce.in",
                    }).to(card, {
                        autoAlpha: 1,
                        x: 0,
                        y: 0,
                        duration: 0.25,
                        ease: "expo.out",
                    }, "-=0.25"
                    );
                });
            }, 1000);

            return () => clearTimeout(timeout); // Cleanup
        }, containerRef);

        return () => ctx.revert();
    }, []);



    return (
        <div ref={containerRef} className="h-full scrollbar-none">

            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
                <span ref={titleRef} className="text-4xl md:text-6xl font-semibold">Get to know me</span>
                <PiMouseScroll className="scroll-icon animate-bounce size-8" />
            </div>

            <div className="flex gap-6">

                {/*INFO CONTAINER*/}
                <div className="flex flex-col gap-48 md:gap-56 lg:gap-36 xl:gap-64 lg:w-3/5">
                    {/*BIO*/}
                    <div className="flex flex-col gap-8 justify-center">
                        <h1 className="font-bold text-4xl">BIOGRAPHY</h1>
                        <p className="md:text-xl">In my journey as a tech enthusiast, I&apos;ve had the privilege of diving deep into various tools and technologies that shape our digital world. My experience spans across Visual Studio, where I&apos;ve honed my skills in developing robust software solutions, and Android Studio, which has enabled me to create engaging and user-friendly mobile applications. These platforms have been instrumental in my growth as a versatile developer, allowing me to bring innovative ideas to life and solve complex problems with ease.</p>
                        <p className="md:text-xl">Beyond the realm of software development, I have explored the fascinating world of 3D design and manufacturing. Using CAD modeling, I&apos;ve developed intricate and detailed models that serve both artistic and practical purposes. My expertise in 3D printing has brought these designs into the physical world, offering tangible solutions and creative expressions. This blend of digital and physical creation has not only expanded my technical skill set but also fueled my passion for continuous learning of what technology can achieve.</p>
                        <PiMouseScroll className="scroll-icon animate-bounce size-8" />
                    </div>

                    {/*SKILLS*/}
                    <div className="flex flex-col gap-12 justify-center">
                        <h1 className="font-bold text-4xl">SKILLS</h1>
                        <div className="flex flex-wrap gap-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="p-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-black">{skill}</div>))}
                        </div>
                        <PiMouseScroll className="scroll-icon animate-bounce size-8" />
                    </div>

                    {/*EXPERIENCE*/}
                    <div className="flex flex-col gap-12 justify-center">
                        <h1 className="font-bold text-4xl">MY JOURNEY</h1>
                        <div className="">
                            {experiences.map((exp, index) => {
                                const isLeft = index % 2 === 0; // alternate sides
                                return (
                                    <div key={index} className="flex justify-between h-fit timeline-card" >
                                        {isLeft ? (
                                            <>
                                                <div className="w-5/12 relative"/>
                                                <Line />
                                                <InfoCard {...exp} />
                                            </>
                                        ) : (
                                            <>
                                                <InfoCard {...exp} />
                                                <Line />
                                                <div className="w-5/12 relative"/>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/*CERTIFICATIONS*/}
                    <div className="flex flex-col gap-12 justify-center">
                        <h1 className="font-bold text-3xl">MORE INFO COMING SOON</h1>
                        <div className="flex flex-wrap gap-4 mb-20 size-screen">
                        </div>
                    </div>
                </div>

                {/*STICKY CONTENT CONTAINER*/}
                <div className="sticky-container w-1/2 h-[80vh] hidden lg:flex items-center justify-center sticky top-0">
                    <ModelViewer modelPath="/people.glb" />
                </div>

            </div>
        </div >
    )
}

export default Projectspage;