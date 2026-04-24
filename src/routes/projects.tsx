import { createFileRoute } from "@tanstack/react-router";
import { Film, TrendingUp } from "lucide-react";

import { SectionIntro } from "@/components/page-sections";
import { Card, CardContent } from "@/components/ui/card";
import { heroImage, projects } from "@/lib/site-data";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [
    { title: "Projects — Theme Cut Agency" },
    { name: "description", content: "Sample Theme Cut Agency video, social media, and brand design project case studies." },
    { property: "og:title", content: "Projects — Theme Cut Agency" },
    { property: "og:description", content: "Explore colorful campaign case studies from Theme Cut Agency." },
    { property: "og:image", content: heroImage },
    { name: "twitter:image", content: heroImage },
  ]}),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionIntro eyebrow="Projects" title="Campaigns cut for momentum" copy="AI-generated sample case studies showing the kind of international creative systems Theme Cut Agency can produce." />
      <div className="grid gap-6">
        {projects.map((project, index) => (
          <Card key={project.title} className="overflow-hidden rounded-[2rem] border-2 bg-card/90 shadow-xl">
            <CardContent className="grid gap-6 p-6 md:grid-cols-[.9fr_1.1fr] md:p-8">
              <div className="relative min-h-56 rounded-3xl hero-gradient p-6 text-primary-foreground">
                <Film className="h-12 w-12" />
                <p className="absolute bottom-6 left-6 font-display text-6xl font-black">0{index + 1}</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-black text-accent">{project.type}</p>
                <h2 className="mt-2 font-display text-4xl font-black">{project.title}</h2>
                <p className="mt-3 flex items-center gap-2 text-xl font-black text-primary"><TrendingUp className="h-5 w-5" /> {project.metric}</p>
                <p className="mt-5 text-muted-foreground">{project.copy}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
