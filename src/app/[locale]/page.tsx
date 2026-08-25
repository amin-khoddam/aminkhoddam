import { MotionPreferences } from "@/components/shared/motion-preferences";
import { AboutSection } from "@/features/portfolio/components/about-section";
import { ContactSection } from "@/features/portfolio/components/contact-section";
import { ExperienceSection } from "@/features/portfolio/components/experience-section";
import { HeroSection } from "@/features/portfolio/components/hero-section";
import { ProjectsSection } from "@/features/portfolio/components/projects-section";
import { SkillsSection } from "@/features/portfolio/components/skills-section";

export default function HomePage() {
  return (
    <MotionPreferences>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </MotionPreferences>
  );
}
