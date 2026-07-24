import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

import { Hero } from "~/components/Hero";
import { FeaturedProducts } from "~/components/FeaturedProducts";
import { Benefits } from "~/components/Benefits";
import { HowItWorks } from "~/components/HowItWorks";
import { Newsletter } from "~/components/Newsletter";
import { Footer } from "~/components/Footer";

// Read the (optional) business name at request time so the placeholder can be
// personalized by writing site.json — no rebuild needed. Resolves relative to the
// server's working directory (the site root). Falls back to "" if absent/invalid.
const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
  head: () => ({
    meta: [
      {
        title: "DropAI - AI-Powered Dropshipping Store",
      },
    ],
  }),
});

function Home() {
  const businessName = Route.useLoaderData();
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Main content */}
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <Benefits />
        <HowItWorks />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}