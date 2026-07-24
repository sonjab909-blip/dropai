import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useCart } from "~/lib/cart-context";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [{ title: "Shopping Cart - DropAI" }],
  }),
});

 

function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, cartCount } =
    useCart();
  const [checkoutMsg, setCheckoutMsg] = useState(false);

  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleCheckout = () => {
    setCheckoutMsg(true);
    setTimeout(() => setCheckoutMsg(false), 4000);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {cartCount === 0
                ? "Your cart is empty"
                : `${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 dark:border-gray-700 dark:bg-gray-900">
              <svg
                className="mb-6 h-20 w-20 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-95"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Browse Products
              </Link>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map(({ product, quantity }) => {
                    const lineTotal = product.price * quantity;

                    return (
                      <div
                        key={product.id}
                        className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:p-6"
                      >
                        {/* Product Image */}
                        <Link
                          to="/products/$slug"
                          params={{ slug: product.id }}
                          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-3"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <Link
                              to="/products/$slug"
                              params={{ slug: product.id }}
                              className="text-base font-semibold text-gray-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                            >
                              {product.name}
                            </Link>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {product.category}
                            </p>
                            <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              ${product.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700">
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                aria-label="Decrease quantity"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0) {
                                    updateQuantity(product.id, val);
                                  }
                                }}
                                className="h-9 w-14 border-x border-gray-300 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none dark:border-gray-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                aria-label="Increase quantity"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Line Total */}
                            <span className="w-20 text-right text-sm font-semibold text-gray-900 dark:text-white">
                              ${lineTotal.toFixed(2)}
                            </span>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                              aria-label={`Remove ${product.name} from cart`}
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping Link */}
                <div className="mt-6">
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
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-4">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      {shipping === 0 ? (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          Free
                        </span>
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${shipping.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Tax */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax (est.)
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${tax.toFixed(2)}
                      </span>
                    </div>

                    {/* Free shipping banner */}
                    {cartTotal < 50 && cartTotal > 0 && (
                      <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                        Add ${(50 - cartTotal).toFixed(2)} more for free
                        shipping!
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Checkout Message */}
                  {checkoutMsg && (
                    <div className="mt-4 animate-slide-up rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                      Checkout coming soon! Use PayPal on the product page for
                      now.
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure checkout
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      30-day easy returns
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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
