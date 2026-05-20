"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      console.warn("ScrollToTop failed:", e);
    }
  }, [pathname]);

  return null;
}
