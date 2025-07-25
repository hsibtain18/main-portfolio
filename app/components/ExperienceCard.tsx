// // ExperienceCard.tsx
// "use client";

// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ExperienceItem } from "../constant/experienceData";

// gsap.registerPlugin(ScrollTrigger);

// interface ExperienceCardProps extends ExperienceItem {
//   duration: string;
//   direction?: "left" | "right";
// }

// export default function ExperienceCard({
//   title,
//   company,
//   duration,
//   location,
//   responsibilities,
//   direction = "left",
//   techStack,
// }: ExperienceCardProps) {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const tiltRef = useRef<HTMLDivElement>(null);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (!cardRef.current) return;
//     gsap.fromTo(
//       cardRef.current,
//       {
//         opacity: 0,
//         x: direction === "left" ? -100 : 100,
//       },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 1,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: cardRef.current,
//           start: "top 80%",
//         },
//         stagger: 0.2,
//       }
//     );
//   }, [direction]);

//   useEffect(() => {
//     if (cardRef.current) {
//       gsap.to(cardRef.current, {
//         width: open ? "100%" : "100%",
//         maxWidth: open ? "94%" : "28rem",
//         height: open ? "auto" : "auto",
//         duration: 0.5,
//         ease: "power2.inOut",
//       });
//     }
//   }, [open]);
//   const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     if (open && iconRefs.current.length) {
//       iconRefs.current.forEach((icon, i) => {
//         if (icon) {
//           gsap.fromTo(
//             icon,
//             { opacity: 0, rotateY: 90, scale: 0.8 },
//             {
//               opacity: 1,
//               rotateY: 0,
//               scale: 1,
//               duration: 1,
//               ease: "back.out(1.7)",
//               delay: i * 0.1,
//             }
//           );
//         }
//       });
//     }
//   }, [open]);
//   // Tilt effect on hover (desktop only)
//   useEffect(() => {
//     const el = tiltRef.current;
//     if (!el || open || window.innerWidth < 768) return; // only on desktop

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = el.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;

//       const rotateX = -(y - centerY) / 20;
//       const rotateY = (x - centerX) / 20;

//       gsap.to(el, {
//         rotateX,
//         rotateY,
//         scale: 1.04,
//         boxShadow: "0 12px 25px rgba(0, 123, 255, 0.25)",
//         transformPerspective: 1000,
//         transformOrigin: "center",
//         ease: "power2.out",
//         duration: 0.15,
//       });
//     };

//     const handleMouseLeave = () => {
//       gsap.to(el, {
//         rotateX: 0,
//         rotateY: 0,
//         scale: 1,
//         boxShadow: "none",
//         ease: "power2.out",
//         duration: 0.12,
//       });
//     };

//     el.addEventListener("mousemove", handleMouseMove);
//     el.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       el.removeEventListener("mousemove", handleMouseMove);
//       el.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, [open]);
//   return (
//     <>
//       {open && (
//         <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30 h-full"></div>
//       )}
//       <div
//         ref={cardRef}
//         onClick={() => setOpen(true)}
//         className={`border  backdrop-blur-sm  transform transition-transform hover:-translate-y-1 hover:shadow-2xl bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-6  ${
//           open ? "z-50 fixed inset-0 overflow-auto m-4 md:m-12" : "max-w-md"
//         }`}
//       >
//         {open && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // <--- This is the key change
//               setOpen(false);
//             }}
//             className="absolute  top-4 right-4 z-50 text-gray-500 hover:text-red-500 text-2xl"
//             aria-label="Close"
//           >
//             &times;
//           </button>
//         )}
//         {open ? (
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                 {title}
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {company} • {location}
//               </p>
//               <p className="text-sm text-gray-400 mb-4">{duration}</p>
//               <p className="font-medium text-lg mt-4">
//                 Start Date: {duration.split("–")[0].trim()}
//               </p>
//               <p className="font-medium text-lg">
//                 End Date: {duration.split("–")[1].trim()}
//               </p>
//               <p className="mt-4 italic text-sm text-gray-500 dark:text-gray-400">
//                 Click anywhere to collapse.
//               </p>
//               {techStack && (
//                 <div className="flex flex-wrap gap-4 mt-6">
//                   {(() => {
//                     iconRefs.current = []; // ✅ Clear old refs
//                     return techStack.map((tech, i) => (
//                       <div
//                         key={tech.name}
//                         ref={(el) => {
//                           iconRefs.current[i] = el;
//                         }}
//                         className="w-16 h-16 transform transition-transform"
//                         title={tech.name}
//                       >
//                         <img
//                           src={tech.path}
//                           alt={tech.name}
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                     ));
//                   })()}
//                 </div>
//               )}
//             </div>
//             <div>
//               <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
//                 Responsibilities
//               </p>
//               <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
//                 {responsibilities.map((task, i) => (
//                   <li key={i}>{task}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ) : (
//           <>
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//               {title}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {company} • {location}
//             </p>
//             <p className="text-sm text-gray-400 mb-2">{duration}</p>
//             <ul className="list-disc pl-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
//               {responsibilities.slice(0, 4).map((task, i) => (
//                 <li key={i}>{task}</li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </>
//   );
// }
// "use client";

// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ExperienceItem } from "../constant/experienceData";

// gsap.registerPlugin(ScrollTrigger);

// interface ExperienceCardProps extends ExperienceItem {
//   duration: string;
//   direction?: "left" | "right";
// }

// export default function ExperienceCard({
//   title,
//   company,
//   duration,
//   location,
//   responsibilities,
//   direction = "left",
//   techStack,
// }: ExperienceCardProps) {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const tiltRef = useRef<HTMLDivElement>(null);
//   const [open, setOpen] = useState(false);
//   const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     if (!cardRef.current) return;
//     gsap.fromTo(
//       cardRef.current,
//       {
//         opacity: 0,
//         x: direction === "left" ? -100 : 100,
//       },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 0.6,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: cardRef.current,
//           start: "top 80%",
//         },
//         stagger: 0.2,
//       }
//     );
//   }, [direction]);

//   useEffect(() => {
//     if (cardRef.current) {
//       gsap.to(cardRef.current, {
//         width: open ? "100%" : "100%",
//         maxWidth: open ? "94%" : "28rem",
//         height: open ? "auto" : "auto",
//         duration: 0.4,
//         ease: "power2.inOut",
//       });
//       if (open) {
//         // 🧹 Reset tilt transform
//         gsap.set(cardRef.current, {
//           rotateX: 0,
//           rotateY: 0,
//           scale: 1,
//           boxShadow: "none",
//         });
//       }
//     }
//   }, [open]);

//   useEffect(() => {
//     if (open && iconRefs.current.length) {
//       iconRefs.current.forEach((icon, i) => {
//         if (icon) {
//           gsap.fromTo(
//             icon,
//             { opacity: 0, rotateY: 90, scale: 0.8 },
//             {
//               opacity: 1,
//               rotateY: 0,
//               scale: 1,
//               duration: 0.6,
//               ease: "back.out(1.7)",
//               delay: i * 0.08,
//             }
//           );
//         }
//       });
//     }
//   }, [open]);

//   useEffect(() => {
//     const el = tiltRef.current;
//     if (!el || window.innerWidth < 768) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       if (open) return; // Disable tilt when open
//       const rect = el.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;

//       const isNearCorner =
//         x < rect.width * 0.25 ||
//         x > rect.width * 0.75 ||
//         y < rect.height * 0.25 ||
//         y > rect.height * 0.75;

//       if (!isNearCorner) {
//         gsap.to(el, {
//           rotateX: 0,
//           rotateY: 0,
//           scale: 1,
//           boxShadow: "none",
//           ease: "power2.out",
//           duration: 0.1,
//         });
//         return;
//       }

//       const rotateX = -(y - centerY) / 15;
//       const rotateY = (x - centerX) / 15;

//       gsap.to(el, {
//         rotateX,
//         rotateY,
//         scale: 1.03,
//         boxShadow: "0 12px 25px rgba(0, 123, 255, 0.25)",
//         transformPerspective: 1000,
//         transformOrigin: "center",
//         ease: "power2.out",
//         duration: 0.12,
//       });
//     };

//     const handleMouseLeave = () => {
//       gsap.to(el, {
//         rotateX: 0,
//         rotateY: 0,
//         scale: 1,
//         boxShadow: "none",
//         ease: "power2.out",
//         duration: 0.1,
//       });
//     };

//     el.addEventListener("mousemove", handleMouseMove);
//     el.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       el.removeEventListener("mousemove", handleMouseMove);
//       el.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, [open]);

//   return (
//     <>
//       {open && (
//         <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30 h-full"></div>
//       )}
//       <div
//         ref={(el) => {
//           cardRef.current = el;
//           tiltRef.current = el;
//         }}
//         onClick={() => setOpen(true)}
//         data-hoverable // This is key for your CustomCursor
//         className={`border  transform transition-transform hover:-translate-y-1 hover:shadow-2xl bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-6 ${
//           open ? "z-50 fixed inset-0 overflow-auto m-4 md:m-12" : "max-w-md"
//         }`}
//       >
//         {open && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpen(false);
//             }}
//             className="absolute  top-4 right-4 z-50 text-gray-500 hover:text-red-500 text-2xl"
//             aria-label="Close"
//           >
//             &times;
//           </button>
//         )}
//         {open ? (
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                 {title}
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {company} • {location}
//               </p>
//               <p className="text-sm text-gray-400 mb-4">{duration}</p>
//               <p className="font-medium text-lg mt-4">
//                 Start Date: {duration.split("–")[0].trim()}
//               </p>
//               <p className="font-medium text-lg">
//                 End Date: {duration.split("–")[1].trim()}
//               </p>
//               <p className="mt-4 italic text-sm text-gray-500 dark:text-gray-400">
//                 Click anywhere to collapse.
//               </p>
//               {techStack && (
//                 <div className="flex flex-wrap gap-4 mt-6">
//                   {(() => {
//                     iconRefs.current = [];
//                     return techStack.map((tech, i) => (
//                       <div
//                         key={tech.name}
//                         ref={(el) => {
//                           iconRefs.current[i] = el;
//                         }}
//                         className="w-16 h-16 transform transition-transform"
//                         title={tech.name}
//                       >
//                         <img
//                           src={tech.path}
//                           alt={tech.name}
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                     ));
//                   })()}
//                 </div>
//               )}
//             </div>
//             <div>
//               <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
//                 Responsibilities
//               </p>
//               <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
//                 {responsibilities.map((task, i) => (
//                   <li key={i}>{task}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ) : (
//           <>
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//               {title}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {company} • {location}
//             </p>
//             <p className="text-sm text-gray-400 mb-2">{duration}</p>
//             <ul className="list-disc pl-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
//               {responsibilities.slice(0, 4).map((task, i) => (
//                 <li key={i}>{task}</li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExperienceItem } from "../constant/experienceData"; // Assuming this exists

gsap.registerPlugin(ScrollTrigger);

// SVG for external link icon
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 inline-block ml-1 align-middle"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

interface ExperienceCardProps extends ExperienceItem {
  duration: string;
  direction?: "left" | "right";
  companyDetails?:string
  companyURL?:string
}

export default function ExperienceCard({
  title,
  company,
  duration,
  location,
  responsibilities,
  direction = "left",
  techStack,
  companyURL, // Destructure new prop
  companyDetails, // Destructure new prop
}: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        x: direction === "left" ? -100 : 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
        stagger: 0.2,
      }
    );
  }, [direction]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        width: open ? "100%" : "100%",
        maxWidth: open ? "94%" : "28rem",
        height: open ? "auto" : "auto",
        duration: 0.4,
        ease: "power2.inOut",
      });
      if (open) {
        // 🧹 Reset tilt transform
        gsap.set(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "none",
        });
      }
    }
  }, [open]);

  useEffect(() => {
    if (open && iconRefs.current.length) {
      iconRefs.current.forEach((icon, i) => {
        if (icon) {
          gsap.fromTo(
            icon,
            { opacity: 0, rotateY: 90, scale: 0.8 },
            {
              opacity: 1,
              rotateY: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              delay: i * 0.08,
            }
          );
        }
      });
    }
  }, [open]);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (open) return; // Disable tilt when open
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const isNearCorner =
        x < rect.width * 0.25 ||
        x > rect.width * 0.75 ||
        y < rect.height * 0.25 ||
        y > rect.height * 0.75;

      if (!isNearCorner) {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "none",
          ease: "power2.out",
          duration: 0.1,
        });
        return;
      }

      const rotateX = -(y - centerY) / 15;
      const rotateY = (x - centerX) / 15;

      gsap.to(el, {
        rotateX,
        rotateY,
        scale: 1.03,
        boxShadow: "0 12px 25px rgba(0, 123, 255, 0.25)",
        transformPerspective: 1000,
        transformOrigin: "center",
        ease: "power2.out",
        duration: 0.12,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "none",
        ease: "power2.out",
        duration: 0.1,
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30 h-full"></div>
      )}
      <div
        ref={(el) => {
          cardRef.current = el;
          tiltRef.current = el;
        }}
        onClick={() => setOpen(true)}
        data-hoverable // This is key for your CustomCursor
        className={`border transform transition-transform hover:-translate-y-1 hover:shadow-2xl bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-6 ${
          open ? "z-50 fixed inset-0 overflow-auto m-4 md:m-12" : "max-w-md"
        }`}
      >
        {open && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-4 right-4 z-50 text-gray-500 hover:text-red-500 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        )}
        {open ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {companyURL ? (
                  <a
                    href={companyURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent card close on link click
                  >
                    {company} <ExternalLinkIcon />
                  </a>
                ) : (
                  company
                )}{" "}
                • {location}
              </p>
              <p className="text-sm text-gray-400 mb-4">{duration}</p>

              {/* New section for Company Details */}
              {companyDetails && (
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Company Details
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {companyDetails}
                  </p>
                </div>
              )}

              <p className="font-medium text-lg mt-4">
                Start Date: {duration.split("–")[0].trim()}
              </p>
              <p className="font-medium text-lg">
                End Date: {duration.split("–")[1].trim()}
              </p>
              <p className="mt-4 italic text-sm text-gray-500 dark:text-gray-400">
                Click anywhere to collapse.
              </p>
              {techStack && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {(() => {
                    iconRefs.current = [];
                    return techStack.map((tech, i) => (
                      <div
                        key={tech.name}
                        ref={(el) => {
                          iconRefs.current[i] = el;
                        }}
                        className="w-16 h-16 transform transition-transform"
                        title={tech.name}
                      >
                        <img
                          src={tech.path}
                          alt={tech.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Responsibilities
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {responsibilities.map((task, i) => (
                  <li key={i} className=" mt-2 " >{task}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {companyURL ? (
                <a
                  href={companyURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {company} <ExternalLinkIcon />
                </a>
              ) : (
                company
              )}{" "}
              • {location}
            </p>
            <p className="text-sm text-gray-400 mb-2">{duration}</p>
            <ul className="list-disc pl-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {responsibilities.slice(0, 4).map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}