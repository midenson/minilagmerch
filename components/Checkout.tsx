"use client";

import React, { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchClientSecret } from "@/app/actions/stripe";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const searchParams = useSearchParams();

  // Get product_id from URL (matches the logic in your product page)
  const productId =
    searchParams.get("product_id") || searchParams.get("product_ud");
  const quantity = parseInt(searchParams.get("qty") || "1", 10);

  // We use useCallback to create a stable function that matches
  // the expected type: () => Promise<string>
  const getClientSecret = useCallback(async () => {
    if (!productId) {
      throw new Error("Missing product ID in checkout");
    }

    const secret = await fetchClientSecret(productId, quantity);

    if (!secret) {
      throw new Error("Failed to retrieve client secret");
    }

    return secret;
  }, [productId, quantity]);

  if (!productId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#141519] text-white">
        <p className="font-bold uppercase tracking-widest text-red-500">
          Invalid Product
        </p>
      </div>
    );
  }

  return (
    <div id="checkout" className="min-h-screen bg-white">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: getClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
