"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function ContactUs() {
  const cardRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 p-4">
      <div
        ref={cardRef}
        className="w-full max-w-md p-8 bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-white/20 text-center text-gray-800 dark:text-white"
      >
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-bold mb-6 tracking-wide"
        >
          Get in Touch
        </h2>

        <div className="space-y-4 text-lg">
          <p>
            📞 <strong>Phone 1:</strong>{" "}
            <a
              href="tel:+971528483965"
              className="underline text-blue-600 dark:text-yellow-300 hover:opacity-90"
            >
              +971 528 4839 65
            </a>
          </p>
          <p>
            📞 <strong>Phone 2:</strong>{" "}
            <a
              href="tel:+923362024417"
              className="underline text-blue-600 dark:text-yellow-300 hover:opacity-90"
            >
              +92 336 202-4417
            </a>
          </p>
          <p>
            📧 <strong>Email:</strong>{" "}
            <a
              href="mailto:hsibtain18@gmail.com"
              className="underline text-blue-600 dark:text-yellow-300 hover:opacity-90"
            >
              hsibtain18@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-600 dark:text-gray-300">
          I love to hear from you. Feel free to reach out anytime.
        </div>
      </div>
    </div>
  );
}