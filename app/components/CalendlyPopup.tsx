"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (args: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

export default function CalendlyPopup() {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    const handleMessage = (e: MessageEvent) => {
      if (
        e.origin.includes("calendly.com") &&
        e.data.event === "calendly.event_scheduled"
      ) {
        setTimeout(() => setShow(false), 1000);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.body.removeChild(script);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (show) {
      // Lock scroll
      document.body.style.overflow = "hidden";

      // Clear and re-initialize Calendly widget
      if (containerRef.current && window.Calendly) {
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/hsibtain18/30min",
          parentElement: containerRef.current,
        });

        // Fade in
        gsap.fromTo(
          popupRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(popupRef.current, { clearProps: "transform" });
            },
          }
        );
      }
    } else {
      // Unlock scroll
      document.body.style.overflow = "";
    }
  }, [show]);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Schedule a Call
      </button>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            ref={popupRef}
            className="relative bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl h-[675px] p-4 shadow-lg overflow-hidden"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-0.5 right-2.5 text-gray-500 hover:text-red-600 text-2xl font-bold z-10"
              aria-label="Close"
            >
              &times;
            </button>

            <div
              ref={containerRef}
              className="h-full"
              style={{ minWidth: "320px" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
