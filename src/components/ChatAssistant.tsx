import { useState, useRef, useEffect, useCallback } from "react";
import { products, type Product } from "~/data/products";

// ── FAQ responses ────────────────────────────────────────────────────────────

const FAQ_RESPONSES: Record<string, string> = {
  shipping:
    "We offer **free worldwide shipping** on orders over $50. Delivery typically takes 7-14 business days. Tracking is provided with every order! 📦",
  returns:
    "We have a **30-day hassle-free return policy**. Not satisfied? Just contact our support team, and we'll guide you through the process — no questions asked! 🔄",
  payment:
    "We accept all **major credit cards** (Visa, Mastercard, Amex), **PayPal**, and **Apple Pay**. All transactions are encrypted and secure. 🔒",
  about:
    "**DropAI** is an AI-powered dropshipping store. We discover trending products from global suppliers and ship them directly to you — no middlemen, no inventory, just great deals! 🤖",
};

// ── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "assistant" | "user";
  content: string;
  products?: Product[];
}

// ── Keyword matching helpers ─────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string> = {
  "tech accessories": "Tech Accessories",
  headphones: "Tech Accessories",
  earbuds: "Tech Accessories",
  buds: "Tech Accessories",
  charger: "Tech Accessories",
  charging: "Tech Accessories",
  speaker: "Tech Accessories",
  bluetooth: "Tech Accessories",
  electronics: "Tech Accessories",
  audio: "Tech Accessories",
  music: "Tech Accessories",
  "phone accessory": "Tech Accessories",
  battery: "Tech Accessories",
  fitness: "Health & Wellness",
  health: "Health & Wellness",
  workout: "Health & Wellness",
  yoga: "Health & Wellness",
  exercise: "Health & Wellness",
  sport: "Health & Wellness",
  wellness: "Health & Wellness",
  tracker: "Health & Wellness",
  running: "Health & Wellness",
  gym: "Health & Wellness",
  "home office": "Home Goods",
  home: "Home Goods",
  desk: "Home Goods",
  lamp: "Home Goods",
  lighting: "Home Goods",
  office: "Home Goods",
  ergonomic: "Home Goods",
  stand: "Home Goods",
  furniture: "Home Goods",
};

function matchCategory(input: string): string | null {
  const lower = input.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}

function matchProducts(input: string): Product[] {
  const category = matchCategory(input);
  const lower = input.toLowerCase();

  // Score each product by relevance
  const scored = products
    .map((p) => {
      let score = 0;
      const nameLower = p.name.toLowerCase();
      const descLower = p.description.toLowerCase();

      // Category match is strong
      if (category && p.category === category) score += 5;

      // Name keyword matches
      const words = lower.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        if (nameLower.includes(word)) score += 3;
        if (descLower.includes(word)) score += 1;
        if (p.specs?.some((s) => s.toLowerCase().includes(word))) score += 1;
      }

      // Full name fragment match
      if (lower.split(/\s+/).length >= 2 && nameLower.includes(lower))
        score += 4;

      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);

  // Return top 3 matches
  return scored.slice(0, 3);
}

// ── FAQ detection ────────────────────────────────────────────────────────────

const FAQ_KEYWORDS: Record<string, string> = {
  shipping: "shipping",
  ship: "shipping",
  delivery: "shipping",
  deliver: "shipping",
  "how long": "shipping",
  "arrive when": "shipping",
  return: "returns",
  refund: "returns",
  exchange: "returns",
  "money back": "returns",
  payment: "payment",
  pay: "payment",
  "credit card": "payment",
  paypal: "payment",
  "apple pay": "payment",
  about: "about",
  "who are you": "about",
  "what is dropai": "about",
  "what is this": "about",
};

function matchFAQ(input: string): string | null {
  const lower = input.toLowerCase();
  for (const [keyword, faqKey] of Object.entries(FAQ_KEYWORDS)) {
    if (lower.includes(keyword)) return FAQ_RESPONSES[faqKey];
  }
  return null;
}

// ── Format a product recommendation message ──────────────────────────────────

function formatProductRecommendation(matched: Product[]): string {
  if (matched.length === 0) return "";

  const lines: string[] = [
    matched.length === 1
      ? "Here's what I found for you:"
      : `Here are ${matched.length} great options I found:`,
    "",
  ];

  matched.forEach((p, i) => {
    const stars = "⭐".repeat(Math.round(p.rating));
    lines.push(
      `**${i + 1}. ${p.name}** — $${p.price.toFixed(2)}  ${stars} (${
        p.rating
      })`,
    );
    lines.push(`   ${p.description}`);
    lines.push(
      `   🏷️ _${p.category}_  |  [View product](/products/${p.id})`,
    );
    if (i < matched.length - 1) lines.push("");
  });

  return lines.join("\n");
}

// ── Component ────────────────────────────────────────────────────────────────

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasNew, setHasNew] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message on first open
  const welcomeSent = useRef(false);

  useEffect(() => {
    if (open && !welcomeSent.current) {
      welcomeSent.current = true;
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm your DropAI shopping assistant. I can help you find products, answer questions about our store, or make recommendations. What are you looking for today?",
        },
      ]);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Notify floating button when new assistant messages arrive while closed
  useEffect(() => {
    if (!open && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") setHasNew(true);
    }
  }, [messages, open]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = { role: "user", content: text };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInput("");

      // Determine response after a brief "thinking" delay
      setTimeout(() => {
        // Check FAQ first
        const faq = matchFAQ(text);
        if (faq) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: faq },
          ]);
          return;
        }

        // Check product matches
        const matched = matchProducts(text);
        if (matched.length > 0) {
          const productMsg = formatProductRecommendation(matched);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: productMsg, products: matched },
          ]);
          return;
        }

        // Fallback
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm not sure about that, but you can browse our [products](/products) or ask me about specific items! Try asking about **headphones**, **fitness gear**, **chargers**, or **home office** products. 😊",
          },
        ]);
      }, 400);
    },
    [messages],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setHasNew(false);
  };

  const handleClose = () => setOpen(false);

  // ── Message renderer (supports basic markdown: **bold**, links) ──────────

  const renderContent = (content: string) => {
    // Split on markdown link pattern: [text](url)
    const parts = content.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            className="font-medium text-indigo-600 underline decoration-indigo-400 hover:text-indigo-700 dark:text-indigo-400 dark:decoration-indigo-500"
          >
            {linkMatch[1]}
          </a>
        );
      }
      // Bold text: **text**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bp, j) => {
        if (bp.startsWith("**") && bp.endsWith("**")) {
          return (
            <strong key={`${i}-${j}`} className="font-semibold">
              {bp.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${i}-${j}`}>{bp}</span>;
      });
    });
  };

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────────── */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95 sm:bottom-6 sm:right-6 ${
          open ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } ${hasNew ? "animate-pulse" : ""}`}
        aria-label="Open chat assistant"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {hasNew && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900 ring-2 ring-white dark:ring-gray-900">
            !
          </span>
        )}
      </button>

      {/* ── Chat panel ──────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-5 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:bottom-6 sm:right-6 sm:max-w-md ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
        style={{ maxHeight: "min(600px, calc(100dvh - 100px))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-indigo-600 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="robot">
              🤖
            </span>
            <span className="text-base font-semibold text-white">
              AI Assistant
            </span>
            <span className="relative ml-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-200 transition-colors hover:bg-indigo-700 hover:text-white"
            aria-label="Close chat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {messages.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <svg
                    className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400"
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
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                <div className="whitespace-pre-line">
                  {renderContent(msg.content)}
                </div>

                {/* Product cards for recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.products.map((p) => (
                      <a
                        key={p.id}
                        href={`/products/${p.id}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-lg">
                          {p.image === "headphones"
                            ? "🎧"
                            : p.image === "activity"
                              ? "⌚"
                              : p.image === "battery"
                                ? "🔋"
                                : p.image === "monitor"
                                  ? "💻"
                                  : p.image === "sun"
                                    ? "💡"
                                    : p.image === "music"
                                      ? "🔊"
                                      : "📦"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                              ${p.price.toFixed(2)}
                            </span>
                            <span>·</span>
                            <span>⭐ {p.rating}</span>
                          </div>
                        </div>
                        <svg
                          className="h-4 w-4 shrink-0 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Quick action chips — only after welcome message */}
          {messages.length === 1 && messages[0].role === "assistant" && (
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() => sendMessage("Browse Products")}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
              >
                🔍 Browse Products
              </button>
              <button
                onClick={() => sendMessage("What are your best sellers?")}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
              >
                🎧 Best Sellers
              </button>
              <button
                onClick={() => sendMessage("What are your shipping options?")}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
              >
                🚚 Shipping Info
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
