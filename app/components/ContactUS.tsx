"use client";

import { useRef, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CalendlyPopup from "./CalendlyPopup";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };
    if (!payload.email || !payload.message || !payload.name) {
      toast.error("please fill all the details");
      return null;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        e.currentTarget.reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-20 px-6 md:px-12 max-w-5xl mx-auto"
      id="contact"
    >
      <Toaster
        toastOptions={{
          duration: 5000,
          position: "bottom-center",
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">
          Let’s Connect
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-lg">
          Feel free to reach out for collaborations, freelance work, or just a
          friendly chat.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Info Column */}
        <div className="space-y-6">
          <ContactItem
            icon="https://cdn.simpleicons.org/gmail/EA4335"
            title="Email"
            detail={
              <a
                href="mailto:hsibtain18@gmail.com"
                className="hover:underline text-blue-600 dark:text-blue-400"
              >
                hsibtain18@gmail.com
              </a>
            }
          />
          <ContactItem
            icon="https://cdn.simpleicons.org/phone/25D366"
            title="Phone"
            detail={
              <>
                <p>UAE: +971 528 4839 65</p>
                <p>PK: +92 336 202 4417</p>
              </>
            }
          />
          <ContactItem
            icon="https://cdn.simpleicons.org/googlemaps/4285F4"
            title="Location"
            detail={<p>Dubai, United Arab Emirates</p>}
          />

          <CalendlyPopup />
        </div>

        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md space-y-6 border dark:border-gray-700"
        >
          <Input label="Name" name="name" />
          <Input label="Email" name="email" type="email" />
          <Textarea label="Message" name="message" />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  title,
  detail,
}: {
  icon: string;
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <img src={icon} alt={title} className="w-6 h-6 mt-1" />
      <div>
        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
          {title}
        </h4>
        <div className="text-gray-700 dark:text-gray-300">{detail}</div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-medium text-gray-800 dark:text-gray-200 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Textarea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-medium text-gray-800 dark:text-gray-200 mb-1"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={5}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
