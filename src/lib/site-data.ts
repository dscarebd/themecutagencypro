import heroImage from "@/assets/cut-agency-hero.jpg";
import teamImage from "@/assets/cut-agency-team.jpg";
import portraitsImage from "@/assets/cut-agency-portraits.jpg";
import mayaImage from "@/assets/team-maya-chen.jpg";
import noahImage from "@/assets/team-noah-rivera.jpg";
import aishaImage from "@/assets/team-aisha-morgan.jpg";

export { heroImage, teamImage, portraitsImage };

export const memberImages: Record<string, string> = {
  "maya-chen": mayaImage,
  "noah-rivera": noahImage,
  "aisha-morgan": aishaImage,
};

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    title: "Video Editing",
    tag: "Reels, Shorts, launch films",
    copy: "High-retention edits with punchy pacing, captions, sound design, and motion cuts made for global feeds.",
  },
  {
    title: "Social Media",
    tag: "Strategy, calendars, trends",
    copy: "Daily content systems that turn brand ideas into repeatable posts, campaign moments, and creator-ready hooks.",
  },
  {
    title: "Brand Design",
    tag: "Identity, decks, social kits",
    copy: "Colorful digital-first identities, campaign visuals, and launch kits that feel alive on every screen.",
  },
];

export const projects = [
  {
    title: "GlowUp Commerce Launch",
    type: "Video editing + social campaign",
    metric: "+182% view-through rate",
    copy: "A 21-day short-form launch system with product teasers, founder clips, and creator ads for a beauty brand entering three markets.",
  },
  {
    title: "Orbit Learn Creator Kit",
    type: "Brand design + templates",
    metric: "64 assets delivered",
    copy: "A playful learning brand kit with animated thumbnails, post templates, motion stickers, and a reusable pitch deck system.",
  },
  {
    title: "FreshFuel Social Sprint",
    type: "Social media growth",
    metric: "3.8M organic reach",
    copy: "Trend-led restaurant content that mixed kinetic food edits, influencer prompts, and weekly analytics-backed creative tests.",
  },
];

export const faqs = [
  ["How fast can Theme Cut Agency deliver?", "Most short-form editing sprints start within 48 hours and weekly content packs ship on a clear production calendar."],
  ["Do you work with international brands?", "Yes. Our process is remote-first, timezone-aware, and built for founders, creators, and teams across markets."],
  ["Can you manage both design and editing?", "Yes. We combine editing, social systems, and brand visuals so campaigns feel consistent from scroll to sale."],
  ["Can team profiles be edited?", "Yes. The admin panel lets you update names, roles, bios, contact details, skills, reviews, images, and profile URLs."],
] as const;

export const fallbackTeam = [
  {
    id: "maya",
    name: "Maya Chen",
    slug: "maya-chen",
    image_url: mayaImage,
    role: "Lead Video Editor",
    skills: ["Short-form edits", "Motion cuts", "Color rhythm"],
    phone: "+1 415 555 0198",
    email: "maya@cutagency.studio",
    bio: "Maya shapes fast-moving footage into scroll-stopping stories for founders, creators, and global launch teams.",
    review: "Maya turned raw launch clips into our best-performing campaign of the year.",
    display_order: 1,
  },
  {
    id: "noah",
    name: "Noah Rivera",
    slug: "noah-rivera",
    image_url: noahImage,
    role: "Social Growth Strategist",
    skills: ["Content calendars", "Trend mapping", "Community hooks"],
    phone: "+44 20 7946 0831",
    email: "noah@cutagency.studio",
    bio: "Noah builds social systems that pair daily publishing discipline with playful creative direction.",
    review: "Noah helped us move from random posting to a consistent global content engine.",
    display_order: 2,
  },
  {
    id: "aisha",
    name: "Aisha Morgan",
    slug: "aisha-morgan",
    image_url: aishaImage,
    role: "Brand Design Director",
    skills: ["Identity systems", "Campaign art", "Creator kits"],
    phone: "+971 50 555 2841",
    email: "aisha@cutagency.studio",
    bio: "Aisha creates bright identity systems, launch visuals, and creator-ready brand kits for digital-first companies.",
    review: "Aisha gave our brand the confidence and color it was missing.",
    display_order: 3,
  },
];
