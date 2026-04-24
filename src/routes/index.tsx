import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, Palette, Play, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteCard, ReviewStrip } from "@/components/page-sections";
import { faqs, heroImage, projects, services, teamImage } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Theme Cut Agency — Playful CapCut-Inspired Creative Studio" },
    { name: "description", content: "Theme Cut Agency is an international video editing, social media, and brand design studio for scroll-stopping campaigns." },
    { property: "og:title", content: "Theme Cut Agency — Playful CapCut-Inspired Creative Studio" },
    { property: "og:description", content: "International video editing, social media, and brand design with colorful motion-first creative." },
    { property: "og:image", content: heroImage },
    { name: "twitter:image", content: heroImage },
  ]}),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative min-h-[82vh] overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10"><img src={heroImage} alt="Colorful video editing studio background" className="h-full w-full object-cover opacity-35" width={1344} height={768} /></div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="animate-fade-in pt-8">
            <p className="inline-flex rounded-full bg-pop px-4 py-2 text-sm font-black text-pop-foreground shadow-lg"><Sparkles className="mr-2 h-4 w-4" /> International playful creative studio</p>
            <h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[.92] text-foreground sm:text-8xl">Theme Cut Agency</h1>
            <p className="mt-6 max-w-2xl text-xl font-bold text-foreground/80">CapCut-inspired edits, social systems, and brand visuals built to make global audiences stop, watch, and share.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full"><Link to="/contact">Start a project <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full"><Link to="/projects">View work</Link></Button>
            </div>
          </div>
          <div className="relative">
            <img src={teamImage} alt="Theme Cut Agency creative team" className="floating-edit aspect-[4/3] w-full rounded-[2rem] border-4 border-card object-cover shadow-2xl" width={1344} height={768} />
            <Card className="floating-edit-delay absolute -bottom-6 left-4 max-w-xs rounded-3xl border-2 bg-card/90 shadow-xl">
              <CardContent className="p-5"><p className="font-display text-4xl font-black text-primary">3.8M</p><p className="text-sm font-bold text-muted-foreground">organic reach generated in one social sprint</p></CardContent>
            </Card>
          </div>
        </div>
      </section>
      <ReviewStrip />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = [Clapperboard, Share2, Palette][index];
            return <Card key={service.title} className="rounded-3xl border-2 bg-card/85 shadow-xl"><CardContent className="p-6"><Icon className="h-10 w-10 text-accent" /><h2 className="mt-5 font-display text-3xl font-black">{service.title}</h2><p className="mt-2 font-bold text-primary">{service.tag}</p><p className="mt-4 text-muted-foreground">{service.copy}</p></CardContent></Card>;
          })}
        </div>
      </section>
      <section className="bg-ink px-4 py-20 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><h2 className="font-display text-5xl font-black">Featured cuts</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{projects.map((project) => <Card key={project.title} className="rounded-3xl border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"><CardContent className="p-6"><Play className="h-9 w-9 text-pop" /><h3 className="mt-4 text-2xl font-black">{project.title}</h3><p className="mt-2 text-pop">{project.metric}</p><p className="mt-4 text-primary-foreground/75">{project.copy}</p></CardContent></Card>)}</div></div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
        <QuoteCard text="Theme Cut Agency gave our content an instantly recognizable rhythm and look." author="Client review" />
        <Card className="rounded-3xl border-2 bg-card/85 shadow-xl"><CardContent className="p-6"><h2 className="font-display text-4xl font-black">FAQ</h2><div className="mt-5 space-y-4">{faqs.slice(0,3).map(([q,a]) => <div key={q}><p className="font-black">{q}</p><p className="text-sm text-muted-foreground">{a}</p></div>)}</div></CardContent></Card>
      </section>
    </>
  );
}
