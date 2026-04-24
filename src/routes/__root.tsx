import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { AgencyLayout } from "@/components/agency-layout";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <AgencyLayout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="max-w-md text-center">
          <h1 className="font-display text-8xl font-black text-foreground">404</h1>
          <h2 className="mt-4 text-2xl font-black text-foreground">Page not found</h2>
          <p className="mt-2 text-muted-foreground">This cut did not make the final timeline.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-black text-primary-foreground">Go home</Link>
        </div>
      </div>
    </AgencyLayout>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Theme Cut Agency — Playful Video & Social Studio" },
      { name: "description", content: "Theme Cut Agency creates playful video editing, social media, and brand design for international teams." },
      { name: "author", content: "Theme Cut Agency" },
      { property: "og:title", content: "Theme Cut Agency — Playful Video & Social Studio" },
      { property: "og:description", content: "Colorful video editing, social media, and brand design for global brands." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return <AgencyLayout><Outlet /></AgencyLayout>;
}
