"use client";

import HouseWalkthrough from "@/components/HouseWalkthrough";
import { motion } from "motion/react";
import {
  HiSparkles,
  HiOutlineHomeModern,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineArrowDown,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";
import { SiNextdotjs, SiTailwindcss, SiPrettier, SiBun } from "react-icons/si";

const propertyHighlights = [
  {
    icon: HiOutlineMapPin,
    title: "Prime Location",
    detail: "Bel Air Crest, Los Angeles, CA",
  },
  {
    icon: HiOutlineSquare3Stack3D,
    title: "Interior Area",
    detail: "8,450 Sq. Ft. • 5 Beds, 7 Baths",
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: "Offering Price",
    detail: "$14,850,000 USD",
  },
  {
    icon: HiOutlineBuildingOffice2,
    title: "Architectural Style",
    detail: "Contemporary Warm Organic",
  },
];

const techStack = [
  {
    name: "Next.js 16 (App Router)",
    icon: SiNextdotjs,
    description: "Modern React framework with Turbopack and server components.",
  },
  {
    name: "Bun",
    icon: SiBun,
    description: "Ultra-fast JavaScript runtime and package manager.",
  },
  {
    name: "Tailwind CSS v4",
    icon: SiTailwindcss,
    description:
      "Utility-first modern styling system built for high performance.",
  },
  {
    name: "Motion.dev",
    icon: HiOutlineBolt,
    description: "Smooth, declarative production-ready animations.",
  },
  {
    name: "Canvas Scroll Walkthrough",
    icon: HiOutlineHomeModern,
    description:
      "Preloaded 100-frame 60FPS scroll-synchronized canvas animation.",
  },
  {
    name: "Prettier & Tailwind Plugin",
    icon: SiPrettier,
    description:
      "Automated code formatting and class ordering for consistency.",
  },
];

export default function Home() {
  const scrollToWalkthrough = () => {
    const el = document.getElementById("walkthrough");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Interactive Scroll Walkthrough Section */}
      <div id="walkthrough">
        <HouseWalkthrough />
      </div>
    </div>
  );
}
