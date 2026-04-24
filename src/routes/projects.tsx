import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

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
              <div className="relative min-h-56 overflow-hidden rounded-3xl bg-secondary">
                <img src={project.image} alt={`${project.title} project visual`} className="h-full min-h-56 w-full object-cover" loading={index === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={index === 0 ? "high" : "auto"} width={768} height={576} />
                <p className="absolute bottom-5 left-5 rounded-full bg-pop px-4 py-2 font-display text-2xl font-black text-pop-foreground shadow-lg">0{index + 1}</p>
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
