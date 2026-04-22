"use client";
import React, { useState, useEffect } from "react";
import { Menu, ShoppingCart, Search, Heart, Star, Loader2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Reusable Promo Card Component ---
const PromoCard = ({ title, description, image, bgText, onClick }: any) => (
  <div className="mx-4 mb-6 rounded-2xl overflow-hidden cursor-pointer shadow-lg group active:scale-[0.98] transition-all">
    <div className="relative h-[320px] bg-[#FF6B00] flex items-center justify-center overflow-hidden">
      <div className="absolute bottom-4 left-0 w-full select-none opacity-90">
        <div className="text-white font-black text-[50px] leading-[0.9] uppercase italic tracking-tighter whitespace-nowrap">
          {bgText} {bgText} {bgText}
        </div>
        <div className="text-white font-black text-[50px] leading-[0.9] uppercase italic tracking-tighter whitespace-nowrap">
          {bgText} {bgText} {bgText}
        </div>
        <div className="text-white font-black text-[50px] leading-[0.9] uppercase italic tracking-tighter whitespace-nowrap">
          {bgText} {bgText} {bgText}
        </div>
      </div>
      <img
        src={image}
        alt={title}
        className="relative z-10 w-[80%] h-[80%] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="bg-black p-5 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="relative z-10">
        <h3 className="text-white font-black text-[24px] uppercase italic tracking-tighter mb-1">
          {title}
        </h3>
        <p className="text-gray-400 text-[14px] font-medium leading-tight">
          {description}
        </p>
      </div>
    </div>
  </div>
);

// --- Reusable Product Card Component ---
const ProductCard = ({
  image,
  title,
  price,
  isPreOrder,
  isExclusive,
  rating,
  vertical = false,
  onClick,
}: any) => (
  <div
    onClick={onClick}
    className={`flex flex-col group cursor-pointer ${
      vertical ? "w-full mb-8" : "flex-none w-[165px]"
    }`}
  >
    <div className="relative aspect-square bg-[#f6f6f6] rounded-sm overflow-hidden flex items-center justify-center p-4">
      <img
        src={image}
        alt={title}
        className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm border border-gray-100"
      >
        <Heart className="w-4 h-4 text-[#f47521]" />
      </button>
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
        {isPreOrder && (
          <div className="bg-[#00a3e0] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
            Pre-Order
          </div>
        )}
        {isExclusive && (
          <div className="bg-[#f47521] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            Exclusive
          </div>
        )}
      </div>
    </div>
    <div className="mt-3 flex flex-col flex-grow px-1">
      <h3 className="text-[12px] font-medium leading-tight text-gray-800 line-clamp-2 h-[32px] mb-1">
        {title}
      </h3>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[14px] font-black text-black">
          ₦{Number(price).toLocaleString()}
        </p>
        {rating && (
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-[#f47521] text-[#f47521]" />
            <span className="text-[10px] font-bold text-gray-500">
              {rating}
            </span>
          </div>
        )}
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="w-full bg-black hover:bg-zinc-800 text-white font-black text-[11px] py-4 rounded-full uppercase tracking-tight h-auto"
      >
        Add to Cart
      </Button>
    </div>
  </div>
);

const AnimeStore = () => {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace your existing useEffect fetch logic with this:

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const { data: allProducts, error: allErr } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: featured, error: featErr } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Streetwear")
        .limit(5);

      const error = allErr || featErr;

      if (error) {
        // THE FIX: If the JWT is expired, try to refresh or just sign out
        if (error.code === "PGRST303") {
          console.warn("JWT Expired. Attempting to refresh session...");
          const { error: refreshError } = await supabase.auth.refreshSession();

          if (refreshError) {
            // If refresh fails, the session is truly dead. Nuke it.
            await supabase.auth.signOut();
            router.refresh(); // Reloads the page state
          } else {
            // If refresh worked, retry the fetch once
            fetchAllData();
            return;
          }
        }
        console.error("Supabase Error:", error);
      } else {
        const format = (list: any[]) =>
          list.map((p) => ({
            id: p.id,
            title: p.name,
            price: p.price,
            image: p.images?.[0] || "https://via.placeholder.com/400",
            isExclusive: p.category === "Streetwear",
            isPreOrder: p.name.toLowerCase().includes("pre-order"),
            rating: "5.0",
          }));

        setItems(format(allProducts || []));
        setFeaturedItems(format(featured || []));
      }
      setLoading(false);
    };

    fetchAllData();
  }, [router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") {
        console.log("Session refreshed successfully");
      }
      if (event === "SIGNED_OUT") {
        // Clear any local state if necessary
        setItems([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const goToCheckout = (productId?: string) => {
    if (productId) {
      router.push(`/product-checkout?product_id=${productId}`);
    } else {
      router.push("/product-checkout");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#141519] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#f47521]" />
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[#141519] min-h-screen">
      <div className="w-full max-w-[100vw] sm:max-w-[430px] bg-white min-h-screen shadow-2xl flex flex-col overflow-x-hidden relative">
        {/* TOP NAV */}
        <div className="bg-[#141519] text-white py-[10px] text-center border-b border-white/10">
          <p className="text-[17px] font-bold tracking-tight uppercase font-accent">
            Free NIGERIAN Shipping on Orders ₦75,000+
          </p>
        </div>

        <nav className="bg-black px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Menu className="text-white w-7 h-7" />
              <div className="flex items-center italic">
                <div className="w-6 h-6 bg-[#f47521] rounded-full flex-shrink-0 mr-1.5 flex items-center justify-center">
                  {/* <div className="w-2 h-2 bg-black rounded-full ml-1" /> */}
                  <img src={"/minilag.png"} alt="logo" width={70} height={70} />
                </div>
                <span className="text-white font-black text-xl tracking-tighter uppercase">
                  Minilagstore{" "}
                  <span className="font-light text-xs ml-0.5 not-italic tracking-widest opacity-80 uppercase">
                    merch
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-sm">
                <span className="text-lg">🇳🇬</span>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white" />
              </div>
              <ShoppingCart className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="relative flex">
            <Input
              className="bg-white rounded-l-[2px] rounded-r-none h-11 border-none text-base placeholder:text-gray-500 focus-visible:ring-0 italic"
              placeholder="What are you looking for?"
            />
            <Button className="bg-[#f47521] hover:bg-[#d6621a] rounded-r-[2px] rounded-l-none h-11 px-5 border-none">
              <Search className="text-black w-6 h-6 stroke-[3px]" />
            </Button>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative w-full bg-black aspect-[1/0.95] overflow-hidden">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0tvIN4Plt6ywG83HhydAYgJAyanexnr1JcrK3UxlTpKCmrPl6w7SqB64k9EgCMYl1qQRid20irq3-wEBqRbUZ245xHG3tUFDBBMjfDLvag&s=10"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 p-6 h-full flex flex-col">
            <h1 className="text-white text-[34px] font-black font-body leading-[0.85] uppercase italic mb-4 tracking-tighter">
              The defender <br /> who fights like <br /> an anime hero
            </h1>
            <Button className="bg-[#f47521] hover:bg-white text-black font-black text-xs uppercase px-10 py-6 rounded-full w-fit">
              Shop Now
            </Button>
          </div>
        </section>

        {/* HORIZONTAL SECTION (REAL DATA) */}
        <section className="py-8 bg-white">
          <div className="px-5 mb-6">
            <h2 className="text-black text-[32px] font-black leading-none uppercase tracking-tighter mb-1">
              Top Streetwear
            </h2>
            <a
              href="#"
              className="text-black font-bold text-[17px] underline underline-offset-[10px] decoration-[3px]"
            >
              Shop All
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                onClick={() => goToCheckout(item.id)}
                image={item.image}
                title={item.title}
                price={item.price}
                isPreOrder={item.isPreOrder}
                isExclusive={item.isExclusive}
              />
            ))}
          </div>
        </section>

        {/* PROMO CARDS */}
        <section className="bg-white pb-6">
          <PromoCard
            onClick={() => goToCheckout()}
            title="Shop Fresh Finds"
            description="Keep your collection fresh with shiny, new pre-orders."
            bgText="Fresh"
            image="https://img-1.kwcdn.com/thumbnail/s/bde816453c3e70cbcf43bb424c966548_dd6ebb7a5324.jpeg?imageView2/2/w/1300/q/80/format/avif"
          />
        </section>

        {/* MAIN FEED (REAL DATA) */}
        <section className="bg-white px-5 pt-4 border-t border-gray-100">
          <h2 className="text-black text-[28px] font-black uppercase italic tracking-tighter mb-6">
            What's New in Anime
          </h2>
          <div className="grid grid-cols-2 gap-x-4">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <ProductCard
                  key={`${item.id}-${idx}`}
                  vertical
                  image={item.image}
                  title={item.title}
                  price={item.price}
                  isExclusive={item.isExclusive}
                  isPreOrder={item.isPreOrder}
                  rating={item.rating}
                  onClick={() => goToCheckout(item.id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-10 font-bold uppercase">
                No products found
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default AnimeStore;
