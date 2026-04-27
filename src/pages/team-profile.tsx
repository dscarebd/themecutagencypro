import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Mail, MapPin, Phone, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fallbackTeam, memberImages, portraitsImage } from "@/lib/site-data";
import type { TeamMember } from "@/lib/team";

function MissingProfile() {
  return (
    <section className="px-4 py-24 text-center">
      <Helmet>
        <title>Profile not found — Theme Cut Agency</title>
        <meta name="description" content="The requested team profile could not be found." />
      </Helmet>
      <h1 className="font-display text-5xl font-black">Profile not found</h1>
      <Button asChild className="mt-6 rounded-full"><Link to="/team">Back to team</Link></Button>
    </section>
  );
}

function resolveImage(value: string, slug: string) {
  return value.startsWith("/src/assets") ? memberImages[slug] ?? portraitsImage : value;
}

export default function TeamProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const member = (fallbackTeam as TeamMember[]).find((m) => m.slug === slug);
  if (!member) return <MissingProfile />;
  const image = resolveImage(member.image_url, member.slug);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`${member.name} — Theme Cut Agency Team`}</title>
        <meta name="description" content={member.bio.slice(0, 155)} />
        <meta property="og:title" content={`${member.name} — ${member.role}`} />
        <meta property="og:description" content={member.review} />
        <meta property="og:image" content={image} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <img src={image} alt={`${member.name}, ${member.role}`} className="aspect-square w-full rounded-[2rem] border-4 border-card object-cover shadow-2xl" decoding="async" fetchPriority="high" width={768} height={768} />
        <div className="flex flex-col justify-center">
          <p className="font-black uppercase text-accent">{member.role}</p>
          <h1 className="mt-3 font-display text-6xl font-black">{member.name}</h1>
          <p className="mt-5 text-xl text-muted-foreground">{member.bio}</p>
          <div className="mt-6 flex flex-wrap gap-2">{member.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">{skill}</span>)}</div>
          <Card className="mt-8 rounded-3xl border-2 bg-card/85"><CardContent className="p-6"><Star className="h-6 w-6 text-pop" /><p className="mt-3 text-lg font-bold">“{member.review}”</p></CardContent></Card>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full"><a href={`mailto:${member.email}`}><Mail className="h-4 w-4" /> {member.email}</a></Button>
            {member.address && <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground shadow-sm"><MapPin className="h-4 w-4" /> {member.address}</span>}
            <Button asChild variant="secondary" className="rounded-full"><a href={`tel:${member.phone}`}><Phone className="h-4 w-4" /> {member.phone}</a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
