// ── Mock Analytics Data ──────────────────────────────────────────────────────
// Real Stripe data isn't connected yet; all values here are realistic projections
// for a new dropshipping store in its first few months.

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  prevMonthRevenue?: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  conversionRate: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: number;
  status: "Delivered" | "Processing" | "Shipped";
}

export interface TrafficSource {
  channel: string;
  percentage: number;
  color: string;
}

export interface AnalyticsData {
  metrics: MetricCard[];
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  trafficSources: TrafficSource[];
  abandonedCartRate: number;
  abandonedCartIndustryAvg: number;
  abandonedCartImprovement: number;
}

export const analyticsData: AnalyticsData = {
  // ── Metric Cards ──────────────────────────────────────────────────────────
  metrics: [
    { label: "Total Revenue", value: "$12,847", change: "+12.5%", trend: "up" },
    { label: "Total Orders", value: "342", change: "+8.2%", trend: "up" },
    { label: "Conversion Rate", value: "3.2%", change: "+0.4%", trend: "up" },
    { label: "Avg Order Value", value: "$37.56", change: "+2.1%", trend: "up" },
  ],

  // ── Daily Revenue (last 30 days) ─────────────────────────────────────────
  dailyRevenue: [
    { date: "Jun 25", revenue: 412, prevMonthRevenue: 380 },
    { date: "Jun 26", revenue: 385, prevMonthRevenue: 365 },
    { date: "Jun 27", revenue: 420, prevMonthRevenue: 390 },
    { date: "Jun 28", revenue: 398, prevMonthRevenue: 372 },
    { date: "Jun 29", revenue: 450, prevMonthRevenue: 410 },
    { date: "Jun 30", revenue: 520, prevMonthRevenue: 440 },
    { date: "Jul 1", revenue: 480, prevMonthRevenue: 420 },
    { date: "Jul 2", revenue: 395, prevMonthRevenue: 370 },
    { date: "Jul 3", revenue: 410, prevMonthRevenue: 385 },
    { date: "Jul 4", revenue: 375, prevMonthRevenue: 360 },
    { date: "Jul 5", revenue: 440, prevMonthRevenue: 400 },
    { date: "Jul 6", revenue: 510, prevMonthRevenue: 430 },
    { date: "Jul 7", revenue: 465, prevMonthRevenue: 415 },
    { date: "Jul 8", revenue: 430, prevMonthRevenue: 395 },
    { date: "Jul 9", revenue: 455, prevMonthRevenue: 405 },
    { date: "Jul 10", revenue: 490, prevMonthRevenue: 425 },
    { date: "Jul 11", revenue: 425, prevMonthRevenue: 390 },
    { date: "Jul 12", revenue: 470, prevMonthRevenue: 410 },
    { date: "Jul 13", revenue: 535, prevMonthRevenue: 445 },
    { date: "Jul 14", revenue: 500, prevMonthRevenue: 435 },
    { date: "Jul 15", revenue: 445, prevMonthRevenue: 400 },
    { date: "Jul 16", revenue: 485, prevMonthRevenue: 420 },
    { date: "Jul 17", revenue: 415, prevMonthRevenue: 388 },
    { date: "Jul 18", revenue: 460, prevMonthRevenue: 405 },
    { date: "Jul 19", revenue: 505, prevMonthRevenue: 438 },
    { date: "Jul 20", revenue: 548, prevMonthRevenue: 450 },
    { date: "Jul 21", revenue: 472, prevMonthRevenue: 418 },
    { date: "Jul 22", revenue: 438, prevMonthRevenue: 398 },
    { date: "Jul 23", revenue: 492, prevMonthRevenue: 428 },
    { date: "Jul 24", revenue: 465, prevMonthRevenue: 412 },
  ],

  // ── Top Products ──────────────────────────────────────────────────────────
  topProducts: [
    { id: "wireless-earbuds", name: "Wireless Bluetooth Earbuds", category: "Tech Accessories", unitsSold: 89, revenue: 2669.11, conversionRate: 4.8 },
    { id: "fitness-tracker", name: "Smart Fitness Tracker", category: "Health & Wellness", unitsSold: 72, revenue: 3599.28, conversionRate: 4.5 },
    { id: "phone-charger", name: "Portable Phone Charger", category: "Tech Accessories", unitsSold: 65, revenue: 1624.35, conversionRate: 4.2 },
    { id: "laptop-stand", name: "Ergonomic Laptop Stand", category: "Home Goods", unitsSold: 48, revenue: 1919.52, conversionRate: 3.8 },
    { id: "yoga-mat", name: "Premium Yoga Mat", category: "Health & Wellness", unitsSold: 42, revenue: 1469.58, conversionRate: 3.5 },
    { id: "led-desk-lamp", name: "Smart LED Desk Lamp", category: "Home Goods", unitsSold: 38, revenue: 1709.62, conversionRate: 3.2 },
    { id: "bluetooth-speaker", name: "Waterproof Bluetooth Speaker", category: "Tech Accessories", unitsSold: 35, revenue: 1259.65, conversionRate: 2.9 },
    { id: "resistance-bands", name: "Fitness Resistance Bands Set", category: "Health & Wellness", unitsSold: 28, revenue: 559.72, conversionRate: 2.6 },
  ],

  // ── Recent Orders ─────────────────────────────────────────────────────────
  recentOrders: [
    { id: "ORD-1042", customer: "Sarah Johnson", product: "Wireless Bluetooth Earbuds", date: "2026-07-24", amount: 29.99, status: "Delivered" },
    { id: "ORD-1041", customer: "Michael Chen", product: "Smart Fitness Tracker", date: "2026-07-24", amount: 49.99, status: "Delivered" },
    { id: "ORD-1040", customer: "Emily Rodriguez", product: "Ergonomic Laptop Stand", date: "2026-07-23", amount: 39.99, status: "Delivered" },
    { id: "ORD-1039", customer: "David Kim", product: "Portable Phone Charger", date: "2026-07-23", amount: 24.99, status: "Shipped" },
    { id: "ORD-1038", customer: "Jessica Taylor", product: "Wireless Bluetooth Earbuds", date: "2026-07-23", amount: 29.99, status: "Shipped" },
    { id: "ORD-1037", customer: "James Wilson", product: "Premium Yoga Mat", date: "2026-07-22", amount: 34.99, status: "Shipped" },
    { id: "ORD-1036", customer: "Amanda Lee", product: "Smart LED Desk Lamp", date: "2026-07-22", amount: 44.99, status: "Processing" },
    { id: "ORD-1035", customer: "Robert Martinez", product: "Waterproof Bluetooth Speaker", date: "2026-07-22", amount: 35.99, status: "Processing" },
    { id: "ORD-1034", customer: "Lisa Thompson", product: "Smart Fitness Tracker", date: "2026-07-21", amount: 49.99, status: "Processing" },
    { id: "ORD-1033", customer: "Kevin Brown", product: "Fitness Resistance Bands Set", date: "2026-07-21", amount: 19.99, status: "Processing" },
  ],

  // ── Traffic Sources ───────────────────────────────────────────────────────
  trafficSources: [
    { channel: "Direct", percentage: 35, color: "#4f46e5" },
    { channel: "Social", percentage: 28, color: "#f59e0b" },
    { channel: "Search", percentage: 22, color: "#10b981" },
    { channel: "Email", percentage: 10, color: "#8b5cf6" },
    { channel: "Referral", percentage: 5, color: "#ec4899" },
  ],

  // ── Abandoned Cart ────────────────────────────────────────────────────────
  abandonedCartRate: 24.3,
  abandonedCartIndustryAvg: 70,
  abandonedCartImprovement: 12,
};
