import { useState } from "react";
import { subscribe } from "~/lib/newsletter";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribe({ email: email.trim() });
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-20 dark:from-indigo-800 dark:to-blue-900 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        {/* Section header */}
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stay in the Loop
        </h2>
        <p className="mt-4 text-lg text-indigo-100">
          Get notified about new products, exclusive deals, and AI-powered
          dropshipping tips delivered to your inbox.
        </p>

        {/* Status message */}
        {status === "success" && (
          <div className="mx-auto mt-6 max-w-lg rounded-xl bg-white/15 px-4 py-3 text-sm text-white backdrop-blur-sm">
            <span className="mr-1.5">✅</span>
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto mt-6 max-w-lg rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">
            <span className="mr-1.5">⚠️</span>
            {message}
          </div>
        )}

        {/* Email form */}
        <form
          className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error" || status === "success") {
                  setStatus("idle");
                }
              }}
              placeholder="Enter your email"
              disabled={status === "loading"}
              className="w-full rounded-xl border-2 border-indigo-400/50 bg-white/10 py-4 pl-12 pr-4 text-white placeholder-indigo-200 backdrop-blur-sm transition-all focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-50 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
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
                Subscribing...
              </>
            ) : (
              <>
                Subscribe
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-indigo-200">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}