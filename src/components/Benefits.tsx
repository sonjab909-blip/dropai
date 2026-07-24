const benefits = [
  {
    title: "No Inventory Needed",
    description:
      "Skip the warehouse. When a customer orders, your supplier ships directly to them. No storage, no unsold stock, no upfront costs.",
    gradient: "from-indigo-500 to-purple-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes millions of data points to find winning products, optimize pricing, and predict trends before they blow up.",
    gradient: "from-blue-500 to-cyan-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Global Shipping",
    description:
      "Sell to customers in over 200 countries. Our fulfillment partners handle international shipping, customs, and tracking.",
    gradient: "from-emerald-500 to-teal-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "24/7 AI Support",
    description:
      "Our AI assistant handles customer inquiries, order tracking, and returns around the clock — so you don't have to.",
    gradient: "from-amber-500 to-orange-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export function Benefits() {
  return (
    <section className="bg-gray-50 px-6 py-20 dark:bg-gray-800/50 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why DropAI?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to run a successful dropshipping business —
            powered by artificial intelligence.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800/30"
            >
              {/* Icon */}
              <div
                className={`inline-flex rounded-xl bg-gradient-to-br ${benefit.gradient} p-3 text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}