import AgentController from "@/components/AgentController";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <AgentController>
      <main>
        <Hero />
        <Projects />
        <TechStack />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </AgentController>
  );
}
