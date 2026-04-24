import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { memberImages, portraitsImage } from "@/lib/site-data";
import { getTeamMemberBySlug } from "@/lib/team.functions";

export const Route = createFileRoute("/team/$slug")({
  loader: ({ params }) => getTeamMemberBySlug({ data: { slug: params.slug } }),
  errorComponent: () => <MissingProfile />,
  notFoundComponent: MissingProfile,
  head: ({ loaderData }) => {
    const member = loaderData;
    const image = member ? resolveImage(member.image_url, member.slug) : undefined;
    return { meta: [
      { title: member ? `${member.name} — Theme Cut Agency Team` : "Team Profile — Theme Cut Agency" },
      { name: "description", content: member?.bio.slice(0, 155) ?? "Theme Cut Agency team profile." },
      { property: "og:title", content: member ? `${member.name} — ${member.role}` : "Team Profile — Theme Cut Agency" },
      { property: "og:description", content: member?.review ?? "Meet a Theme Cut Agency creative team member." },
      ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ] };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const member = Route.useLoaderData();
  const image = resolveImage(member.image_url, member.slug);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <img src={image} alt={`${member.name}, ${member.role}`} className="aspect-square w-full rounded-[2rem] border-4 border-card object-cover shadow-2xl" decoding="async" fetchPriority="high" width={768} height={768} />
        <div className="flex flex-col justify-center">
          <p className="font-black uppercase text-accent">{member.role}</p>
          <h1 className="mt-3 font-display text-6xl font-black">{member.name}</h1>
          <p className="mt-5 text-xl text-muted-foreground">{member.bio}</p>
          <div className="mt-6 flex flex-wrap gap-2">{member.skills.map((skill: string) => <span key={skill} className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">{skill}</span>)}</div>
          <Card className="mt-8 rounded-3xl border-2 bg-card/85"><CardContent className="p-6"><Star className="h-6 w-6 text-pop" /><p className="mt-3 text-lg font-bold">“{member.review}”</p></CardContent></Card>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full"><a href={`mailto:${member.email}`}><Mail className="h-4 w-4" /> {member.email}</a></Button>
            <Button asChild variant="secondary" className="rounded-full"><a href={`tel:${member.phone}`}><Phone className="h-4 w-4" /> {member.phone}</a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissingProfile() {
  return <section className="px-4 py-24 text-center"><h1 className="font-display text-5xl font-black">Profile not found</h1><Button asChild className="mt-6 rounded-full"><Link to="/team">Back to team</Link></Button></section>;
}

function resolveImage(value: string, slug: string) {
  return value.startsWith("/src/assets") ? memberImages[slug] ?? portraitsImage : value;
}
