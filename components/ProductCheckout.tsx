"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Menu,
  ShoppingCart,
  Search,
  Minus,
  Plus,
  Share2,
  Loader2,
  ArrowRight,
  X,
  Trash2,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ProductCheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId =
    searchParams.get("product_id") || searchParams.get("product_ud");

  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auth & UI State
  const [user, setUser] = useState<any>(null);
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    ((userId: string) => void) | null
  >(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isManualScrolling = useRef(false);

  const sizes = ["S", "M", "L", "XL", "2XL"];

  useEffect(() => {
    const initializePage = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const { data: pData, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) throw error;
        if (pData) setProductData(pData);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          fetchCartItems(session.user.id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [productId]);

  // Convert text description into list items (splitting by periods)
  const productDetails = productData?.description
    ? productData.description
        .split(". ")
        .filter((s: string) => s.trim().length > 0)
    : ["No details available for this product."];

  const fetchCartItems = async (userId: string) => {
    setCartLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`*, products(*)`)
        .eq("user_id", userId);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) throw error;
      if (user) fetchCartItems(user.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const removeCartItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Item removed from cart");
      if (user) fetchCartItems(user.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBuyNow = () => {
    if (!productId) return;

    const params = new URLSearchParams();
    params.set("product_id", productId);
    params.set("qty", quantity.toString());
    params.set("size", selectedSize);

    router.push(`/checkout?${params.toString()}`);
  };

  const handleScroll = () => {
    if (scrollRef.current && !isManualScrolling.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      if (index !== activeImageIndex) {
        setActiveImageIndex(index);
      }
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      isManualScrolling.current = true;
      setActiveImageIndex(index);
      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * index,
        behavior: "smooth",
      });
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 500);
    }
  };

  const requireAuth = async (action: (userId: string) => void) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);
      action(session.user.id);
    } else {
      setPendingAction(() => action);
      setIsAuthSheetOpen(true);
    }
  };

  const handleAddToCart = () => {
    requireAuth(async (userId) => {
      try {
        const { error } = await supabase.from("cart_items").insert([
          {
            user_id: userId,
            product_id: productId,
            quantity: quantity,
            size: selectedSize,
          },
        ]);

        if (error) throw error;

        await fetchCartItems(userId);
        setIsCartModalOpen(true);
        toast.success("Added to cart successfully!");
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const handleCheckout = async () => {
    setCartLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      toast.error("Failed to initiate checkout");
    } finally {
      setCartLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      let authResult;
      if (authMode === "login") {
        authResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        authResult = await supabase.auth.signUp({ email, password });
      }

      if (authResult.error) {
        toast.error(authResult.error.message);
        return;
      }

      if (authResult.data.user) {
        setUser(authResult.data.user);
        setIsAuthSheetOpen(false);
        if (pendingAction) {
          pendingAction(authResult.data.user.id);
          setPendingAction(null);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.products?.price || 0) * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 16 : 0;
  const vat = subtotal * 0.2;
  const total = subtotal + shipping + vat;

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#141519] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#f47521]" />
      </div>
    );
  }

  const productImages =
    productData?.images?.length > 0
      ? productData.images
      : ["https://via.placeholder.com/600"];
  const productTitle = productData?.name || "Product Not Found";
  const productPrice = productData?.price
    ? `₦${Number(productData.price).toLocaleString()}`
    : "₦0.00";

  return (
    <div className="flex justify-center bg-[#141519] min-h-screen">
      <div className="w-full max-w-[100vw] sm:max-w-[430px] bg-white min-h-screen flex flex-col overflow-x-hidden relative">
        {/* AUTHENTICATION SHEET */}
        <Sheet open={isAuthSheetOpen} onOpenChange={setIsAuthSheetOpen}>
          <SheetContent
            side="bottom"
            className="h-[55vh] w-[85%] sm:max-w-[400px] mx-auto mb-6 rounded-[30px] p-0 flex flex-col bg-[#eef4ea] border-none overflow-hidden"
          >
            <div className="w-full h-[40%] relative bg-white">
              <SheetTitle className="sr-only">Authentication</SheetTitle>
              <img
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop"
                alt="Auth Illustration"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#eef4ea] to-transparent" />
              <h2 className="absolute bottom-4 left-8 text-3xl font-black uppercase text-[#1c211f] leading-none tracking-tighter">
                {authMode === "signup" ? (
                  <>
                    Create
                    <br />
                    Account
                  </>
                ) : (
                  <>
                    Welcome
                    <br />
                    Back
                  </>
                )}
              </h2>
            </div>
            <div className="flex-1 px-8 py-6">
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {authMode === "signup" && (
                  <Input
                    name="name"
                    placeholder="Name"
                    className="border-0 border-b border-[#a4b5a0] rounded-none px-0 h-12 bg-transparent text-[#1c211f]"
                  />
                )}
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="border-0 border-b border-[#a4b5a0] rounded-none px-0 h-12 bg-transparent text-[#1c211f]"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="border-0 border-b border-[#a4b5a0] rounded-none px-0 h-12 bg-transparent text-[#1c211f]"
                />
                <div className="pt-8 flex items-end justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode(authMode === "login" ? "signup" : "login")
                    }
                    className="text-left text-[#1c211f] text-sm font-semibold underline decoration-2 underline-offset-4"
                  >
                    {authMode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-16 h-16 bg-[#1c211f] rounded-full flex items-center justify-center text-[#eaf4db]"
                  >
                    {authLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <ArrowRight className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </SheetContent>
        </Sheet>

        {/* SHOPPING CART MODAL - MODIFIED FOR SCROLLABILITY */}
        <Dialog open={isCartModalOpen} onOpenChange={setIsCartModalOpen}>
          <DialogContent className="sm:max-w-[430px] p-0 bg-white border-none h-[90vh] sm:h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader className="p-4 border-b flex flex-row items-center justify-between flex-shrink-0">
              <DialogTitle className="text-lg font-bold">
                Shopping Cart
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="w-20 h-20 bg-[#f6f6f6] rounded flex-shrink-0">
                      <img
                        src={item.products?.images?.[0]}
                        className="w-full h-full object-contain"
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm">
                          {item.products?.name}
                        </h4>
                        <p className="font-bold text-sm">
                          ₦{Number(item.products?.price).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-green-600 font-semibold mb-1">
                        In Stock
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Size: {item.size}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 border-r"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 border-l"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-300 mb-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                  <p className="font-black text-gray-400 tracking-tighter text-xl uppercase">
                    Start adding items to your cart
                  </p>
                </div>
              )}
            </div>

            {/* FIXED FOOTER SECTION IN MODAL */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t bg-white flex-shrink-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span>₦{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>VAT (20%)</span>
                    <span>₦{vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black pt-2 border-t">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || cartLoading}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-black py-8 text-lg rounded-md"
                >
                  GO TO CHECKOUT (₦{total.toLocaleString()})
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* HEADER */}
        <div className="fixed top-0 w-full max-w-[430px] z-50">
          <div className="bg-[#141519] text-white py-[8px] text-center border-b border-white/10">
            <p className="text-[17px] font-accent font-bold tracking-tight uppercase">
              Free NIGERIAN Shipping on Orders ₦75,000+
            </p>
          </div>
          <nav className="w-full bg-black px-4 py-3 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Menu className="text-white w-6 h-6" />
                <div className="flex items-center italic">
                  {/* <div className="w-5 h-5 bg-[#f47521] rounded-full mr-1 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full ml-1" />
                  </div> */}
                  <div className="w-6 h-6 rounded-full bg-[#f47521] mr-1 flex items-center justify-center">
                    <img
                      src={"/minilag.png"}
                      alt="logo"
                      width={50}
                      height={50}
                    />
                  </div>
                  <span className="text-white font-black text-lg tracking-tighter uppercase">
                    Minilagstore
                  </span>
                </div>
              </div>
              <button onClick={() => setIsCartModalOpen(true)}>
                <ShoppingCart className="text-white w-5 h-5" />
              </button>
            </div>
            <div className="relative flex">
              <Input
                className="bg-white rounded-l-[2px] rounded-r-none h-10 border-none text-sm italic"
                placeholder="What are you looking for?"
              />
              <Button className="bg-[#f47521] rounded-r-[2px] rounded-l-none h-10 px-4 border-none">
                <Search className="text-black w-5 h-5 stroke-[3px]" />
              </Button>
            </div>
          </nav>
        </div>

        <div className="h-[120px]"></div>

        {/* HERO SECTION */}
        <section className="bg-[#f6f6f6] p-4 pt-10 relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="aspect-square w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-white rounded-lg shadow-sm"
          >
            {productImages.map((img: string, idx: number) => (
              <div
                key={idx}
                className="min-w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-8"
              >
                <img
                  src={img}
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-4">
            {productImages.map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => scrollToImage(idx)}
                className={`w-16 h-16 border-2 rounded-md p-2 bg-white cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#f47521]"
                    : "border-gray-200 opacity-50"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT UI */}
        <section className="p-5 bg-white">
          <div className="mb-4">
            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-1">
              {productTitle}
            </h1>
            <p className="text-2xl font-black text-black">{productPrice}</p>
          </div>
          <div className="border-t border-gray-100 pt-6 space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3 text-gray-500">
                Select a Size:{" "}
                <span className="text-black ml-1">{selectedSize}</span>
              </p>
              <div className="flex justify-between gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 h-[54px] border-2 font-bold rounded-md ${
                      selectedSize === size
                        ? "border-[#f47521] text-white bg-[#f47521]"
                        : "border-gray-200 text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-full w-full h-14">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-8"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-8"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#f47521] hover:bg-[#d6621a] text-black font-black py-7 rounded-full uppercase text-base tracking-wider"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="w-full border-2 border-black font-black py-7 rounded-full uppercase text-base tracking-wider"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </section>

        {/* PRODUCT DESCRIPTION */}
        <section className="p-5 border-t border-gray-100 mb-10">
          <h4 className="font-black text-sm uppercase mb-4 tracking-widest">
            Product Details
          </h4>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            {productDetails.map((detail: string, index: number) => (
              <li key={index}>• {detail.trim()}</li>
            ))}
          </ul>
        </section>

        {/* FOOTER SECTION */}
        <footer className="bg-black text-white pt-12 pb-6 px-5">
          <div className="mb-10">
            <h3 className="font-black text-2xl uppercase italic mb-4">
              Join our mailing list
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Be the first to get special offers & deals!
            </p>
            <div className="flex gap-0">
              <Input
                className="bg-white text-black rounded-none h-12 border-none focus-visible:ring-0"
                placeholder="Email Address"
              />
              <Button className="bg-[#f47521] rounded-none h-12 px-6 uppercase font-black text-black hover:bg-[#d6621a]">
                Subscribe
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 mt-3 leading-tight">
              By submitting your email address, you acknowledge that you have
              read Minilagmerch&apos;s{" "}
              <span className="underline">Privacy Policy</span>. You can opt out
              at any time.
            </p>
          </div>

          <div className="flex gap-6 mb-10">
            <FaFacebook className="w-5 h-5 fill-white" />
            <FaInstagram className="w-5 h-5" />
            <FaYoutube className="w-5 h-5 fill-white" />
          </div>

          <div className="grid grid-cols-2 gap-y-10 mb-12">
            <div>
              <h4 className="font-black uppercase text-[#f47521] text-xs mb-4 tracking-widest">
                Shop By Series
              </h4>
              <ul className="space-y-2 text-[11px] font-bold text-gray-300 uppercase">
                <li>Chainsaw Man</li>
                <li>Demon Slayer</li>
                <li>One Piece</li>
                <li>SPY x FAMILY</li>
                <li>Jujutsu Kaisen</li>
                <li>My Hero Academia</li>
                <li className="text-white">Shop All Series</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-[#f47521] text-xs mb-4 tracking-widest">
                Customer Service
              </h4>
              <ul className="space-y-2 text-[11px] font-bold text-gray-300 uppercase">
                <li>Track Your Order</li>
                <li>Shipping & Returns</li>
                <li>Help Center</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <span>🌍 Change Region</span>
              <span className="mx-2 opacity-20">|</span>
              <span>Copyright © 2026 Minilagmerch, LLC</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductCheckoutPage;
