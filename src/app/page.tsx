import HouseWalkthrough from "@/components/HouseWalkthrough";
import AccordionGallery from "@/components/AccordionGallery";
import { BeforeAfterSlider } from "@/components/motion/before-after-slider";

export default function Home() {
  const items = [
    {
      image: "https://picsum.photos/id/1015/900/1200",
      label: "Canyon",
      link: "#",
    },
    {
      image: "https://picsum.photos/id/1018/900/1200",
      label: "Ridgeline",
      link: "#",
    },
    {
      image: "https://picsum.photos/id/1039/900/1200",
      label: "Falls",
      link: "#",
    },
  ];

  const PHOTO =
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80";

  return (
    <main className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Interactive Scroll Walkthrough Section */}
      <div id="walkthrough">
        <HouseWalkthrough />
      </div>

      <AccordionGallery
        items={items}
        defaultIndex={2}
        expandRatio={0.52}
        trigger="hover"
        accentColor="#ffffff"
        overlayColor="#060010"
        textColor="#ffffff"
        grayscale
        showLabels
        duration={0.6}
        ease="power3.out"
        parallax={0.5}
        tilt={8}
        stagger={0.06}
        height={460}
        gap={10}
        radius={16}
        orientation="horizontal"
      />

      <div className="mx-auto w-full max-w-xl min-w-0 px-4 py-6">
        <BeforeAfterSlider
          before={
            <img
              src={PHOTO}
              alt="Lake house at dawn, unedited"
              draggable={false}
              className="h-full w-full object-cover brightness-90 contrast-75 grayscale"
            />
          }
          after={
            <img
              src={PHOTO}
              alt="Lake house at dawn, color graded"
              draggable={false}
              className="h-full w-full object-cover"
            />
          }
        />
      </div>
    </main>
  );
}
