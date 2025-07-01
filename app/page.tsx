"use client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import LandingSection from "./components/LandingSection";
import ServicesSection from "./components/ServicesSection";
import PastProject from "./components/PastProject";
import ContactUs from "./components/ContactUS";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Prevent hydration mismatch

  return (
   <div>
    <LandingSection/>
    <ServicesSection/>
    <PastProject/>
    <ContactUs/>
   </div>
  );
}
