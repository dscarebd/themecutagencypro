import { Link, Outlet } from "@tanstack/react-router";
import { Sparkles, Scissors, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/site-data";

export function AgencyLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-40 border-b bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-black text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl hero-gradient text-primary-foreground shadow-lg">
              <Scissors className="h-5 w-5" />
            </span>
            Theme Cut Agency
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden rounded-full sm:inline-flex">
              <Link to="/admin"><Sparkles className="h-4 w-4" /> Admin</Link>
            </Button>
            <Button asChild variant="secondary" size="icon" className="rounded-full md:hidden" aria-label="Open navigation">
              <Link to="/services"><Menu className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>
      <main>{children ?? <Outlet />}</main>
      <footer className="border-t-4 border-primary bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_.8fr_.8fr_1fr] lg:px-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-black text-background">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl hero-gradient text-primary-foreground shadow-lg">
                <Scissors className="h-5 w-5" />
              </span>
              Theme Cut Agency
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-background/80">Playful video editing, social media, and brand design for international teams that need scroll-stopping creative every week.</p>
          </div>
          <div>
            <p className="font-black">Explore</p>
            <div className="mt-4 grid gap-2 text-sm text-background/80">
              {navItems.map((item) => <Link key={item.to} to={item.to} className="transition hover:text-background">{item.label}</Link>)}
            </div>
          </div>
          <div>
            <p className="font-black">Services</p>
            <div className="mt-4 grid gap-2 text-sm text-background/80">
              <span>Video editing</span>
              <span>Social growth</span>
              <span>Brand design</span>
              <span>Creator kits</span>
            </div>
          </div>
          <div>
            <p className="font-black">Contact</p>
            <p className="mt-4 text-sm leading-6 text-background/80">London · Dubai · Toronto<br />Remote worldwide<br />hello@cutagency.studio<br />+1 646 555 0147</p>
          </div>
        </div>
        <div className="border-t border-background/20 px-4 py-5 text-center text-xs font-bold text-background/70">
          © 2026 Theme Cut Agency. Built for bold brands and fast-moving feeds.
        </div>
      </footer>
    </div>
  );
}
