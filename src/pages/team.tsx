import { Helmet } from "react-helmet-async";

import { SectionIntro, TeamGrid } from "@/components/page-sections";
import { fallbackTeam, teamImage } from "@/lib/site-data";
import type { TeamMember } from "@/lib/team";

export default function TeamPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Team — Theme Cut Agency</title>
        <meta name="description" content="Meet Theme Cut Agency video editors, social strategists, and brand designers." />
        <meta property="og:title" content="Team — Theme Cut Agency" />
        <meta property="og:description" content="Meet the colorful creative team behind Theme Cut Agency." />
        <meta property="og:image" content={teamImage} />
        <meta name="twitter:image" content={teamImage} />
      </Helmet>
      <SectionIntro eyebrow="Team" title="Editors, strategists, designers" copy="Every team profile includes role, skills, phone, email, bio, and a clean profile URL." />
      <TeamGrid members={fallbackTeam as TeamMember[]} />
    </section>
  );
}
