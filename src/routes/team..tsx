import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { portraitsImage } from "@/lib/site-data";
import { getTeamMemberBySlug } from "@/lib/team.functions";

export const Route = createFileRoute("/team/")({
  loader: ({ params }) => getTeamMemberBySlug({ data: { slug: params.slug } }),
  errorComponent: () => <MissingProfile />,
  notFoundComponent: MissingProfile,
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData.name} — Cut Agency Team` },
    { name: "description", content: loaderData.bio.slice(0, 155) },
    { property: "og:title", content: `${loaderData.name} — ${loaderData.role}` },
    { property: "og:description", content: loaderData.review },
    { property: "og:image", content: loaderData.image_url.startsWith("/src/assets") ? portraitsImage : loaderData.image_url },
    { name: "twitter:image", content: loaderData.image_url.startsWith("/src/assets") ? portraitsImage : loaderData.image_url },
  ]}),
  component: ProfilePage,
});

function ProfilePage() {
  const member = Route.useLoaderData();
  const image = member.image_url.startsWith("/src/assets") ? portraitsImage : member.image_url;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <img src={image} alt={`${member.name}, ${member.role}`} className="aspect-square w-full rounded-[2rem] border-4 border-card object-cover shadow-2xl" width={1024} height={1024} />
        <div className="flex flex-col justify-center">
          <p className="font-black uppercase text-accent">{member.role}</p>
          <h1 className="mt-3 font-display text-6xl font-black">{member.name}</h1>
          <p className="mt-5 text-xl text-muted-foreground">{member.bio}</p>
          <div className="mt-6 flex flex-wrap gap-2">{member.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">{skill}</span>)}</div>
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
