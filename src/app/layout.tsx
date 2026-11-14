import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://r7la.afterlight.space"),
  title: {
    default: "R7LA — Humanity's Footprints Beyond Earth",
    template: "%s · R7LA",
  },
  description:
    "An interactive space archaeology archive of human-made objects on the Moon and Mars. Investigate rovers, landers, experiments, mission timelines, and evidence.",
  keywords: [
    "space archaeology",
    "Moon",
    "Mars",
    "Apollo",
    "NASA",
    "rover",
    "heritage",
    "AFTERLIGHT",
  ],
  authors: [{ name: "AFTERLIGHT" }],
  openGraph: {
    title: "R7LA",
    description:
      "Humanity's footprints beyond Earth. An independent interactive archive of space archaeology.",
    type: "website",
    siteName: "R7LA",
  },
  twitter: {
    card: "summary_large_image",
    title: "R7LA",
    description:
      "Humanity's footprints beyond Earth. An interactive space archaeology archive.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07131F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 border border-gold bg-abyss px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-gold transition-transform focus:translate-y-0"
        >
          Skip to archive
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
