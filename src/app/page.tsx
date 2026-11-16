"use client";

import { motion } from "motion/react";
import {
  HiSparkles,
  HiOutlineHomeModern,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineCodeBracket,
} from "react-icons/hi2";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiPrettier,
  SiReact,
  SiBun,
} from "react-icons/si";

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
    name: "React Icons",
    icon: SiReact,
    description: "Popular icon packs ready to import in one package.",
  },
  {
    name: "Prettier",
    icon: SiPrettier,
    description: "Code formatting with automated Tailwind class sorting.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-sky-500/20 to-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 -bottom-40 h-[400px] w-[500px] rounded-full bg-gradient-to-br from-blue-600/15 via-teal-500/10 to-indigo-700/15 blur-3xl" />

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-12 md:px-12">
        {/* Header / Nav */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between border-b border-slate-800/80 pb-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-lg shadow-indigo-500/25">
              <HiOutlineHomeModern className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                RealEstate Next
              </span>
              <span className="ml-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300">
                Bun Powered
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Ready for development
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="my-auto py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-md"
            >
              <HiSparkles className="h-4 w-4 text-indigo-400" />
              <span>Tailwind CSS • Motion.dev • React Icons • Prettier</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
            >
              Built for Speed &amp; Elegance.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg"
            >
              Your modern Next.js project is fully initialized with Bun,
              Tailwind CSS, Motion animations, React Icons, and Prettier
              configuration.
            </motion.p>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#features"
                className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
              >
                <span>Explore Setup</span>
                <HiOutlineBolt className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="https://motion.dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/80"
              >
                <HiOutlineCodeBracket className="h-4 w-4 text-indigo-400" />
                <span>Motion Docs</span>
              </a>
            </motion.div>
          </div>

          {/* Cards Grid */}
          <section id="features" className="mt-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx + 0.3 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:border-slate-700/80 hover:bg-slate-900/90"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-100 transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <HiOutlineCheckCircle className="h-5 w-5 text-emerald-400/80" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 pt-6 text-center text-xs text-slate-500">
          <p>Ready to build with Next.js, Bun &amp; Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
}
