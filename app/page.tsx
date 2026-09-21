import Hero from "@/components/sections/Hero";
import Currently from "@/components/sections/Currently";
import Proof from "@/components/sections/Proof";
import SelectedWork from "@/components/sections/SelectedWork";
import Trajectory from "@/components/sections/Trajectory";
import Experiments from "@/components/sections/Experiments";
import Experience from "@/components/sections/Experience";
import Toolbox from "@/components/sections/Toolbox";
import DevlogPreview from "@/components/sections/DevlogPreview";
import AiChatbot from "@/components/sections/AiChatbot";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Currently />
      <Proof />
      <SelectedWork />
      <Trajectory />
      <Experiments />
      <Experience />
      <Toolbox />
      <DevlogPreview />
      <AiChatbot />
      <Contact />
    </main>
  );
}
