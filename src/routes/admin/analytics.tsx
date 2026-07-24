import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { analyticsData, type TopProduct } from "~/data/analytics";

// ── Route definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsDashboard,
  head: () => ({
    meta: [{ title: "Analytics Dashboard - DropAI" }],
  }),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const maxRevenue = Math.max(
  ...analyticsData.dailyRevenue.map((d) => Math.max(d.revenue, d.prevMonthRevenue ?? 0)),
);

function formatCurrency(n: number): string {
  return "$" + n.toFixed(2);
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    Delivered: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-300",
      icon: "✅",
    },
    Shipped: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: "📦",
    },
    Processing: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      icon: "⏳",
    },
  };
  const c = config[status] ?? config.Processing;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className="text-xs">{c.icon}</span>
      {status}
    </span>
  );
}

// ── Mini Sparkline ───────────────────────────────────────────────────────────

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const h = 28;
  const w = 80;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-20 shrink-0">
      <polyline
        fill="none"
        stroke="#4f46e5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// ── Tab bar ──────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Products", "Orders", "Email Campaigns"];

function TabBar({ active }: { active: string }) {
  return (
    <div className="mb-8 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            active === tab
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function AnalyticsDashboard() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<keyof TopProduct>("unitsSold");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // ── Sorted products ────────────────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    const list = [...analyticsData.topProducts];
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return list;
  }, [sortKey, sortDir]);

  function toggleSort(key: keyof TopProduct) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortArrow({ column }: { column: keyof TopProduct }) {
    if (sortKey !== column) return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>;
    return <span className="ml-1 text-indigo-600 dark:text-indigo-400">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  const totalRevenueLastMonth = analyticsData.dailyRevenue.reduce((s, d) => s + d.revenue, 0);
  const totalPrevMonth = analyticsData.dailyRevenue.reduce(
    (s, d) => s + (d.prevMonthRevenue ?? 0),
    0,
  );
  const revenueChange =
    totalPrevMonth > 0
      ? ((totalRevenueLastMonth - totalPrevMonth) / totalPrevMonth) * 100
      : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-950">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Store performance at a glance
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              ⚡ Demo Data
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>Last 30 days</span>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span>Updated daily</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* ── Tab Bar ─────────────────────────────────────────────────────────── */}
        <TabBar active="Overview" />

        {/* ── Metric Cards ────────────────────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {analyticsData.metrics.map((metric) => (
            <div
              key={metric.label}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
                    metric.trend === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  <svg
                    className={`h-3.5 w-3.5 ${metric.trend === "up" ? "" : "rotate-180"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Revenue Chart + Traffic Sources ─────────────────────────────────── */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart — spans 2 cols */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Revenue (Last 30 Days)
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>This period: <strong className="text-gray-700 dark:text-gray-300">${totalRevenueLastMonth.toLocaleString()}</strong></span>
                  <span className={`text-sm font-medium ${revenueChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange).toFixed(1)}% vs last month
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                  This month
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gray-200 dark:bg-gray-700" />
                  Last month
                </span>
              </div>
            </div>

            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute -left-1 top-0 flex h-full flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500">
                <span>${maxRevenue}</span>
                <span>${Math.round(maxRevenue / 2)}</span>
                <span>$0</span>
              </div>

              {/* Bars container */}
              <div className="ml-10 flex items-end gap-[3px] h-48">
                {analyticsData.dailyRevenue.map((day, i) => {
                  const barH = (day.revenue / maxRevenue) * 100;
                  const prevH = day.prevMonthRevenue
                    ? (day.prevMonthRevenue / maxRevenue) * 100
                    : 0;
                  return (
                    <div
                      key={i}
                      className="group/bar relative flex flex-1 flex-col items-center justify-end"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Previous month bar */}
                      {day.prevMonthRevenue && (
                        <div
                          className="w-full rounded-t-sm bg-gray-200 transition-all dark:bg-gray-700"
                          style={{ height: `${prevH}%` }}
                        />
                      )}
                      {/* Current month bar */}
                      <div
                        className="w-full rounded-t-sm bg-indigo-500 transition-all duration-150 hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        style={{ height: `${barH}%` }}
                      />

                      {/* Tooltip */}
                      {hoveredBar === i && (
                        <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
                          <p className="font-medium">{day.date}</p>
                          <p className="text-indigo-300 dark:text-indigo-600">
                            ${day.revenue}
                            {day.prevMonthRevenue && (
                              <span className="ml-1 text-gray-400 dark:text-gray-500">
                                (prev: ${day.prevMonthRevenue})
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {/* X-axis label (show every 5th) */}
                      {i % 5 === 0 && (
                        <span className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                          {day.date.replace("Jul ", "").replace("Jun ", "")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-5 text-sm font-semibold text-gray-900 dark:text-white">
              Traffic Sources
            </h2>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((src) => (
                <div key={src.channel}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {src.channel}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {src.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${src.percentage}%`,
                        backgroundColor: src.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Donut-style visual using CSS */}
            <div className="mt-6 flex items-center justify-center">
              <svg viewBox="0 0 42 42" className="h-28 w-28 -rotate-90">
                {analyticsData.trafficSources.reduce(
                  (acc, src) => {
                    const offset = acc.offset;
                    const percentage = src.percentage;
                    const circumference = 2 * Math.PI * 15;
                    const dashLength = (percentage / 100) * circumference;
                    acc.elements.push(
                      <circle
                        key={src.channel}
                        cx="21"
                        cy="21"
                        r="15"
                        fill="none"
                        stroke={src.color}
                        strokeWidth="3"
                        strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-500"
                      />,
                    );
                    acc.offset += dashLength;
                    return acc;
                  },
                  { offset: 0, elements: [] as React.ReactElement[] },
                ).elements}
                <circle cx="21" cy="21" r="15" fill="none" stroke="transparent" strokeWidth="3" />
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {analyticsData.trafficSources.map((src) => (
                <span key={src.channel} className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: src.color }} />
                  {src.channel}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Top Products + Abandoned Cart + Recent Orders ───────────────────── */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Top Products Table */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Top Products
              </h2>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Sorted by {sortKey}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {[
                      { key: "name" as keyof TopProduct, label: "Product Name" },
                      { key: "category" as keyof TopProduct, label: "Category" },
                      { key: "unitsSold" as keyof TopProduct, label: "Units Sold" },
                      { key: "revenue" as keyof TopProduct, label: "Revenue" },
                      { key: "conversionRate" as keyof TopProduct, label: "Conv. Rate" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => toggleSort(col.key)}
                        className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        {col.label}
                        <SortArrow column={col.key} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30 ${
                        i === 0 ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {p.name}
                          {i === 0 && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              #1
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {p.unitsSold}
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(p.revenue)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {p.conversionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Abandoned Cart + Summary */}
          <div className="space-y-6">
            {/* Abandoned Cart Rate */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Abandoned Cart Rate
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.abandonedCartRate}%
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  ↑ {analyticsData.abandonedCartImprovement}%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Industry avg: {analyticsData.abandonedCartIndustryAvg}%
              </p>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Your store</span>
                  <span>Industry</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  {/* Your store bar */}
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(analyticsData.abandonedCartRate / 100) * 100}%` }}
                  />
                  {/* Industry avg marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-red-400"
                    style={{ left: `${analyticsData.abandonedCartIndustryAvg}%` }}
                  />
                </div>
                <div className="mt-4 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/20">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    <strong>Great job!</strong> Your cart abandonment rate is{" "}
                    {Math.round(
                      ((analyticsData.abandonedCartIndustryAvg - analyticsData.abandonedCartRate) /
                        analyticsData.abandonedCartIndustryAvg) *
                        100,
                    )}
                    % below industry average. Our abandoned cart email recovery
                    flow is working effectively.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Revenue / Order</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">$37.56</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Return Rate</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">2.3%</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Refund Rate</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">1.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Top Channel</span>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Direct → 35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Orders ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link
              to="/"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700 dark:text-gray-300">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {order.product}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer note ─────────────────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-600">
            ⚡ Dashboard showing simulated demo data. Connect a payment provider to see live metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
