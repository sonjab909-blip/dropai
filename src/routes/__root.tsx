import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ChatAssistant } from "~/components/ChatAssistant";
import { NavBar } from "~/components/NavBar";
import { CartProvider } from "~/lib/cart-context";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DropAI - AI-Powered Dropshipping Store" },
      {
        name: "description",
        content:
          "Start selling products online without inventory or warehousing. DropAI uses AI to find winning products, optimize pricing, and handle customer support — so you can focus on growing your business.",
      },
      { name: "keywords", content: "dropshipping, AI dropshipping, online store, ecommerce, no inventory, print on demand" },
      { name: "author", content: "DropAI" },
      // Open Graph
      { property: "og:title", content: "DropAI - AI-Powered Dropshipping Store" },
      {
        property: "og:description",
        content:
          "Sell products online without inventory or warehousing. AI-powered product discovery, pricing, and support.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://eaa8b3ca2f3f95d5cbe5482ec64896fc.ctonew.app" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DropAI - AI-Powered Dropshipping Store" },
      {
        name: "twitter:description",
        content:
          "Sell products online without inventory or warehousing. AI-powered product discovery, pricing, and support.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <CartProvider>
        <NavBar />
        <Outlet />
      </CartProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <ChatAssistant />
        <Scripts />
      </body>
    </html>
  );
}
