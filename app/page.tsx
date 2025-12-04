import Hero from "@/components/Sections/Hero";
import ImoveisDestacados from "@/components/Sections/ImoveisDestacados/ImoveisDestacados";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import ZonasMaisDesejadas from "@/components/Sections/ZonasMaisDesejadas/ZonasMaisDesejadas";

export default function Home() {
  return (
    <>
      <Hero />
      <ImoveisDestacados />
      <ZonasMaisDesejadas/>
      <Testemunhos/>
    </>
  );
}
