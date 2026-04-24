import { createFileRoute, Link } from "@tanstack/react-router";
import { Clapperboard, Palette, Share2 } from "lucide-react";

import { SectionIntro } from "@/components/page-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { heroImage, services } from "@/lib/site-data";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Services — Cut Agency" },
    { name: "description", content: "Video editing, social media, and brand design services for international campaigns." },
    { property: "og:title", content: "Services — Cut Agency" },
    { property: "og:description", content: "Explore Cut Agency video editing, social media, and brand design services." },
    { property: "og:image", content: heroImage },
    { name: "twitter:image", content: heroImage },
  ]}),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionIntro eyebrow="Services" title="Creative systems for every scroll" copy="Choose a focused sprint or combine editing, social, and brand design into one playful growth engine." />
      <div className="grid gap-6 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = [Clapperboard, Share2, Palette][index];
          return (
            <Card key={service.title} className="rounded-3xl border-2 bg-card/90 shadow-xl">
              <CardContent className="p-7">
                <Icon className="h-12 w-12 text-accent" />
                <h2 className="mt-5 font-display text-3xl font-black">{service.title}</h2>
                <p className="mt-2 font-black text-primary">{service.tag}</p>
                <p className="mt-4 text-muted-foreground">{service.copy}</p>
                <ul className="mt-6 space-y-3 text-sm font-bold">
                  <li>• Creative direction and weekly review</li>
                  <li>• Platform-ready export formats</li>
                  <li>• Analytics-informed iteration</li>
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-12 rounded-[2rem] bg-ink p-8 text-primary-foreground shadow-2xl md:p-12">
        <h2 className="font-display text-4xl font-black">Need a full content team without hiring one?</h2>
        <p className="mt-3 max-w-2xl text-primary-foreground/75">We plug into your launch calendar, build the creative pipeline, and deliver consistent assets for every key channel.</p>
        <Button asChild className="mt-6 rounded-full"><Link to="/contact">Book a creative call</Link></Button>
      </div>
    </section>
  );
}
