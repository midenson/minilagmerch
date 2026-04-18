import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { CheckCircle2, Mail, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

// Fixes: Binding element 'searchParams' implicitly has an 'any' type
interface ReturnPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function Return({ searchParams }: ReturnPageProps) {
  const params = await searchParams;
  const session_id = params.session_id;

  if (!session_id) {
    return redirect("/");
  }

  // Retrieve the session
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const status = session.status;

  // Fixes: Property 'email' does not exist on type 'CustomerDetails | null'
  // We access it safely using optional chaining
  const customerEmail = session.customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <div className="flex justify-center bg-[#141519] min-h-screen">
        <div className="w-full max-w-[100vw] sm:max-w-[430px] bg-white min-h-screen flex flex-col items-center px-6 pt-20 text-center relative">
          {/* SUCCESS HEADER */}
          <div className="mb-10">
            <div className="w-20 h-20 bg-[#f47521]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-12 h-12 text-[#f47521]" />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              Payment
              <br />
              Successful
            </h1>
          </div>

          <div className="space-y-6 w-full">
            <div className="bg-[#f6f6f6] p-6 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                Confirmation Sent To
              </p>
              <p className="text-sm font-bold text-black break-all">
                {customerEmail || "your email address"}
              </p>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed px-4">
              Thank you for shopping with{" "}
              <span className="text-black font-bold italic uppercase">
                Minilagstore
              </span>
              . Your order is being processed and you will receive a tracking
              number shortly.
            </p>

            <div className="pt-10 space-y-3">
              <Link href="/" className="block">
                <button className="w-full bg-[#f47521] text-black font-black py-5 rounded-full uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-[#d6621a] transition-all active:scale-95">
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/" className="block">
                <button className="w-full bg-black text-white font-black py-5 rounded-full uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95">
                  <ShoppingBag className="w-4 h-4" /> View My Orders
                </button>
              </Link>
            </div>
          </div>

          {/* SUPPORT FOOTER */}
          <div className="mt-auto pb-12">
            <div className="flex flex-col items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>Need help?</span>
                <a
                  href="mailto:support@minilagstore.com"
                  className="text-black underline decoration-[#f47521]"
                >
                  support@minilagstore.com
                </a>
              </div>
              <span className="opacity-30 mt-4">© 2026 Minilagstore, LLC</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for unexpected status
  return redirect("/");
}
