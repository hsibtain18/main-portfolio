"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePreferenceStore } from "../stores/useDashboardStore";

export default function InitSubID() {
  const { data: session } = useSession();
  const setSubID = usePreferenceStore((state) => state.setSubID);

  useEffect(() => {
    if (session?.user?.userId) {
      setSubID(session.user.userId); // ✅ save it to Zustand
    }
  }, [session, setSubID]);

  return null; // nothing visual
}