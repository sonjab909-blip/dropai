import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

// ── Types ───────────────────────────────────────────────────────────────────────

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

interface SubscribersData {
  subscribers: Subscriber[];
}

// ── Data file path ──────────────────────────────────────────────────────────────

const DATA_DIR = new URL("../../data", import.meta.url).pathname;
const DATA_FILE = `${DATA_DIR}/subscribers.json`;

// ── Helpers ─────────────────────────────────────────────────────────────────────

async function ensureDataDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readSubscribers(): Promise<SubscribersData> {
  await ensureDataDir();
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as SubscribersData;
  } catch {
    return { subscribers: [] };
  }
}

async function writeSubscribers(data: SubscribersData): Promise<void> {
  await ensureDataDir();
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Server Functions ─────────────────────────────────────────────────────────────

export const subscribe = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { email?: string };
    if (!d?.email || typeof d.email !== "string") {
      throw new Error("Email is required");
    }
    if (!isValidEmail(d.email)) {
      throw new Error("Please enter a valid email address");
    }
    return { email: d.email.trim().toLowerCase() };
  })
  .handler(async ({ data }) => {
    const { email } = data;

    const all = await readSubscribers();

    // Check if already subscribed
    if (all.subscribers.some((s) => s.email === email)) {
      return {
        success: true,
        message: "You're already subscribed!",
      };
    }

    // Add subscriber
    all.subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    await writeSubscribers(all);

    // Note: In production, we'd send a welcome email via the platform's email tools.
    // For now, we log the action.
    console.log(`[Newsletter] New subscriber: ${email}`);

    return {
      success: true,
      message: "Thanks for subscribing! Check your inbox for a welcome email.",
    };
  });

export const getSubscribers = createServerFn({ method: "GET" }).handler(async () => {
  const all = await readSubscribers();
  return all.subscribers;
});

export const getSubscriberCount = createServerFn({ method: "GET" }).handler(async () => {
  const all = await readSubscribers();
  return all.subscribers.length;
});