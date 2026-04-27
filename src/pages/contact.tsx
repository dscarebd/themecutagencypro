import { Helmet } from "react-helmet-async";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { SectionIntro } from "@/components/page-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { heroImage } from "@/lib/site-data";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(1000),
});

export default function ContactPage() {
  const [status, setStatus] = useState("");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Contact — Theme Cut Agency</title>
        <meta name="description" content="Contact Theme Cut Agency for video editing, social media, and brand design projects." />
        <meta property="og:title" content="Contact — Theme Cut Agency" />
        <meta property="og:description" content="Start an international creative project with Theme Cut Agency." />
        <meta property="og:image" content={heroImage} />
        <meta name="twitter:image" content={heroImage} />
      </Helmet>
      <SectionIntro eyebrow="Contact" title="Send the brief. We’ll cut the magic." copy="Tell us what you are launching and we will reply with a creative sprint plan." />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="rounded-[2rem] border-2 bg-card/90 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <form className="space-y-5" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const parsed = contactSchema.safeParse({ name: form.get("name"), email: form.get("email"), message: form.get("message") });
              setStatus(parsed.success ? "Thanks — your brief is ready to send." : "Please add a valid name, email, and project message.");
            }}>
              <Input name="name" placeholder="Your name" required maxLength={100} />
              <Input name="email" type="email" placeholder="Email address" required maxLength={255} />
              <Textarea name="message" placeholder="Project goals, channels, timeline" required maxLength={1000} className="min-h-40" />
              <Button className="rounded-full" type="submit">Prepare brief</Button>
              {status && <p className="text-sm font-bold text-primary">{status}</p>}
            </form>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[
            [Mail, "hello@cutagency.studio"],
            [Phone, "+1 646 555 0147"],
            [MapPin, "Remote worldwide · London · Dubai · Toronto"],
          ].map(([Icon, text]) => <Card key={String(text)} className="rounded-3xl border-2 bg-card/90"><CardContent className="flex items-center gap-4 p-6"><Icon className="h-6 w-6 text-accent" /><p className="font-bold">{String(text)}</p></CardContent></Card>)}
        </div>
      </div>
    </section>
  );
}
