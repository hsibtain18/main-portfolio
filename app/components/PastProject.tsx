"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  repoLink?: string;
}

const projects: Project[] = [
  {
    title: "Portfolio",
    description:
      "A responsive admin dashboard built with Next.js and Tailwind CSS.",
    image: "/portfolio.png",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript","Netlify"],
    liveLink: "https://yourapp.com",
    repoLink: "https://github.com/yourrepo",
  },
  {
    title: "Ectorious",
    description: "Full-stack online store with payment integration.",
    image: "/ectorious.png",
    techStack: ["NextJs", "ReactJS", "GSAP", "TypeScript","Tailwind CSS",],
    liveLink: "https://store.com",
    repoLink: "https://github.com/store-repo",
  },
];

export default function ProjectSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    cardRefs.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 md:px-12 max-w-7xl mx-auto"
      id="pastProjects"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Projects</h2>
      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project, idx) => (
          <div
            key={project.title}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={450}
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Live Site
                  </a>
                )}
                {project.repoLink && (
                  <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
