"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function LandingSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef(null);
  useEffect(() => {
    if (!imageRef.current) return;

    if (!emojiRef.current) return;

    gsap.to(emojiRef.current, {
      rotation: 20,
      duration: 0.25,
      repeat: -1,
      yoyo: true,
      transformOrigin: "bottom center",
      ease: "power1.inOut",
    });

    gsap.to(imageRef.current, {
      yPercent: 30, // Increased from 20 → 40 for stronger parallax
      ease: "none",
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Clean up ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10 min-h-screen -mt-10">
        <div className="space-y-6 mx-auto md:-translate-y-1/2 ">
          <h1 className="text-4xl   font-bold leading-tight">
            <span ref={emojiRef} className="inline-block  ">
              👋
            </span>{" "}
            Hi I'm Syed Hassan Sibtain,
          </h1>
        
          <p className="md:text-[1.2rem]  text-gray-600 dark:text-gray-300">
            <span className="chela-font text-[1.75rem]">
              Full-Stack Developer
            </span>{" "}
            with <strong>6.5+ years of experience</strong> building scalable,
            high-performance web applications using{" "}
            <span className="chela-font text-[1.35rem]">Angular</span>,{" "}
            <span className="chela-font text-[1.35rem]">React</span>,{" "}
            <span className="chela-font text-[1.35rem]">NextJs</span>, and{" "}
            <span className="chela-font text-[1.35rem]">Node.js</span>. I
            specialize in crafting interactive UIs, optimizing performance, and
            delivering enterprise-grade solutions.
          </p>
          <Link
            href="#resume"
            className="mb- group relative inline-flex items-center justify-end overflow-hidden rounded-sm border border-indigo-600 px-8 py-3 text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
          >
            <span className="text-sm font-medium transition-all group-hover:ms-4">
              See My Work
            </span>
            <span className="absolute -start-full transition-all group-hover:start-4">
              <svg
                className="size-5 shadow-sm rotate-90 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Image with Parallax */}
        <div
          className="relative h-[500px] md:h-[890px] w-full overflow-hidden rounded-xl  "
          ref={imageRef}
        >
          <Image
            src="/IMG-20250628-WA0040.jpg"
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 pointer-events-none z-10 image-shadow "></div>
        </div>
      </div>
    </section>
  );
}
