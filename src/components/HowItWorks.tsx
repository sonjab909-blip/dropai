const steps = [
  {
    step: "01",
    title: "Browse Products",
    description:
      "Explore our curated catalog of trending products with high profit margins. Our AI highlights the best sellers so you can pick with confidence.",
    color: "bg-indigo-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI Helps You Choose",
    description:
      "Our AI analyzes pricing, demand, and competition to recommend the best products for your store. Set your markup and list with one click.",
    color: "bg-blue-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Ships to Your Door",
    description:
      "Customer places an order → supplier ships it directly. You never touch the inventory. Track everything from your dashboard.",
    color: "bg-emerald-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-6 py-20 dark:bg-gray-900 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start selling in three simple steps. No warehouse, no staff, no
            hassle.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-1/2 top-16 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-indigo-300 via-blue-300 to-emerald-300 dark:from-indigo-700 dark:via-blue-700 dark:to-emerald-700 lg:block" />

          <div className="grid gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step number & icon */}
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} text-white shadow-lg transition-transform hover:scale-110`}
                >
                  {step.icon}
                </div>

                {/* Step label */}
                <span className="mt-4 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Step {step.step}
                </span>

                <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}