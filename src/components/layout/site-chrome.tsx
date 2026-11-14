"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive =
    pathname === "/observatory" || pathname?.startsWith("/observatory/");

  if (immersive) {
    return (
      <main id="main-content" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1 pt-[68px]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
