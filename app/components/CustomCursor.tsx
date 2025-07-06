// "use client";

// import { useEffect, useRef } from "react";

// export default function CustomCursor() {
//   const dotRef = useRef<HTMLDivElement>(null);
//   const ringRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const dot = dotRef.current!;
//     const ring = ringRef.current!;
//     let mouseX = 0;
//     let mouseY = 0;
//     let ringX = 0;
//     let ringY = 0;

//     const animate = () => {
//       ringX += (mouseX - ringX) * 0.2;
//       ringY += (mouseY - ringY) * 0.2;

//       dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
//       ring.style.transform = `translate3d(${ringX - 15}px, ${ringY - 15}px, 0)`;

//       requestAnimationFrame(animate);
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       mouseX = e.clientX;
//       mouseY = e.clientY;
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     requestAnimationFrame(animate);

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return (
//     <>
//       <div
//         ref={dotRef}
//         className="fixed top-0 left-0 z-[9999] w-1.5 h-1.5 bg-blue-500 rounded-full pointer-events-none"
//       />
//       <div
//         ref={ringRef}
//         className="fixed top-0 left-0 z-[9998] w-8 h-8 border-2 border-blue-500 rounded-full pointer-events-none"
//       />
//     </>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import gsap from "gsap";

export default function CustomCursor() {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // This effect runs once after the initial render.
    // We attach listeners to `document`.
    // The `moveCursor` and `handleHover` functions will then access `cursorRef.current` directly
    // at the time the event fires, ensuring it's not null if the element is rendered.

    const moveCursor = (e: MouseEvent) => {
      // Only proceed if the cursor DOM element is available
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { // Target cursorRef.current directly
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only proceed if the cursor DOM element is available
      if (cursorRef.current) {
        const isHoverable = target.closest("a, button, [data-hoverable]");

        if (isHoverable) {
          cursorRef.current.classList.add("scale-150", "opacity-80");
        } else {
          cursorRef.current.classList.remove("scale-150", "opacity-80");
        }
      }
    };

    // Attach event listeners to the document
    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleHover);

    // Cleanup function: remove event listeners when component unmounts
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleHover);
    };
  }, []); // Empty dependency array: runs once after initial render

  if (!mounted) {
    return null;
  }

  const svgColor = theme === "dark" ? "#FACC15" : "#2563EB";

  return (
    <div
      ref={cursorRef} // Attach the ref here
      className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
      style={{ width: "23px", height: "25px" }}
    >
      <svg
        width="23"
        height="25"
        viewBox="0 0 23 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_0_33)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.8407 12.5161L17.4865 10.8649L5 4L8.64025 17.7764L11.3663 13.668L14.63 17.8454L16.1044 16.6935L12.8407 12.5161Z"
            fill={svgColor}
          />
          <path
            d="M5.24121 3.56152L17.7275 10.4268L18.7031 10.9629L17.6543 11.3359L13.6611 12.7549L16.4980 16.3857L16.8066 16.7793L16.4121 17.0879L14.9375 18.2393L14.5439 18.5469L14.2363 18.1533L11.3994 14.5215L9.05664 18.0527L8.44141 18.9805L8.15723 17.9043L4.51660 4.12793L4.21875 3L5.24121 3.56152Z"
            stroke="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_0_33"
            x="0.437087"
            y="-0.000437021"
            width="22.4826"
            height="24.1853"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_33" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_0_33"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
