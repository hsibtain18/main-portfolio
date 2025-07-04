// "use client";

// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const techCategories: Record<string, { name: string; icon: string }[]> = {
//   Frontend: [
//     { name: "Angular", icon: "https://cdn.simpleicons.org/angular/DD0031" },
//     { name: "React.js", icon: "https://cdn.simpleicons.org/react/61DAFB" },
//     { name: "RxJS", icon: "https://cdn.simpleicons.org/reactivex/B7178C" },
//     { name: "NGRX", icon: "https://cdn.simpleicons.org/ngrx/C2185B" },
//     { name: "Redux", icon: "https://cdn.simpleicons.org/redux/764ABC" },
//     {
//       name: "Tailwind CSS",
//       icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
//     },
//     { name: "Bootstrap", icon: "https://cdn.simpleicons.org/bootstrap/7952B3" },
//     {
//       name: "Angular Material",
//       icon: "https://cdn.simpleicons.org/angular/DD0031",
//     },
//     { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
//     {
//       name: "Responsive Design",
//       icon: "https://cdn.simpleicons.org/css3/1572B6",
//     },
//   ],
//   "Backend & Fullstack": [
//     { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
//     { name: "Express", icon: "https://cdn.simpleicons.org/express/000000" },
//     { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
//     {
//       name: "RESTful APIs",
//       icon: "https://cdn.simpleicons.org/openapi/6BA539",
//     },
//     { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
//   ],
//   "DevOps & Practices": [
//     { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
//     { name: "CI/CD", icon: "https://cdn.simpleicons.org/githubactions/2088FF" },
//     { name: "Jira", icon: "https://cdn.simpleicons.org/jira/0052CC" },
//     {
//       name: "Confluence",
//       icon: "https://cdn.simpleicons.org/confluence/172B4D",
//     },
//     {
//       name: "Mentorship",
//       icon: "https://cdn.simpleicons.org/teamspeak/2580D2",
//     },
//     { name: "Code Review", icon: "https://cdn.simpleicons.org/github/181717" },
//     {
//       name: "Security Compliance",
//       icon: "https://cdn.simpleicons.org/owasp/000000",
//     },
//     {
//       name: "Performance Optimization",
//       icon: "https://cdn.simpleicons.org/lightning/FFC400",
//     },
//   ],
//   "Tools & Platforms": [
//     {
//       name: "VS Code",
//       icon: "https://cdn.simpleicons.org/visualstudiocode/007ACC",
//     },
//     { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
//     {
//       name: "Chrome DevTools",
//       icon: "https://cdn.simpleicons.org/googlechrome/4285F4",
//     },
//     {
//       name: "Android Studio",
//       icon: "https://cdn.simpleicons.org/androidstudio/3DDC84",
//     },
//   ],
// };

// export default function TechStack() {
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     // Clear any existing ScrollTriggers to prevent duplicates on re-renders
//     // This is important for "play none play none" to work correctly on subsequent scrolls
//     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

//     cardRefs.current.forEach((el, index) => {
//       if (el) {
//         gsap.fromTo(
//           el,
//           { opacity: 0, y: 40 }, // Start state: invisible and 40px below
//           {
//             opacity: 1, // End state: fully visible
//             y: 0, // End state: original position
//             duration: 0.8,
//             delay: index * 0.1, // Stagger animation for each card
//             scrollTrigger: {
//               trigger: el, // Trigger animation when the card itself enters view
//               start: "top 85%", // Start animation when the top of the card is 85% down from the top of the viewport
//               // IMPORTANT: This line makes the animation play on enter (scroll down) and re-enter (scroll up)
//               toggleActions: "play none play none",
//             },
//           }
//         );
//       }
//     });

//     // Cleanup function for ScrollTrigger instances
//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

//   return (
//     <div className="py-12 px-6 md:px-12 w-full text-gray-900 dark:text-gray-100" id="techStack">
//       <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
//         <img
//           src="https://cdn.simpleicons.org/sharp/2580D2"
//           alt="icon"
//           className="w-6 h-6 object-contain"
//         />
//         Tech Stack & Expertise
//       </h2>
//       <div className="flex flex-col gap-8 max-w-3xl mx-auto">
//         {Object.entries(techCategories).map(([category, tools], i) => (
//           <div
//             key={category}
//             ref={(el) => {
//               cardRefs.current[i] = el;
//             }}
//             className="w-full transition-all"
//           >
//             <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
//               {category}
//             </h3>
//             <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mt-3">
//               {tools.map((tool) => (
//                 <div
//                   key={tool.name}
//                   className="flex items-center space-x-3 p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm
//                              transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer
//                              text-gray-700 dark:text-gray-300"
//                 >
//                   <img
//                     src={tool.icon}
//                     alt={tool.name}
//                     className="w-6 h-6 object-contain"
//                   />
//                   <span>{tool.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const techCategories: Record<string, { name: string; icon: string }[]> = {
  Frontend: [
    { name: "Angular", icon: "https://cdn.simpleicons.org/angular/DD0031" },
    { name: "React.js", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "RxJS", icon: "https://cdn.simpleicons.org/reactivex/B7178C" },
    { name: "NGRX", icon: "https://cdn.simpleicons.org/ngrx/C2185B" },
    { name: "Redux", icon: "https://cdn.simpleicons.org/redux/764ABC" },
    {
      name: "Tailwind CSS",
      icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    },
    { name: "Bootstrap", icon: "https://cdn.simpleicons.org/bootstrap/7952B3" },
    {
      name: "Angular Material",
      icon: "https://cdn.simpleicons.org/angular/DD0031",
    },
    { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
    {
      name: "Responsive Design",
      icon: "https://cdn.simpleicons.org/css3/1572B6",
    },
  ],
  "Backend & Fullstack": [
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
    { name: "Express", icon: "https://cdn.simpleicons.org/express/000000" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
    {
      name: "RESTful APIs",
      icon: "https://cdn.simpleicons.org/openapi/6BA539",
    },
    { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  ],
  "DevOps & Practices": [
    { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
    { name: "CI/CD", icon: "https://cdn.simpleicons.org/githubactions/2088FF" },
    { name: "Jira", icon: "https://cdn.simpleicons.org/jira/0052CC" },
    {
      name: "Confluence",
      icon: "https://cdn.simpleicons.org/confluence/172B4D",
    },
    {
      name: "Mentorship",
      icon: "https://cdn.simpleicons.org/teamspeak/2580D2",
    },
    { name: "Code Review", icon: "https://cdn.simpleicons.org/github/181717" },
    {
      name: "Security Compliance",
      icon: "https://cdn.simpleicons.org/owasp/000000",
    },
    {
      name: "Performance Optimization",
      icon: "https://cdn.simpleicons.org/lightning/FFC400",
    },
  ],
  "Tools & Platforms": [
    {
      name: "VS Code",
      icon: "https://cdn.simpleicons.org/visualstudiocode/007ACC",
    },
    { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
    {
      name: "Chrome DevTools",
      icon: "https://cdn.simpleicons.org/googlechrome/4285F4",
    },
    {
      name: "Android Studio",
      icon: "https://cdn.simpleicons.org/androidstudio/3DDC84",
    },
  ],
};

export default function TechStack() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());

    cardRefs.current.forEach((el, index) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none play none none",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      className="py-12 px-6 md:px-12 w-full text-gray-900 dark:text-gray-100"
      id="techStack"
    >
      <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
        <img
          src="https://cdn.simpleicons.org/stackblitz/1389FD"
          alt="tech"
          className="w-6 h-6 object-contain"
        />
        Tech Stack & Expertise
      </h2>

      <div className="flex flex-col gap-10 max-w-3xl mx-auto">
        {Object.entries(techCategories).map(([category, tools], i) => (
          <div
            key={category}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              {category}
            </h3>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mt-3">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center space-x-3 p-3 px-4 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm
                             transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer
                             text-gray-700 dark:text-gray-300"
                >
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-sm font-medium">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
