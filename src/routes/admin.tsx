import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { SectionIntro } from "@/components/page-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { fallbackTeam, portraitsImage } from "@/lib/site-data";
import { claimFirstAdmin, deleteTeamMember, getAdminAccess, listTeamMembers, saveTeamMember, type TeamMember } from "@/lib/team.functions";

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
  const checkAccess = useServerFn(getAdminAccess);
  const claimAdmin = useServerFn(claimFirstAdmin);
  const [selectedId, setSelectedId] = useState<string | "new">(initialMembers[0]?.id ?? "new");
  const selected = useMemo(() => initialMembers.find((m) => m.id === selectedId), [initialMembers, selectedId]);
  const [form, setForm] = useState<FormState>(selected ? toForm(selected) : emptyForm(initialMembers.length + 1));
  const [status, setStatus] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [access, setAccess] = useState<{ isAdmin: boolean; canClaimAdmin: boolean; email: string } | null>(null);

  function choose(member: TeamMember) { setSelectedId(member.id); setForm(toForm(member)); setStatus(""); }
  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }

  useEffect(() => {
    async function loadAccess() {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token ?? "";
      setAccessToken(token);
      if (!token) return;
      try { setAccess(await checkAccess({ data: { access_token: token } })); }
      catch { setAccess(null); }
    }
    void loadAccess();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const token = session?.access_token ?? "";
      setAccessToken(token);
      if (!token) { setAccess(null); return; }
      void checkAccess({ data: { access_token: token } }).then(setAccess).catch(() => setAccess(null));
    });
    return () => listener.subscription.unsubscribe();
  }, [checkAccess]);

  async function signInWithGoogle() {
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
  }

  async function claimAccess() {
    if (!accessToken) return;
    await claimAdmin({ data: { access_token: accessToken } });
    setAccess(await checkAccess({ data: { access_token: accessToken } }));
    setStatus("Admin access enabled.");
  }

  if (!accessToken) return <AdminGate title="Admin sign in" copy="Sign in to edit team member details." action="Continue with Google" onAction={signInWithGoogle} />;
  if (!access?.isAdmin) return <AdminGate title="Admin access required" copy={access?.canClaimAdmin ? "No admin exists yet. Claim admin access for this site." : "This account is signed in, but it does not have admin access."} action={access?.canClaimAdmin ? "Claim admin access" : "Go to home"} onAction={access?.canClaimAdmin ? claimAccess : () => router.navigate({ to: "/" })} />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionIntro eyebrow="Admin panel" title="Edit team profiles" copy={`Signed in as ${access.email}. Changes update the public team pages and profile URLs automatically.`} />
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl"><CardContent className="p-5">
          <Button className="mb-4 w-full rounded-full" onClick={() => { setSelectedId("new"); setForm(emptyForm(initialMembers.length + 1)); }}><Plus className="h-4 w-4" /> New member</Button>
          <div className="space-y-3">{initialMembers.map((member) => <button key={member.id} onClick={() => choose(member)} className="w-full rounded-2xl border bg-background/70 p-4 text-left transition hover:bg-secondary"><p className="font-black">{member.name}</p><p className="text-sm text-muted-foreground">/{member.slug}</p></button>)}</div>
        </CardContent></Card>
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl"><CardContent className="space-y-4 p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" maxLength={120} /></Field>
            <Field label="Profile URL"><Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Profile URL slug" maxLength={80} /></Field>
            <Field label="Role"><Input value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Role" maxLength={120} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" maxLength={255} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" maxLength={40} /></Field>
            <Field label="Image URL"><Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="Image URL" maxLength={1000} /></Field>
            <Field label="Display order"><Input type="number" value={form.display_order} onChange={(e) => update("display_order", Number(e.target.value))} placeholder="Display order" /></Field>
          </div>
          <Field label="Skills"><Input value={form.skills.join(", ")} onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Skills separated by commas" /></Field>
          <Field label="Bio"><Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Bio" className="min-h-28" maxLength={1200} /></Field>
          <Field label="Review"><Textarea value={form.review} onChange={(e) => update("review", e.target.value)} placeholder="Review" className="min-h-24" maxLength={600} /></Field>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full" onClick={async () => {
              const parsed = formSchema.safeParse(form);
              if (!parsed.success) { setStatus("Please complete every field with valid details."); return; }
              const saved = await saveMember({ data: { ...parsed.data, access_token: accessToken } });
              setStatus(`Saved. Public URL is /team/${saved.slug}`);
              await router.invalidate();
            }}><Save className="h-4 w-4" /> Save</Button>
            {form.id && <Button variant="destructive" className="rounded-full" onClick={async () => { await removeMember({ data: { id: form.id!, access_token: accessToken } }); setStatus("Member removed."); await router.invalidate(); }}><Trash2 className="h-4 w-4" /> Delete</Button>}
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

function AdminGate({ title, copy, action, onAction }: { title: string; copy: string; action: string; onAction: () => void | Promise<void> }) {
  return <section className="mx-auto flex min-h-[64vh] max-w-xl items-center px-4 py-16"><Card className="w-full rounded-[2rem] border-2 bg-card/95 shadow-xl"><CardContent className="p-8 text-center"><p className="font-black uppercase text-accent">Admin panel</p><h1 className="mt-3 font-display text-4xl font-black text-card-foreground">{title}</h1><p className="mt-3 text-muted-foreground">{copy}</p><Button className="mt-6 rounded-full" onClick={onAction}>{action}</Button></CardContent></Card></section>;
}
