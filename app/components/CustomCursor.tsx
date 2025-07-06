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

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useTheme } from "next-themes";
// import gsap from "gsap";

// export default function CustomCursor() {
//   const { theme } = useTheme();
//   const cursorRef = useRef<HTMLDivElement>(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     // This effect runs once after the initial render.
//     // We attach listeners to `document`.
//     // The `moveCursor` and `handleHover` functions will then access `cursorRef.current` directly
//     // at the time the event fires, ensuring it's not null if the element is rendered.

//     const moveCursor = (e: MouseEvent) => {
//       // Only proceed if the cursor DOM element is available
//       if (cursorRef.current) {
//         gsap.to(cursorRef.current, { // Target cursorRef.current directly
//           x: e.clientX,
//           y: e.clientY,
//           duration: 0.2,
//           ease: "power2.out",
//         });
//       }
//     };

//     const handleHover = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;

//       // Only proceed if the cursor DOM element is available
//       if (cursorRef.current) {
//         const isHoverable = target.closest("a, button, [data-hoverable]");

//         if (isHoverable) {
//           cursorRef.current.classList.add("scale-150", "opacity-80");
//         } else {
//           cursorRef.current.classList.remove("scale-150", "opacity-80");
//         }
//       }
//     };

//     // Attach event listeners to the document
//     document.addEventListener("mousemove", moveCursor);
//     document.addEventListener("mouseover", handleHover);

//     // Cleanup function: remove event listeners when component unmounts
//     return () => {
//       document.removeEventListener("mousemove", moveCursor);
//       document.removeEventListener("mouseover", handleHover);
//     };
//   }, []); // Empty dependency array: runs once after initial render

//   if (!mounted) {
//     return null;
//   }

//   const svgColor = theme === "dark" ? "#FACC15" : "#2563EB";

//   return (
//     <div
//       ref={cursorRef} // Attach the ref here
//       className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
//       style={{ width: "23px", height: "25px" }}
//     >
//       <svg
//         width="23"
//         height="25"
//         viewBox="0 0 23 25"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <g filter="url(#filter0_d_0_33)">
//           <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             d="M12.8407 12.5161L17.4865 10.8649L5 4L8.64025 17.7764L11.3663 13.668L14.63 17.8454L16.1044 16.6935L12.8407 12.5161Z"
//             fill={svgColor}
//           />
//           <path
//             d="M5.24121 3.56152L17.7275 10.4268L18.7031 10.9629L17.6543 11.3359L13.6611 12.7549L16.4980 16.3857L16.8066 16.7793L16.4121 17.0879L14.9375 18.2393L14.5439 18.5469L14.2363 18.1533L11.3994 14.5215L9.05664 18.0527L8.44141 18.9805L8.15723 17.9043L4.51660 4.12793L4.21875 3L5.24121 3.56152Z"
//             stroke="white"
//           />
//         </g>
//         <defs>
//           <filter
//             id="filter0_d_0_33"
//             x="0.437087"
//             y="-0.000437021"
//             width="22.4826"
//             height="24.1853"
//             filterUnits="userSpaceOnUse"
//             colorInterpolationFilters="sRGB"
//           >
//             <feFlood floodOpacity="0" result="BackgroundImageFix" />
//             <feColorMatrix
//               in="SourceAlpha"
//               type="matrix"
//               values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//               result="hardAlpha"
//             />
//             <feOffset dy="1" />
//             <feGaussianBlur stdDeviation="1.5" />
//             <feColorMatrix
//               type="matrix"
//               values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
//             />
//             <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_33" />
//             <feBlend
//               mode="normal"
//               in="SourceGraphic"
//               in2="effect1_dropShadow_0_33"
//               result="shape"
//             />
//           </filter>
//         </defs>
//       </svg>
//     </div>
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
  const [isPointerCursor, setIsPointerCursor] = useState(false); // State to control which SVG is active

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest("a, button, [data-hoverable]");

      if (cursorRef.current) {
        setIsPointerCursor(!!isHoverable); // Set true if hovering over a hoverable element, false otherwise
      }
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleHover);
    document.addEventListener("mouseout", handleHover); // Use mouseout to revert when leaving hoverable area

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("mouseout", handleHover);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  // --- SVG Components ---

  // Default Arrow Cursor SVG Component
  const DefaultCursorSVG = ({ fillColor, strokeColor }: { fillColor: string; strokeColor: string }) => (
    <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_0_33)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8407 12.5161L17.4865 10.8649L5 4L8.64025 17.7764L11.3663 13.668L14.63 17.8454L16.1044 16.6935L12.8407 12.5161Z"
          fill={fillColor}
        />
        <path
          d="M5.24121 3.56152L17.7275 10.4268L18.7031 10.9629L17.6543 11.3359L13.6611 12.7549L16.498 16.3857L16.8066 16.7793L16.4121 17.0879L14.9375 18.2393L14.5439 18.5469L14.2363 18.1533L11.3994 14.5215L9.05664 18.0527L8.44141 18.9805L8.15723 17.9043L4.5166 4.12793L4.21875 3L5.24121 3.56152Z"
          stroke={strokeColor}
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
  );

  // Pointer Hand Cursor SVG Component
  const PointerCursorSVG = ({ fillColor, strokeColor }: { fillColor: string; strokeColor: string }) => (
    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_0_1)">
        <path fillRule="evenodd" clipRule="evenodd" d="M23.6355 9.58125L9.0108 2.87001L12.4698 18.7135L16.6964 12.4558L23.6355 9.58125Z" fill={fillColor}/>
        <path d="M22.3848 9.55751L16.5049 11.994L16.3663 12.0517L16.2823 12.1757L12.709 17.4657L9.71198 3.74208L22.3848 9.55751Z" stroke={strokeColor} strokeMiterlimit="16"/>
      </g>
      <g filter="url(#filter1_d_0_1)">
        <path fillRule="evenodd" clipRule="evenodd" d="M22 9.50676L10 4L12.8382 17L16.3062 11.8654L22 9.50676Z" fill={fillColor}/>
        <path d="M20.75 9.48242L16.1152 11.4033L15.9756 11.4609L15.8916 11.5859L13.0771 15.751L10.7012 4.87207L20.75 9.48242Z" stroke={strokeColor} strokeMiterlimit="16"/>
      </g>
      <g filter="url(#filter2_d_0_1)">
        <path fillRule="evenodd" clipRule="evenodd" d="M17 9.50676L5 4L7.83818 17L11.3062 11.8654L17 9.50676Z" fill={fillColor}/>
        <path d="M5.20898 3.5459L17.209 9.05273L18.25 9.53027L17.1914 9.96875L11.6367 12.2695L8.25293 17.2803L7.59863 18.248L7.34961 17.1064L4.51172 4.10645L4.29785 3.12793L5.20898 3.5459Z" stroke={strokeColor} strokeMiterlimit="16"/>
      </g>
      <defs>
        <filter id="filter0_d_0_1" x="6.0108" y="0.870011" width="20.6247" height="21.8435" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
        </filter>
        <filter id="filter1_d_0_1" x="7" y="2" width="18" height="19" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
        </filter>
        <filter id="filter2_d_0_1" x="0.59552" y="0.255223" width="19.8216" height="23.2402" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
        </filter>
      </defs>
    </svg>
  );

  // Determine current colors based on theme
  const defaultFillColor = theme === "dark" ? "#FACC15" : "#363B3E"; // Yellow for dark, dark gray for light
  const defaultStrokeColor = "white"; // White stroke for default cursor
 
  const pointerFillColor = "white";  
  const pointerStrokeColor = "#363B3E";  

  // Determine the current SVG component and its dimensions
  const CurrentCursorSVG = isPointerCursor ? PointerCursorSVG : DefaultCursorSVG;
  const currentWidth = isPointerCursor ? "27px" : "23px";  
  const currentHeight = isPointerCursor ? "24px" : "25px";  

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
      style={{ width: currentWidth, height: currentHeight }} // Dynamic width/height
    >
      <CurrentCursorSVG
        fillColor={isPointerCursor ? pointerFillColor : defaultFillColor}
        strokeColor={isPointerCursor ? pointerStrokeColor : defaultStrokeColor}
      />
    </div>
  );
}

