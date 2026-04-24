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
      <footer className="border-t bg-ink text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <p className="font-display text-2xl font-black">Theme Cut Agency</p>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/75">Playful video editing, social media, and brand design for international teams that need scroll-stopping creative every week.</p>
          </div>
          <div>
            <p className="font-bold">Studio</p>
            <p className="mt-3 text-sm text-primary-foreground/75">London · Dubai · Toronto · Remote worldwide</p>
          </div>
          <div>
            <p className="font-bold">Contact</p>
            <p className="mt-3 text-sm text-primary-foreground/75">hello@cutagency.studio<br />+1 646 555 0147</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
