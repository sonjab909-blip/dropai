"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PayPalButtonProps {
  amount: number;
}

interface PayPalOrderData {
  orderID: string;
  payerID: string;
  status: string;
}

// Track script loading state globally so we only load once
let scriptLoadPromise: Promise<void> | null = null;

function loadPayPalScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector("script[data-paypal-sdk]")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=BAAMs25MJEktcyfQLwAApUqqliajMzCStonJpbbKuW9ZpWVUdR-ZKKhknKiOEbtxzN2MhA1uJEJ70mhE9s&currency=USD";
    script.setAttribute("data-paypal-sdk", "true");
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load PayPal SDK"));
    };
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: (
          data: Record<string, unknown>,
          actions: {
            order: {
              create: (order: {
                purchase_units: Array<{
                  amount: { value: string };
                }>;
              }) => Promise<string>;
            };
          }
        ) => Promise<string>;
        onApprove: (
          data: PayPalOrderData,
          actions: {
            order: {
              capture: () => Promise<{
                status: string;
                id: string;
                purchase_units: Array<{
                  payments: {
                    captures: Array<{
                      id: string;
                      status: string;
                    }>;
                  };
                }>;
              }>;
            };
          }
        ) => Promise<void>;
        onError: (err: Error) => void;
        style?: {
          color?: "gold" | "blue" | "silver" | "white" | "black";
          shape?: "rect" | "pill";
          label?: "paypal" | "checkout" | "buynow" | "pay";
          layout?: "vertical" | "horizontal";
          tagline?: boolean;
        };
      }) => {
        render: (container: string | HTMLElement) => Promise<void>;
      };
    };
  }
}

export function PayPalButton({ amount }: PayPalButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "error" | "success"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const buttonRenderedRef = useRef(false);

  const renderButton = useCallback(() => {
    if (!window.paypal || !buttonContainerRef.current || buttonRenderedRef.current) return;

    buttonRenderedRef.current = true;

    window.paypal
      .Buttons({
        createOrder: (_data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: amount.toFixed(2) },
              },
            ],
          });
        },
        onApprove: async (_data, actions) => {
          const details = await actions.order.capture();
          const captureId =
            details.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
            details.id ||
            _data.orderID;
          setTransactionId(captureId);
          setStatus("success");
        },
        onError: (err) => {
          console.error("PayPal Checkout Error:", err);
          setErrorMessage(err.message || "Payment failed. Please try again.");
          setStatus("error");
          // Allow re-rendering
          buttonRenderedRef.current = false;
        },
        style: {
          color: "gold",
          shape: "rect",
          label: "paypal",
          layout: "vertical",
          tagline: false,
        },
      })
      .render(buttonContainerRef.current)
      .catch((err: Error) => {
        console.error("PayPal render error:", err);
        setErrorMessage(err.message || "Failed to render PayPal button");
        setStatus("error");
        buttonRenderedRef.current = false;
      });
  }, [amount]);

  useEffect(() => {
    setStatus("loading");
    setErrorMessage("");
    setTransactionId("");
    buttonRenderedRef.current = false;

    loadPayPalScript()
      .then(() => {
        setStatus("ready");
        // Small delay to ensure DOM is ready
        setTimeout(renderButton, 100);
      })
      .catch((err: Error) => {
        console.error("PayPal SDK load error:", err);
        setErrorMessage(err.message || "Failed to load PayPal");
        setStatus("error");
      });

    return () => {
      buttonRenderedRef.current = false;
    };
  }, [amount, renderButton]);

  // Success state
  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payment Successful!
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Thank you for your order.
        </p>
        <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-500">
          Transaction ID: {transactionId}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Loading state */}
      {status === "loading" && (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-6 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading PayPal...
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                PayPal Error
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
              <button
                onClick={() => {
                  setStatus("loading");
                  setErrorMessage("");
                  buttonRenderedRef.current = false;
                  loadPayPalScript()
                    .then(() => {
                      setStatus("ready");
                      setTimeout(renderButton, 100);
                    })
                    .catch((err: Error) => {
                      setErrorMessage(err.message || "Failed to load PayPal");
                      setStatus("error");
                    });
                }}
                className="mt-3 text-sm font-medium text-red-700 underline transition-colors hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PayPal button container */}
      {status === "ready" && (
        <div ref={buttonContainerRef} className="paypal-button-container min-h-[45px]" />
      )}
    </div>
  );
}
