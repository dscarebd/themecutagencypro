import { Routes, Route, Link } from "react-router-dom";

import { AgencyLayout } from "@/components/agency-layout";
import HomePage from "@/pages/home";
import ServicesPage from "@/pages/services";
import ProjectsPage from "@/pages/projects";
import TeamPage from "@/pages/team";
import TeamProfilePage from "@/pages/team-profile";
import ContactPage from "@/pages/contact";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-black text-foreground">Page not found</h2>
        <p className="mt-2 text-muted-foreground">This cut did not make the final timeline.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-black text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AgencyLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:slug" element={<TeamProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AgencyLayout>
  );
}
