export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Tech Accessories" | "Health & Wellness" | "Home Goods";
  rating: number;
  description: string;
  image: string;
  specs?: string[];
  supplier: string;
  cost: number;
  inStock: boolean;
}

export const categories = [
  "All",
  "Tech Accessories",
  "Health & Wellness",
  "Home Goods",
] as const;

export type Category = (typeof categories)[number];

export const products: Product[] = [
  {
    id: "wireless-earbuds",
    name: "Wireless Bluetooth Earbuds",
    price: 29.99,
    category: "Tech Accessories",
    rating: 4.5,
    description:
      "Premium wireless earbuds with noise cancellation, 24hr battery life, and crystal-clear audio. Perfect for music lovers and professionals on the go.",
    image: "/images/wireless-earbuds.svg",
    supplier: "AliExpress (TWS i12)",
    cost: 12.5,
    inStock: true,
    specs: [
      "Bluetooth 5.3 with stable connection",
      "Active Noise Cancellation (ANC)",
      "24-hour total battery life",
      "IPX5 water resistant",
      "Touch controls with voice assistant",
      "USB-C fast charging",
    ],
  },
  {
    id: "fitness-tracker",
    name: "Smart Fitness Tracker",
    price: 49.99,
    category: "Health & Wellness",
    rating: 4.7,
    description:
      "Track your health 24/7 with heart rate monitoring, sleep analysis, step counting, and smart notifications. Water-resistant with 14-day battery.",
    image: "/images/fitness-tracker.svg",
    supplier: "AliExpress (ID115)",
    cost: 18.0,
    inStock: true,
    specs: [
      "24/7 heart rate and SpO2 monitoring",
      "Sleep tracking with REM analysis",
      "14-day battery life",
      "Water resistant to 50m",
      "Smartphone notifications",
      "Step, calorie, and distance tracking",
    ],
  },
  {
    id: "phone-charger",
    name: "Portable Phone Charger",
    price: 24.99,
    category: "Tech Accessories",
    rating: 4.3,
    description:
      "Ultra-compact 10000mAh portable charger with fast charging, dual USB ports, and LED battery indicator. Fits in any pocket.",
    image: "/images/phone-charger.svg",
    supplier: "AliExpress (10000mAh power bank)",
    cost: 8.5,
    inStock: true,
    specs: [
      "10000mAh high-capacity battery",
      "20W PD fast charging",
      "Dual USB output ports",
      "LED battery level indicator",
      "Ultra-compact pocket design",
      "Overcharge and short-circuit protection",
    ],
  },
  {
    id: "laptop-stand",
    name: "Ergonomic Laptop Stand",
    price: 39.99,
    category: "Home Goods",
    rating: 4.6,
    description:
      "Adjustable aluminum laptop stand with ventilated design to prevent overheating. Elevates your screen to eye level for comfortable ergonomic work.",
    image: "/images/laptop-stand.svg",
    supplier: "AliExpress (aluminum foldable)",
    cost: 14.0,
    inStock: true,
    specs: [
      "Adjustable height and angle",
      "Ventilated aluminum design",
      "Fits laptops 10-17 inches",
      "Anti-slip silicone pads",
      "Foldable for portability",
      "Weight capacity: 10kg",
    ],
  },
  {
    id: "yoga-mat",
    name: "Premium Yoga Mat",
    price: 34.99,
    category: "Health & Wellness",
    rating: 4.4,
    description:
      "Extra-thick 6mm eco-friendly yoga mat with alignment lines. Non-slip surface, moisture resistant, includes carrying strap.",
    image: "/images/yoga-mat.svg",
    supplier: "AliExpress (TPE non-slip)",
    cost: 12.0,
    inStock: true,
    specs: [
      "6mm thick premium TPE material",
      "Non-slip textured surface",
      "Alignment lines for perfect posture",
      "Eco-friendly and recyclable",
      "Moisture resistant easy-clean",
      "Includes carrying strap",
    ],
  },
  {
    id: "led-desk-lamp",
    name: "Smart LED Desk Lamp",
    price: 44.99,
    category: "Home Goods",
    rating: 4.5,
    description:
      "Eye-caring LED desk lamp with wireless charging, touch control, 5 color modes, and 7 brightness levels. USB-powered with memory function.",
    image: "/images/led-desk-lamp.svg",
    supplier: "AliExpress (touch control)",
    cost: 18.5,
    inStock: true,
    specs: [
      "5 color modes and 7 brightness levels",
      "Built-in wireless charging pad",
      "Touch control panel",
      "Eye-caring flicker-free light",
      "USB-powered with memory function",
      "Adjustable gooseneck arm",
    ],
  },
  {
    id: "bluetooth-speaker",
    name: "Waterproof Bluetooth Speaker",
    price: 35.99,
    category: "Tech Accessories",
    rating: 4.2,
    description:
      "IPX7 waterproof portable speaker with rich 360° sound, 20hr playtime, built-in microphone, and speakerphone function.",
    image: "/images/bluetooth-speaker.svg",
    supplier: "AliExpress (IPX7 portable)",
    cost: 14.0,
    inStock: true,
    specs: [
      "IPX7 waterproof rating",
      "360° rich surround sound",
      "20-hour playtime",
      "Built-in microphone for calls",
      "Bluetooth 5.0 with 10m range",
      "Built-in carabiner clip",
    ],
  },
  {
    id: "resistance-bands",
    name: "Fitness Resistance Bands Set",
    price: 19.99,
    category: "Health & Wellness",
    rating: 4.8,
    description:
      "Set of 5 resistance bands with different tension levels, door anchor, ankle straps, and carrying bag. Perfect for home workouts.",
    image: "/images/resistance-bands.svg",
    supplier: "AliExpress (5-level set)",
    cost: 6.5,
    inStock: true,
    specs: [
      "5 resistance levels (10-50 lbs)",
      "Includes door anchor and ankle straps",
      "Premium natural latex material",
      "Comfortable foam handles",
      "Carrying bag included",
      "Suitable for all fitness levels",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.id === slug);
}

export function getRelatedProducts(
  product: Product,
  count: number = 3
): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, count);
}