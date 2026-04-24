import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

export type TeamMember = Tables<"team_members">;

const memberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(80).optional(),
  image_url: z.string().trim().min(1).max(1000),
  role: z.string().trim().min(1).max(120),
  skills: z.array(z.string().trim().min(1).max(60)).min(1).max(8),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(255),
  bio: z.string().trim().min(1).max(1200),
  review: z.string().trim().min(1).max(600),
  display_order: z.number().int().min(0).max(999),
});

const slugInputSchema = z.object({ slug: z.string().trim().min(1).max(160) });
const accessTokenSchema = z.string().trim().min(20).max(4096);
const saveInputSchema = memberSchema.extend({ access_token: accessTokenSchema });
const deleteInputSchema = z.object({ id: z.string().uuid(), access_token: accessTokenSchema });
const authInputSchema = z.object({ access_token: accessTokenSchema });

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "team-member";
}

async function uniqueSlug(name: string, id?: string) {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data || data.id === id) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function getUserIdFromToken(accessToken: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Please sign in to continue.");
  return { userId: data.user.id, email: data.user.email ?? "" };
}

async function adminCount() {
  const { count, error } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function assertAdmin(accessToken: string) {
  const user = await getUserIdFromToken(accessToken);
  const { data, error } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("id")
    .eq("user_id", user.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Admin access is required.");
  return user;
}

export const listTeamMembers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getTeamMemberBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => slugInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: member, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!member) throw notFound();
    return member;
  });

export const getAdminAccess = createServerFn({ method: "POST" })
  .inputValidator((input) => authInputSchema.parse(input))
  .handler(async ({ data }) => {
    const user = await getUserIdFromToken(data.access_token);
    const { data: role, error } = await (supabaseAdmin as any)
      .from("user_roles")
      .select("id")
      .eq("user_id", user.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { authenticated: true, isAdmin: Boolean(role), canClaimAdmin: (await adminCount()) === 0, email: user.email };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((input) => authInputSchema.parse(input))
  .handler(async ({ data }) => {
    const user = await getUserIdFromToken(data.access_token);
    if ((await adminCount()) > 0) throw new Error("An admin already exists.");
    const { error } = await (supabaseAdmin as any).from("user_roles").insert({ user_id: user.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true, email: user.email };
  });

export const saveTeamMember = createServerFn({ method: "POST" })
  .inputValidator((input) => saveInputSchema.parse(input))
  .handler(async ({ data }) => {
    await assertAdmin(data.access_token);
    const { access_token, ...memberData } = data;
    const slug = await uniqueSlug(memberData.slug || memberData.name, memberData.id);
    const payload = { ...memberData, slug };
    const query = memberData.id
      ? supabaseAdmin.from("team_members").update(payload).eq("id", memberData.id).select("*").single()
      : supabaseAdmin.from("team_members").insert(payload).select("*").single();
    const { data: member, error } = await query;
    if (error) throw new Error(error.message);
    return member;
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .inputValidator((input) => deleteInputSchema.parse(input))
  .handler(async ({ data }) => {
    await assertAdmin(data.access_token);
    const { error } = await supabaseAdmin.from("team_members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
