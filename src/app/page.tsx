import HouseWalkthrough from "@/components/HouseWalkthrough";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Interactive Scroll Walkthrough Section */}
      <div id="walkthrough">
        <HouseWalkthrough />
      </div>
    </main>
  );
}
