import { Link } from "@tanstack/react-router";
import { products } from "~/data/products";

export function FeaturedProducts() {
  return (
    <section className="bg-white px-6 py-20 dark:bg-gray-900 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Curated just for you — trending products with the best margins,
            handpicked by our AI.
          </p>
        </div>

        {/* Product grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              to="/products/$slug"
              params={{ slug: product.id }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-800/50"
            >
              {/* Product image */}
              <div className="flex aspect-square items-center justify-center bg-white p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Product info */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${product.price}
                  </span>
                  <span className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95">
                    View Product
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-600 px-8 py-3 text-base font-semibold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white active:scale-95 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            View All Products
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}