import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone, Quote, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { memberImages, portraitsImage } from "@/lib/site-data";
import type { TeamMember } from "@/lib/team.functions";

export function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="font-display text-sm font-black uppercase text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-black text-foreground sm:text-6xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{copy}</p>
    </div>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member, index) => (
        <Card key={member.id} className="group overflow-hidden rounded-3xl border-2 bg-card/88 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <img src={resolveImage(member.image_url, member.slug)} alt={`${member.name}, ${member.role}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading={index < 2 ? "eager" : "lazy"} width={1024} height={768} />
            <div className="absolute left-4 top-4 rounded-full bg-pop px-3 py-1 text-xs font-black text-pop-foreground">#{member.display_order}</div>
          </div>
          <CardContent className="p-5">
            <h2 className="font-display text-2xl font-black">{member.name}</h2>
            <p className="font-bold text-primary">{member.role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {member.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{skill}</span>)}
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{member.bio}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button asChild className="rounded-full">
                <Link to="/team/$slug" params={{ slug: member.slug }}>Profile <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <div className="flex gap-2 text-muted-foreground">
                <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}><Mail className="h-4 w-4" /></a>
                <a href={`tel:${member.phone}`} aria-label={`Call ${member.name}`}><Phone className="h-4 w-4" /></a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ReviewStrip() {
  return (
    <section className="overflow-hidden border-y bg-foreground py-5 text-background">
      <div className="ticker flex w-max gap-4 whitespace-nowrap">
        {[...Array(2)].map((_, repeat) => ["Fast edits", "Global social campaigns", "Bright brand systems", "Creator-ready launch kits", "Weekly content engine"].map((item) => (
          <span key={`${repeat}-${item}`} className="mx-4 inline-flex items-center gap-2 font-display text-xl font-black"><Star className="h-5 w-5 text-pop" /> {item}</span>
        )))}
      </div>
    </section>
  );
}

export function QuoteCard({ text, author }: { text: string; author: string }) {
  return (
    <Card className="rounded-3xl border-2 bg-card/80 shadow-xl">
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-accent" />
        <p className="mt-4 text-lg font-bold">“{text}”</p>
        <p className="mt-4 text-sm font-black text-primary">{author}</p>
      </CardContent>
    </Card>
  );
}

function resolveImage(value: string, slug: string) {
  return value.startsWith("/src/assets") ? memberImages[slug] ?? portraitsImage : value;
}
