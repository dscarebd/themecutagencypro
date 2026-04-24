import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ImageUp, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { SectionIntro } from "@/components/page-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fallbackTeam, portraitsImage } from "@/lib/site-data";
import { deleteTeamMember, listTeamMembers, saveTeamMember, uploadTeamImage, type TeamMember } from "@/lib/team.functions";

const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(80),
  image_url: z.string().trim().min(1).max(1000),
  role: z.string().trim().min(1).max(120),
  skills: z.array(z.string().trim().min(1).max(60)).min(1).max(8),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().max(300),
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
  return { name: "", slug: "", image_url: portraitsImage, role: "", skills: ["Video editing"], phone: "", address: "", email: "", bio: "", review: "", display_order: order };
}

function toForm(member: TeamMember): FormState {
  return { id: member.id, name: member.name, slug: member.slug, image_url: member.image_url, role: member.role, skills: member.skills, phone: member.phone, address: member.address ?? "", email: member.email, bio: member.bio, review: member.review, display_order: member.display_order };
}

function slugFromName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function AdminPage({ initialMembers }: { initialMembers: TeamMember[] }) {
  const router = useRouter();
  const saveMember = useServerFn(saveTeamMember);
  const removeMember = useServerFn(deleteTeamMember);
  const uploadImage = useServerFn(uploadTeamImage);
  const [selectedId, setSelectedId] = useState<string | "new">(initialMembers[0]?.id ?? "new");
  const selected = useMemo(() => initialMembers.find((m) => m.id === selectedId), [initialMembers, selectedId]);
  const [form, setForm] = useState<FormState>(selected ? toForm(selected) : emptyForm(initialMembers.length + 1));
  const [status, setStatus] = useState("");

  function choose(member: TeamMember) { setSelectedId(member.id); setForm(toForm(member)); setStatus(""); }
  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function handleImageUpload(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setStatus("Please upload a JPG, PNG, or WEBP image."); return; }
    if (file.size > 6 * 1024 * 1024) { setStatus("Image must be under 6MB."); return; }
    setStatus("Uploading image...");
    const base64 = await fileToBase64(file);
    const uploaded = await uploadImage({ data: { file_name: file.name, content_type: file.type, base64 } });
    update("image_url", uploaded.url);
    setStatus("Image uploaded. Save the profile to publish it.");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionIntro eyebrow="Admin panel" title="Edit team profiles" copy="Changes update the public team pages and profile URLs automatically." />
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl"><CardContent className="p-5">
          <Button className="mb-4 w-full rounded-full" onClick={() => { setSelectedId("new"); setForm(emptyForm(initialMembers.length + 1)); }}><Plus className="h-4 w-4" /> New member</Button>
          <div className="space-y-3">{initialMembers.map((member) => <button key={member.id} onClick={() => choose(member)} className="w-full rounded-2xl border bg-background/70 p-4 text-left transition hover:bg-secondary"><p className="font-black">{member.name}</p><p className="text-sm text-muted-foreground">/{member.slug}</p></button>)}</div>
        </CardContent></Card>
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl"><CardContent className="space-y-4 p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value, slug: slugFromName(e.target.value) }))} placeholder="Name" maxLength={120} /></Field>
            <Field label="Profile URL"><Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Profile URL slug" maxLength={80} /></Field>
            <Field label="Role"><Input value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Role" maxLength={120} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" maxLength={255} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" maxLength={40} /></Field>
            <Field label="Address"><Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Address" maxLength={300} /></Field>
            <Field label="Image URL"><Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="Image URL" maxLength={1000} /></Field>
            <Field label="Display order"><Input type="number" value={form.display_order} onChange={(e) => update("display_order", Number(e.target.value))} placeholder="Display order" /></Field>
          </div>
          <div className="grid gap-3 rounded-3xl border-2 bg-background/70 p-4 sm:grid-cols-[120px_1fr]">
            <img src={form.image_url || portraitsImage} alt="Team member preview" className="aspect-square w-full rounded-2xl object-cover" loading="lazy" decoding="async" width={120} height={120} />
            <div className="flex flex-col justify-center gap-3">
              <Label htmlFor="team-photo" className="flex items-center gap-2 font-black text-foreground"><ImageUp className="h-4 w-4" /> Upload profile photo</Label>
              <Input id="team-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void handleImageUpload(event.target.files?.[0])} />
              <p className="text-sm font-bold text-muted-foreground">JPG, PNG, or WEBP. Upload sets the image URL automatically.</p>
            </div>
          </div>
          <Field label="Skills"><Input value={form.skills.join(", ")} onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Skills separated by commas" /></Field>
          <Field label="Bio"><Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Bio" className="min-h-28" maxLength={1200} /></Field>
          <Field label="Review"><Textarea value={form.review} onChange={(e) => update("review", e.target.value)} placeholder="Review" className="min-h-24" maxLength={600} /></Field>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label className="font-black text-foreground">{label}</Label>{children}</div>;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}
