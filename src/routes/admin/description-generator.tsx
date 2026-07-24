import { useState, useEffect, useCallback } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

// ── Types ────────────────────────────────────────────────────────────────────

type Category = "Tech Accessories" | "Health & Wellness" | "Home Goods";
type Tone = "Professional" | "Friendly" | "Luxury" | "Bold";

interface GeneratedResult {
  description: string;
  bulletFeatures: string[];
  seoTitle: string;
  metaDescription: string;
}

interface HistoryEntry {
  id: string;
  timestamp: number;
  formData: {
    name: string;
    category: Category;
    features: string;
    audience: string;
    tone: Tone;
  };
  result: GeneratedResult;
}

// ── Route definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/description-generator")({
  component: DescriptionGenerator,
  head: () => ({
    meta: [
      {
        title: "AI Description Generator - DropAI",
      },
    ],
  }),
});

// ── Generation helpers ───────────────────────────────────────────────────────

const TONE_OPENERS: Record<Tone, string[]> = {
  Professional: [
    "Engineered for excellence, the",
    "Designed with precision, the",
    "Built for performance, the",
    "Crafted to deliver, the",
    "Professionally designed, the",
  ],
  Friendly: [
    "Meet your new favorite — the",
    "Say hello to the",
    "You're going to love the",
    "Get ready to fall in love with the",
    "Here's something you'll adore — the",
  ],
  Luxury: [
    "Experience unparalleled sophistication with the",
    "Indulge in the refined elegance of the",
    "Discover the exquisite craftsmanship of the",
    "Elevate your lifestyle with the",
    "Unveil a masterpiece — the",
  ],
  Bold: [
    "Dominate the game with the",
    "Break all the rules with the",
    "Unleash the power of the",
    "Crush your limits with the",
    "This changes everything — the",
  ],
};

const TONE_CLOSERS: Record<Tone, string[]> = {
  Professional: [
    "Built with quality materials and backed by rigorous testing, this is the professional choice for those who demand reliability.",
    "Every detail has been optimized for peak performance, making this the go-to solution for discerning users.",
    "Whether for work or personal use, this product delivers consistent, professional-grade results.",
  ],
  Friendly: [
    "We know you'll wonder how you ever lived without it. Go ahead, treat yourself — you deserve it!",
    "It's the little upgrade that makes a huge difference in your daily routine. You'll be smiling every time you use it.",
    "Join thousands of happy customers who made the switch and never looked back. You're going to love this!",
  ],
  Luxury: [
    "Each unit is meticulously crafted from premium materials, delivering an experience that transcends the ordinary.",
    "This is more than a product — it's a statement. A testament to your appreciation for the finer things in life.",
    "Indulge in the pinnacle of design and functionality. Because you deserve nothing less than extraordinary.",
  ],
  Bold: [
    "Stop settling for mediocre. This is the upgrade that puts you ahead of everyone else. Are you ready?",
    "No fluff, no gimmicks — just raw performance that dominates the competition. Get yours and see the difference.",
    "This is the one. The product that redefines what's possible. Don't just keep up — lead the pack.",
  ],
};

const TONE_TRANSITIONS: Record<Tone, string[]> = {
  Professional: [
    "Designed to deliver peak performance, it features",
    "Engineered with cutting-edge technology, it boasts",
    "Meticulously crafted, it includes",
    "Built to the highest standards, it offers",
  ],
  Friendly: [
    "What makes it so awesome? Well, it's packed with",
    "And the best part? You get",
    "Here's what you're getting: it comes with",
    "Plus, you'll love that it has",
  ],
  Luxury: [
    "Exquisitely appointed with",
    "Meticulously finished with",
    "Sumptuously equipped with",
    "Thoughtfully curated with",
  ],
  Bold: [
    "Packed to the brim with",
    "Loaded with game-changing features like",
    "Armed with unstoppable",
    "It's stacked with",
  ],
};

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  "Tech Accessories": [
    "latest technology",
    "cutting-edge",
    "high-performance",
    "innovative design",
    "advanced",
    "smart",
    "wireless",
    "portable",
  ],
  "Health & Wellness": [
    "wellness",
    "healthy lifestyle",
    "fitness",
    "self-care",
    "wellbeing",
    "active",
    "mindful",
    "natural",
  ],
  "Home Goods": [
    "home upgrade",
    "modern living",
    "home decor",
    "stylish",
    "functional design",
    "space-saving",
    "contemporary",
    "comfort",
  ],
};

const CATEGORY_SEO_PREFIX: Record<Category, string> = {
  "Tech Accessories": "Premium Tech",
  "Health & Wellness": "Wellness & Fitness",
  "Home Goods": "Modern Home",
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBulletFeatures(
  features: string[],
  tone: Tone,
): string[] {
  const prefixes: Record<Tone, string[]> = {
    Professional: [
      "Advanced",
      "Premium",
      "Integrated",
      "High-performance",
      "Professional-grade",
      "Ergonomic",
      "Optimized",
    ],
    Friendly: [
      "Super easy",
      "Handy",
      "Awesome",
      "Game-changing",
      "Brilliant",
      "Clever",
      "Nifty",
    ],
    Luxury: [
      "Artisanal",
      "Bespoke",
      "Premium",
      "State-of-the-art",
      "Handcrafted",
      "Signature",
      "Exclusive",
    ],
    Bold: [
      "Unstoppable",
      "Dominant",
      "Next-level",
      "Revolutionary",
      "Powerhouse",
      "Ultimate",
      "Beast-mode",
    ],
  };

  return features.map((f, i) => {
    const prefix = prefixes[tone][i % prefixes[tone].length];
    const cleaned = f.trim().replace(/^[-•*]\s*/, "");
    return `${prefix} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}`;
  });
}

function generateDescription(
  name: string,
  category: Category,
  features: string[],
  audience: string,
  tone: Tone,
): GeneratedResult {
  const opener = pickRandom(TONE_OPENERS[tone]);
  const transition = pickRandom(TONE_TRANSITIONS[tone]);
  const closer = pickRandom(TONE_CLOSERS[tone]);
  const keywords = CATEGORY_KEYWORDS[category];
  
  // Sprinkle category keywords into the text
  const keyword1 = pickRandom(keywords);
  const keyword2 = pickRandom(keywords.filter((k) => k !== keyword1));
  
  // Build the description text
  const audiencePhrase = audience.trim()
    ? ` for ${audience}`
    : "";
  
  const para1 = `${opener} ${name}${audiencePhrase} brings ${keyword1} innovation to your daily routine. ${transition} everything you need to excel — from standout performance to everyday reliability.`;
  
  const para2 = `More than just ${name.split(" ").slice(-1)[0].toLowerCase()}, it's a complete solution designed around how you actually live and work. Every component has been thoughtfully engineered to deliver a seamless, ${keyword2} experience that fits into your lifestyle effortlessly.`;

  // Generate bullet features
  const bulletFeatures = generateBulletFeatures(features, tone);

  // SEO title with tone-appropriate flair
  const seoPrefix = CATEGORY_SEO_PREFIX[category];
  const seoSuffixes: Record<Tone, string> = {
    Professional: ` | ${seoPrefix} | DropAI`,
    Friendly: ` — Your New Favorite ${category} Item | DropAI`,
    Luxury: ` | Premium ${category} | DropAI`,
    Bold: ` | ${category} That Delivers | DropAI`,
  };

  const seoTitle = `${name}${seoSuffixes[tone]}`;

  // Meta description
  const metaTemplates: Record<Tone, string> = {
    Professional: `Discover the ${name} — professional-grade ${category.toLowerCase()} with ${features.slice(0, 2).join(" and ")}. Shop now at DropAI with free shipping.`,
    Friendly: `Meet the ${name}! Packed with ${features.slice(0, 2).join(" and ")}, it's the ${category.toLowerCase()} upgrade you've been waiting for. Free shipping at DropAI.`,
    Luxury: `Experience the ${name} — exquisite ${category.toLowerCase()} featuring ${features.slice(0, 2).join(" and ")}. Elevate your everyday with DropAI.`,
    Bold: `The ${name} is here — loaded with ${features.slice(0, 2).join(" and ")}. Dominate your day with this ${category.toLowerCase()} powerhouse. Only at DropAI.`,
  };

  const metaDescription = metaTemplates[tone];

  return {
    description: `${para1}\n\n${para2} ${closer}`,
    bulletFeatures,
    seoTitle,
    metaDescription,
  };
}

// ── Toast component ──────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl dark:bg-gray-100 dark:text-gray-900 sm:bottom-8 sm:right-8">
      <div className="flex items-center gap-2.5">
        <svg className="h-5 w-5 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {message}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function DescriptionGenerator() {
  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Tech Accessories");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  
  // Output state
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Toast
  const [toast, setToast] = useState<string | null>(null);
  
  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dropai-description-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20);
      try {
        localStorage.setItem(
          "dropai-description-history",
          JSON.stringify(updated),
        );
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(`${label} copied to clipboard!`);
      } catch {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`${label} copied to clipboard!`);
      }
    },
    [showToast],
  );

  const handleGenerate = useCallback(() => {
    if (!name.trim() || !features.trim()) {
      showToast("Please fill in product name and features.");
      return;
    }

    setLoading(true);

    // Simulate an AI "thinking" delay
    setTimeout(() => {
      const featureList = features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (featureList.length === 0) {
        setLoading(false);
        showToast("Please enter at least one feature.");
        return;
      }

      const generated = generateDescription(
        name.trim(),
        category,
        featureList,
        audience.trim(),
        tone,
      );

      setResult(generated);

      // Save to history
      saveHistory({
        id: crypto.randomUUID?.() || Date.now().toString(),
        timestamp: Date.now(),
        formData: {
          name: name.trim(),
          category,
          features: features.trim(),
          audience: audience.trim(),
          tone,
        },
        result: generated,
      });

      setLoading(false);
      showToast("Description generated successfully!");
    }, 800);
  }, [name, category, features, audience, tone, saveHistory, showToast]);

  const handleUseDescription = useCallback(() => {
    showToast("Description saved! (Catalog integration coming soon)");
  }, [showToast]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setName(entry.formData.name);
    setCategory(entry.formData.category);
    setFeatures(entry.formData.features);
    setAudience(entry.formData.audience);
    setTone(entry.formData.tone);
    setResult(entry.result);
    setHistoryOpen(false);
    showToast("Loaded from history!");
  }, [showToast]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("dropai-description-history");
    } catch {
      // ignore
    }
    showToast("History cleared!");
  }, [showToast]);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-lg dark:border-gray-800/80 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Description Generator
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate compelling product descriptions in seconds
                </p>
              </div>
            </div>
          </div>

          {/* History toggle */}
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              historyOpen
                ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-400"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
            {history.length > 0 && (
              <span className="ml-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main content */}
        <main className={`flex-1 px-6 py-8 transition-all ${historyOpen ? "lg:pr-[340px]" : ""}`}>
          <div className="mx-auto max-w-4xl">
            {/* Form card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <h2 className="mb-6 text-base font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Product Details
              </h2>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Product Name */}
                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='e.g. "Wireless Bluetooth Earbuds"'
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                  >
                    <option>Tech Accessories</option>
                    <option>Health & Wellness</option>
                    <option>Home Goods</option>
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                  >
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Luxury</option>
                    <option>Bold</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Audience{" "}
                    <span className="text-gray-400 dark:text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder='e.g. "fitness enthusiasts", "remote workers"'
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
                  />
                </div>

                {/* Placeholder to keep grid balanced */}
                <div className="hidden lg:block" />

                {/* Features */}
                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Features / Specs
                  </label>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="Enter features separated by commas, e.g. Bluetooth 5.3, Active Noise Cancellation, 24-hour battery life, IPX5 water resistant"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Generate button */}
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Fill in the details above and click generate
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !name.trim() || !features.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Generate Description
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6">
                {/* Main Description */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Product Description
                    </h3>
                    <button
                      onClick={() => copyToClipboard(result.description, "Description")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                    {result.description.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Bullet Features */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Bullet-Point Features
                    </h3>
                    <button
                      onClick={() => copyToClipboard(result.bulletFeatures.map((f) => `• ${f}`).join("\n"), "Features")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {result.bulletFeatures.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SEO Section */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* SEO Title */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        SEO Title Tag
                      </h3>
                      <button
                        onClick={() => copyToClipboard(result.seoTitle, "SEO Title")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <p className="rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                      {result.seoTitle}
                    </p>
                    <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                      Optimal length: 50-60 characters for search results
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Meta Description
                      </h3>
                      <button
                        onClick={() => copyToClipboard(result.metaDescription, "Meta Description")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                      {result.metaDescription}
                    </p>
                    <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                      Optimal length: 150-160 characters for search snippets
                    </p>
                  </div>
                </div>

                {/* Use This Description button */}
                <div className="flex justify-center pb-8">
                  <button
                    onClick={handleUseDescription}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Use This Description
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* History sidebar */}
        <aside
          className={`fixed right-0 top-[73px] z-30 h-[calc(100dvh-73px)] w-[340px] border-l border-gray-200 bg-white shadow-lg transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 ${
            historyOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Generations
              </h3>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <svg className="mb-4 h-12 w-12 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No history yet
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Generated descriptions will appear here
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {history.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => loadFromHistory(entry)}
                    className="w-full border-b border-gray-50 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {entry.formData.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {entry.formData.category} · {entry.formData.tone}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {entry.result.description.split("\n\n")[0]}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Copy all button at the bottom */}
            {result && (
              <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
                <button
                  onClick={() =>
                    copyToClipboard(
                      [
                        result.description,
                        "",
                        "Key Features:",
                        ...result.bulletFeatures.map((f) => `• ${f}`),
                      ].join("\n"),
                      "Full description",
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Everything
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay when sidebar is open on mobile */}
        {historyOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setHistoryOpen(false)}
          />
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={hideToast} />}
    </div>
  );
}
