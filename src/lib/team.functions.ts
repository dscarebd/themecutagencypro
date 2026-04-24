import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

export type TeamMember = Tables<"team_members"> & { address: string };

const memberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(80).optional(),
  image_url: z.string().trim().min(1).max(1000),
  role: z.string().trim().min(1).max(120),
  skills: z.array(z.string().trim().min(1).max(60)).min(1).max(8),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().max(300).default(""),
  email: z.string().trim().email().max(255),
  bio: z.string().trim().min(1).max(1200),
  review: z.string().trim().min(1).max(600),
  display_order: z.number().int().min(0).max(999),
});

const slugInputSchema = z.object({ slug: z.string().trim().min(1).max(160) });
const deleteInputSchema = z.object({ id: z.string().uuid() });
const uploadImageSchema = z.object({
  file_name: z.string().trim().min(1).max(180),
  content_type: z.string().trim().regex(/^image\/(jpeg|png|webp)$/),
  base64: z.string().min(100).max(8_000_000),
});

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

export const listTeamMembers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as TeamMember[];
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
    return member as TeamMember;
  });

export const uploadTeamImage = createServerFn({ method: "POST" })
  .inputValidator((input) => uploadImageSchema.parse(input))
  .handler(async ({ data }) => {
    const extension = data.content_type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const safeName = slugify(data.file_name.replace(/\.[^.]+$/, ""));
    const path = `team/${Date.now()}-${safeName}.${extension}`;
    const bytes = Uint8Array.from(atob(data.base64), (char) => char.charCodeAt(0));
    const { error } = await supabaseAdmin.storage.from("team-images").upload(path, bytes, {
      contentType: data.content_type,
      upsert: true,
    });
    if (error) throw new Error(error.message);
    const { data: publicData } = supabaseAdmin.storage.from("team-images").getPublicUrl(path);
    return { url: publicData.publicUrl };
  });

export const saveTeamMember = createServerFn({ method: "POST" })
  .inputValidator((input) => memberSchema.parse(input))
  .handler(async ({ data }) => {
    const slug = await uniqueSlug(data.slug || data.name, data.id);
    const payload = { ...data, slug };
    const query = data.id
      ? supabaseAdmin.from("team_members").update(payload).eq("id", data.id).select("*").single()
      : supabaseAdmin.from("team_members").insert(payload).select("*").single();
    const { data: member, error } = await query;
    if (error) throw new Error(error.message);
    return member as TeamMember;
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .inputValidator((input) => deleteInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("team_members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
