import { Link, createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  products,
  getProductBySlug,
  getRelatedProducts,
} from "~/data/products";
import { PayPalButton } from "~/components/PayPalButton";
import { useCart } from "~/lib/cart-context";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailPage,
  head: () => ({
    meta: [
      {
        title: "Product Details - DropAI",
      },
    ],
  }),
});

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const starSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${starSize} text-amber-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg
          className={`${starSize} text-amber-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="halfStarDetail">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfStarDetail)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${starSize} text-gray-300 dark:text-gray-600`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1.5 text-sm text-gray-500 dark:text-gray-400">
        {rating} ({Math.floor(rating * 20)} reviews)
      </span>
    </div>
  );
}

const categoryGradients: Record<string, string> = {
  "Tech Accessories": "from-purple-500 to-indigo-600",
  "Health & Wellness": "from-emerald-500 to-teal-600",
  "Home Goods": "from-amber-500 to-orange-600",
};

function ProductIcon({
  image,
  className,
}: {
  image: string;
  className?: string;
}) {
  if (image.startsWith("/")) {
    return (
      <img
        src={image}
        alt="Product"
        className="h-full w-full object-contain p-6"
      />
    );
  }
  const iconClass = className || "h-10 w-10 text-white";
  return (
    <svg
      className={iconClass}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
function NotFoundState() {
  return (
    <div className="flex min-h-dvh flex-col">
      
      <main className="flex flex-1 items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-95"
          >
            Browse Products
          </Link>
        </div>
      </main>
    </div>
  );
}

function ProductDetailPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { slug } = useParams({ from: "/products/$slug" });
  const product = getProductBySlug(slug);

  if (!product) {
    return <NotFoundState />;
  }

  const gradient = categoryGradients[product.category] || "from-indigo-500 to-purple-600";
  const handleAddToCart = () => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };
  const relatedProducts = getRelatedProducts(product, 3);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Navigation */}
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-[60] animate-slide-up rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl dark:bg-white dark:text-gray-900">
          <div className="flex items-center gap-2.5">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <section className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-950/50">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                to="/"
                className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Home
              </Link>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <Link
                to="/products"
                className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Products
              </Link>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="font-medium text-gray-900 dark:text-white">
                {product.name}
              </span>
            </nav>
          </div>
        </section>

        {/* Product Detail */}
        <section className="bg-white px-6 py-8 dark:bg-gray-900 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <div
                  className={`flex aspect-square items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <ProductIcon
                      image={product.image}
                      className="h-20 w-20 text-white sm:h-28 sm:w-28"
                    />
                    <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {product.category}
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    In Stock
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-3">
                  <StarRating rating={product.rating} size="md" />
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${product.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-500">
                    ${(product.price * 1.4).toFixed(2)}
                  </span>
                  <span className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/50 dark:text-red-400">
                    Save 30%
                  </span>
                </div>

                <p className="mt-6 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>

                {/* Specs */}
                {product.specs && product.specs.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Key Features
                    </h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {product.specs.map((spec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button onClick={handleAddToCart} className="flex-1 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95">
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product);
                      router.navigate({ to: "/cart" });
                    }}
                    className="flex-1 rounded-xl border-2 border-indigo-600 px-8 py-4 text-base font-semibold text-indigo-600 transition-all hover:bg-indigo-50 active:scale-95 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950"
                  >
                    Buy Now
                  </button>
                </div>

                {/* PayPal Button */}
                <div className="mt-6">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        Or pay with PayPal
                      </span>
                    </div>
                  </div>
                  <PayPalButton amount={product.price} />
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free Shipping
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    30-Day Returns
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure Checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <section className="bg-gray-50 px-6 py-16 dark:bg-gray-800/50">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                You May Also Like
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                More products from {product.category}
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((rp) => {
                  const rpGradient =
                    categoryGradients[rp.category] || "from-indigo-500 to-purple-600";
                  return (
                    <Link
                      key={rp.id}
                      to="/products/$slug"
                      params={{ slug: rp.id }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-800/50"
                    >
                      <div
                        className={`flex aspect-square items-center justify-center bg-gradient-to-br ${rpGradient}`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <ProductIcon image={rp.image} />
                          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {rp.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {rp.name}
                        </h3>
                        <div className="mt-2">
                          <StarRating rating={rp.rating} />
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${rp.price}
                          </span>
                          <span className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95">
                            View Details
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back to products */}
        <section className="bg-white px-6 py-8 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 12H5m7 7l-7-7 7-7"
                />
              </svg>
              Back to All Products
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} DropAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              Home
            </Link>
            <a
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
