"use client";

import { useEffect } from "react";
import { getVisitorDetails } from "./experienceData";
import { apiPost } from "@/lib/apis";
import { usePreferenceStore } from "../stores/useDashboardStore";

function hexToBytes(hex: string) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export default function useTrackVisit() {
      const { subID } = usePreferenceStore();
    
  useEffect(() => {
    async function track() {
      try {
        const visitorDetails = await getVisitorDetails();

        const keyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;
        const keyBytes = hexToBytes(keyHex);

        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyBytes,
          { name: "AES-GCM" },
          false,
          ["encrypt"]
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const enc = new TextEncoder();
        const encoded = enc.encode(JSON.stringify(visitorDetails));

        const encryptedBuffer = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          cryptoKey,
          encoded
        );

        const encryptedBase64 = btoa(
          String.fromCharCode(...new Uint8Array(encryptedBuffer))
        );

        // await fetch("url-api", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ data: encryptedBase64, iv: Array.from(iv) }),
        // });

        await apiPost("favoritesSave/data-handle", subID, { data: encryptedBase64, iv: Array.from(iv) });
      } catch (err) {
        console.error("Failed to track visit:", err);
      }
    }

    track();
  }, [subID]);
}