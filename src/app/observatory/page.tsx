import type { Metadata } from "next";
import { R7LAMount } from "@/components/r7la/r7la-mount";

export const metadata: Metadata = {
  title: "3D Observatory",
  description:
    "An interactive 3D launchpad, orbital observatory, and artifact inspection experience. Thirteen historic objects across the Moon, Mars, and deep space.",
};

export default function ObservatoryPage() {
  return <R7LAMount />;
}
