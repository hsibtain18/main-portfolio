
"use client";

import { useRef, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Script from "next/script"; // Import Script for Calendly
import CalendlyPopup from "./CalendlyPopup";

gsap.registerPlugin(ScrollTrigger);

interface ContactItemProps {
  icon: string;
  title: string;
  detail: React.ReactNode;
}

function ContactItem({ icon, title, detail }: ContactItemProps) {
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

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}: InputProps) {
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
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

interface TextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

function Textarea({ label, name, value, onChange, error }: TextareaProps) {
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
        value={value} // Controlled value
        onChange={onChange} // Handle changes
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null); // Explicitly type useRef
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // State for controlled inputs
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // GSAP animation for section entry
  useEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === containerRef.current) {
        trigger.kill();
      }
    });

    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    // Basic client-side validation
    const newErrors: Record<string, string | undefined> = {};
    if (!formData.name) newErrors.name = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email Address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.message) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      setErrors(newErrors);
      toast.error("Please fill all the required details correctly.");
      setLoading(false);
      return;
    }

    try {
      const apiEndpoint = "/api/contact";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData from state
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form by clearing state
      } else {
        // Attempt to parse error message from response, or use a generic one
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        toast.error(
          `Failed to send message: ${errorData.message || response.statusText}`
        );
      }
    } catch (err) {
      console.error("Submission error:", err); // Use console.error for errors
      toast.error("An unexpected error occurred. Please check your network.");
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
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />

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
        {" "}
        {/* Changed mb-16 to mb-14 for consistency with previous version */}
        <h2 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">
          {" "}
          {/* Changed h1 to h2 */}
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
              <>
                <a
                  href="mailto:hsibtain18@gmail.com"
                  className="hover:underline text-blue-600 dark:text-blue-400" // Reverted to primary-light/dark colors
                  data-hoverable // Make link hoverable for custom cursor
                >
                  hsibtain18@gmail.com
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Send me a message!
                </p>
              </>
            }
          />
          <ContactItem
            icon="https://cdn.simpleicons.org/whatsapp/25D366" // Changed phone icon to WhatsApp
            title="Phone"
            detail={
              <>
                <p>UAE: +971 528 4839 65</p>
                <p>PK: +92 336 202 4417</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Call or WhatsApp me anytime!
                </p>
              </>
            }
          />
          <ContactItem
            icon="https://cdn.simpleicons.org/googlemaps/4285F4"
            title="Location"
            detail={
              <>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Dubai, United Arab Emirates
                </p>
              </>
            }
          />

          {/* Calendly Popup button */}
          <CalendlyPopup />
        </div>

        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md space-y-6 border dark:border-gray-700"
        >
          {/* Controlled Input components */}
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Textarea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            data-hoverable // Make submit button hoverable for custom cursor
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
