import { createFileRoute } from "@tanstack/react-router";

import { SectionIntro, TeamGrid } from "@/components/page-sections";
import { fallbackTeam, teamImage } from "@/lib/site-data";
import { listTeamMembers } from "@/lib/team.functions";

export const Route = createFileRoute("/team/")({
  loader: async () => listTeamMembers(),
  errorComponent: () => <TeamPage members={fallbackTeam as any} />,
  notFoundComponent: () => <TeamPage members={fallbackTeam as any} />,
  head: () => ({ meta: [
    { title: "Team — Theme Cut Agency" },
    { name: "description", content: "Meet Theme Cut Agency video editors, social strategists, and brand designers." },
    { property: "og:title", content: "Team — Theme Cut Agency" },
    { property: "og:description", content: "Meet the colorful creative team behind Theme Cut Agency." },
    { property: "og:image", content: teamImage },
    { name: "twitter:image", content: teamImage },
  ]}),
  component: () => <TeamPage members={Route.useLoaderData()} />,
});

function TeamPage({ members }: { members: Awaited<ReturnType<typeof listTeamMembers>> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionIntro eyebrow="Team" title="Editors, strategists, designers" copy="Every team profile includes role, skills, phone, email, bio, review, and a clean dynamic URL." />
      <TeamGrid members={members as any} />
    </section>
  );
}