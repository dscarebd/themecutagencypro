import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { SectionIntro } from "@/components/page-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fallbackTeam, portraitsImage } from "@/lib/site-data";
import { deleteTeamMember, listTeamMembers, saveTeamMember, type TeamMember } from "@/lib/team.functions";

const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(80),
  image_url: z.string().trim().min(1).max(1000),
  role: z.string().trim().min(1).max(120),
  skills: z.array(z.string().trim().min(1).max(60)).min(1).max(8),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(255),
  bio: z.string().trim().min(1).max(1200),
  review: z.string().trim().min(1).max(600),
  display_order: z.number().int().min(0).max(999),
});

type FormState = z.infer<typeof formSchema>;

export const Route = createFileRoute("/admin")({
  loader: async () => listTeamMembers(),
  errorComponent: () => <AdminPage initialMembers={fallbackTeam as TeamMember[]} />,
  notFoundComponent: () => <AdminPage initialMembers={fallbackTeam as TeamMember[]} />,
  head: () => ({ meta: [
    { title: "Admin — Theme Cut Agency" },
    { name: "description", content: "Manage Theme Cut Agency team members and dynamic profile URLs." },
    { property: "og:title", content: "Admin — Theme Cut Agency" },
    { property: "og:description", content: "Edit team names, contact details, bios, skills, reviews, and profile URLs." },
  ]}),
  component: () => <AdminPage initialMembers={Route.useLoaderData()} />,
});

function emptyForm(order: number): FormState {
  return { name: "", slug: "", image_url: portraitsImage, role: "", skills: ["Video editing"], phone: "", email: "", bio: "", review: "", display_order: order };
}

function toForm(member: TeamMember): FormState {
  return { id: member.id, name: member.name, slug: member.slug, image_url: member.image_url, role: member.role, skills: member.skills, phone: member.phone, email: member.email, bio: member.bio, review: member.review, display_order: member.display_order };
}

function AdminPage({ initialMembers }: { initialMembers: TeamMember[] }) {
  const router = useRouter();
  const saveMember = useServerFn(saveTeamMember);
  const removeMember = useServerFn(deleteTeamMember);
  const [selectedId, setSelectedId] = useState<string | "new">(initialMembers[0]?.id ?? "new");
  const selected = useMemo(() => initialMembers.find((m) => m.id === selectedId), [initialMembers, selectedId]);
  const [form, setForm] = useState<FormState>(selected ? toForm(selected) : emptyForm(initialMembers.length + 1));
  const [status, setStatus] = useState("");

  function choose(member: TeamMember) { setSelectedId(member.id); setForm(toForm(member)); setStatus(""); }
  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionIntro eyebrow="Admin panel" title="Edit team profiles" copy="No login is enabled yet. Changes here update the public team pages and name-based profile URLs automatically." />
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl"><CardContent className="p-5">
          <Button className="mb-4 w-full rounded-full" onClick={() => { setSelectedId("new"); setForm(emptyForm(initialMembers.length + 1)); }}><Plus className="h-4 w-4" /> New member</Button>
          <div className="space-y-3">{initialMembers.map((member) => <button key={member.id} onClick={() => choose(member)} className="w-full rounded-2xl border bg-background/70 p-4 text-left transition hover:bg-secondary"><p className="font-black">{member.name}</p><p className="text-sm text-muted-foreground">/{member.slug}</p></button>)}</div>
        </CardContent></Card>
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl"><CardContent className="space-y-4 p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" maxLength={120} />
            <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Profile URL slug" maxLength={80} />
            <Input value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Role" maxLength={120} />
            <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" maxLength={255} />
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" maxLength={40} />
            <Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="Image URL" maxLength={1000} />
            <Input type="number" value={form.display_order} onChange={(e) => update("display_order", Number(e.target.value))} placeholder="Display order" />
          </div>
          <Input value={form.skills.join(", ")} onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Skills separated by commas" />
          <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Bio" className="min-h-28" maxLength={1200} />
          <Textarea value={form.review} onChange={(e) => update("review", e.target.value)} placeholder="Review" className="min-h-24" maxLength={600} />
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full" onClick={async () => {
              const parsed = formSchema.safeParse(form);
              if (!parsed.success) { setStatus("Please complete every field with valid details."); return; }
              const saved = await saveMember({ data: parsed.data });
              setStatus(`Saved. Public URL is /team/${saved.slug}`);
              await router.invalidate();
            }}><Save className="h-4 w-4" /> Save</Button>
            {form.id && <Button variant="destructive" className="rounded-full" onClick={async () => { await removeMember({ data: { id: form.id! } }); setStatus("Member removed."); await router.invalidate(); }}><Trash2 className="h-4 w-4" /> Delete</Button>}
            {form.id && selected && <Button asChild variant="secondary" className="rounded-full"><Link to="/team/$slug" params={{ slug: selected.slug }}>View profile</Link></Button>}
          </div>
          {status && <p className="font-bold text-primary">{status}</p>}
        </CardContent></Card>
      </div>
    </section>
  );
}
