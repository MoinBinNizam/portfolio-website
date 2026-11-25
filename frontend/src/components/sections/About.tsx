import { usePublicExperience, usePublicProfile } from '../../features/public/queries';
import { calculateTotalExperienceDuration, formatAboutWithExperience } from '../../lib/experience';
import { MarkdownBody } from '../../lib/markdown';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function About() {
  const { data: profile, isLoading } = usePublicProfile();
  const { data: experience } = usePublicExperience();
  const totalDuration = calculateTotalExperienceDuration(experience ?? []);
  const aboutContent = formatAboutWithExperience(
    profile?.about ??
      "I'm **Moin Uddin**, a **Full-Stack Web Developer** building scalable **MERN, TypeScript, and WordPress** applications. I genuinely enjoy turning complex business ideas into clean, fast, and reliable software.\n\nMy journey started with WordPress, PHP, and MySQL business platforms, grew through conversion-focused web engineering, and expanded into full-stack **React 18, Node.js, Express, and MongoDB** systems including **enterprise inventory, POS, and cooperative finance platforms**. I am also skilled in **RAG, AI Automation, Claude, and Agentic AI development** for safer, faster software delivery.\n\nAlongside shipping products, I've mentored learners in **programming, school ICT, and web development**, helping students build real-world technical confidence. From leading full-stack delivery at **TechVelly** and collaborating with engineering teams in Dhaka to supporting remote clients, every project has taught me to value readable architecture and thoughtful user experience.\n\n**Great software feels effortless to use and easy to maintain.** That's what drives me every day.",
    totalDuration,
  );

  return (
    <section id="about" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="About Me"
                icon="user"
                title="A Developer Who Loves to Build &amp; Share"
              />
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : (
                <div className="space-y-4">
                  <MarkdownBody content={aboutContent} />
                </div>
              )}
            </div>

            <div className="flex justify-center lg:col-span-6">
              <img
                src="/images/about-me-visual.svg"
                alt="Full-stack engineering workflow and architecture visual"
                className="h-auto w-full max-w-lg object-contain"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
