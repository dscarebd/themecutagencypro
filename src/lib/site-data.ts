export const heroImage = new URL("../assets/cut-agency-hero.jpg", import.meta.url).href;
export const teamImage = new URL("../assets/cut-agency-team.jpg", import.meta.url).href;
export const portraitsImage = new URL("../assets/cut-agency-portraits.jpg", import.meta.url).href;
const mayaImage = new URL("../assets/team-maya-chen.jpg", import.meta.url).href;
const noahImage = new URL("../assets/team-noah-rivera.jpg", import.meta.url).href;
const aishaImage = new URL("../assets/team-aisha-morgan.jpg", import.meta.url).href;
const sofiaImage = new URL("../assets/team-sofia-patel.jpg", import.meta.url).href;
const lucaImage = new URL("../assets/team-luca-kim.jpg", import.meta.url).href;
const zaraImage = new URL("../assets/team-zara-okafor.jpg", import.meta.url).href;
const glowupProjectImage = new URL("../assets/project-glowup-commerce.jpg", import.meta.url).href;
const orbitProjectImage = new URL("../assets/project-orbit-learn.jpg", import.meta.url).href;
const freshfuelProjectImage = new URL("../assets/project-freshfuel.jpg", import.meta.url).href;
const skyloopProjectImage = new URL("../assets/project-skyloop-travel.jpg", import.meta.url).href;

export const memberImages: Record<string, string> = {
  "maya-chen": mayaImage,
  "noah-rivera": noahImage,
  "aisha-morgan": aishaImage,
  "sofia-patel": sofiaImage,
  "luca-kim": lucaImage,
  "zara-okafor": zaraImage,
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
    image: glowupProjectImage,
    copy: "A 21-day short-form launch system with product teasers, founder clips, and creator ads for a beauty brand entering three markets.",
  },
  {
    title: "Orbit Learn Creator Kit",
    type: "Brand design + templates",
    metric: "64 assets delivered",
    image: orbitProjectImage,
    copy: "A playful learning brand kit with animated thumbnails, post templates, motion stickers, and a reusable pitch deck system.",
  },
  {
    title: "FreshFuel Social Sprint",
    type: "Social media growth",
    metric: "3.8M organic reach",
    image: freshfuelProjectImage,
    copy: "Trend-led restaurant content that mixed kinetic food edits, influencer prompts, and weekly analytics-backed creative tests.",
  },
  {
    title: "SkyLoop Travel Reels",
    type: "Travel content + creator edits",
    metric: "42 reels in 6 weeks",
    image: skyloopProjectImage,
    copy: "A bright travel-app campaign with destination reels, creator voiceovers, and fast-cut itineraries built for mobile discovery.",
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
    address: "San Francisco, USA",
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
    address: "London, UK",
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
    address: "Dubai, UAE",
    email: "aisha@cutagency.studio",
    bio: "Aisha creates bright identity systems, launch visuals, and creator-ready brand kits for digital-first companies.",
    review: "Aisha gave our brand the confidence and color it was missing.",
    display_order: 3,
  },
  {
    id: "sofia",
    name: "Sofia Patel",
    slug: "sofia-patel",
    image_url: sofiaImage,
    role: "Creative Producer",
    skills: ["Shoot planning", "Client briefs", "Production flow"],
    phone: "+1 647 555 0174",
    address: "Toronto, Canada",
    email: "sofia@cutagency.studio",
    bio: "Sofia turns messy creative ideas into calm production plans, clear shot lists, and smooth delivery rhythms.",
    review: "Sofia made our campaign feel organized, bright, and effortless from the first call.",
    display_order: 4,
  },
  {
    id: "luca",
    name: "Luca Kim",
    slug: "luca-kim",
    image_url: lucaImage,
    role: "Motion Designer",
    skills: ["Animated captions", "Kinetic type", "Social loops"],
    phone: "+82 2 555 0192",
    address: "Seoul, South Korea",
    email: "luca@cutagency.studio",
    bio: "Luca builds punchy motion systems that make edits feel faster, clearer, and more memorable on every feed.",
    review: "Luca’s motion work instantly made our videos feel more premium and alive.",
    display_order: 5,
  },
  {
    id: "zara",
    name: "Zara Okafor",
    slug: "zara-okafor",
    image_url: zaraImage,
    role: "Content Strategist",
    skills: ["Hooks", "Analytics", "Campaign testing"],
    phone: "+234 1 555 0138",
    address: "Lagos, Nigeria",
    email: "zara@cutagency.studio",
    bio: "Zara reads audience signals, shapes creative angles, and helps brands turn weekly ideas into measurable growth.",
    review: "Zara found the content angles our audience actually cared about.",
    display_order: 6,
  },
];
