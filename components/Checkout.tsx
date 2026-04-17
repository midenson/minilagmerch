"use client";
import React, { useState, useRef } from "react";
import { Menu, ShoppingCart, Search, Minus, Plus, Share2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProductCheckoutPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isManualScrolling = useRef(false);

  const sizes = ["S", "M", "L", "XL", "2XL"];

  const productImages = [
    "https://images.weserv.nl/?url=m.media-amazon.com/images/I/51r+R2W6fQL._AC_UX679_.jpg",
    "https://images.weserv.nl/?url=m.media-amazon.com/images/I/71-U6Zz+E9L._AC_UX679_.jpg",
    "https://images.weserv.nl/?url=m.media-amazon.com/images/I/71u92yX7tWL._AC_UX679_.jpg",
  ];

  // Handle manual scroll detection to update thumbnails
  const handleScroll = () => {
    if (scrollRef.current && !isManualScrolling.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      if (index !== activeImageIndex) {
        setActiveImageIndex(index);
      }
    }
  };

  // Scroll to a specific image when thumbnail is clicked
  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      isManualScrolling.current = true;
      setActiveImageIndex(index);

      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * index,
        behavior: "smooth",
      });

      // Reset the flag after the smooth scroll duration (approx 500ms)
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 500);
    }
  };

  return (
    <div className="flex justify-center bg-[#141519] min-h-screen">
      <div className="w-full max-w-[100vw] sm:max-w-[430px] bg-white min-h-screen flex flex-col overflow-x-hidden relative">
        {/* FIXED NAVBAR SECTION */}
        <div className="fixed top-0 w-full z-50 max-w-[100vw] sm:max-w-[430px]">
          <div className="bg-[#141519] text-white py-[8px] text-center border-b border-white/10">
            <p className="text-[10px] font-bold tracking-tight uppercase">
              Free U.S. Shipping on Orders ₦75000+
            </p>
          </div>

          <nav className="bg-black px-4 py-3 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Menu className="text-white w-6 h-6" />
                <div className="flex items-center italic">
                  <div className="w-5 h-5 bg-[#f47521] rounded-full flex-shrink-0 mr-1 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full ml-1" />
                  </div>
                  <span className="text-white font-black text-lg tracking-tighter uppercase">
                    Minilagstore
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-white w-5 h-5" />
              </div>
            </div>
            <div className="relative flex">
              <Input
                className="bg-white rounded-l-[2px] rounded-r-none h-10 border-none text-sm placeholder:text-gray-500 focus-visible:ring-0 italic"
                placeholder="What are you looking for?"
              />
              <Button className="bg-[#f47521] hover:bg-[#d6621a] rounded-r-[2px] rounded-l-none h-10 px-4 border-none">
                <Search className="text-black w-5 h-5 stroke-[3px]" />
              </Button>
            </div>
          </nav>
        </div>

        {/* SPACER FOR FIXED NAVBAR */}
        <div className="h-[120px]"></div>

        {/* FULLY FUNCTIONAL IMAGE CAROUSEL SECTION */}
        <section className="bg-[#f6f6f6] p-4 pt-10 relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="aspect-square w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-white rounded-lg shadow-sm"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {productImages.map((img, idx) => (
              <div
                key={idx}
                className="min-w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-8"
              >
                <img
                  src={img}
                  alt={`Product View ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
          {/* Functional Thumbnail Preview Area */}
          <div className="flex justify-center gap-3 mt-4">
            {productImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => scrollToImage(idx)}
                className={`w-16 h-16 border-2 rounded-md p-2 bg-white cursor-pointer transition-all duration-300 ${
                  activeImageIndex === idx
                    ? "border-[#f47521] scale-110 shadow-md"
                    : "border-gray-200 opacity-50 grayscale-[50%]"
                }`}
              >
                <img src={img} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT DETAILS SECTION */}
        <section className="p-5 bg-white">
          <div className="mb-4">
            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-1">
              One Piece - Devil Fruit Graphic Crew Sweatshirt
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#00a3e0] text-[10px] font-black uppercase bg-[#00a3e0]/10 px-2 py-0.5 rounded">
                Pre-Order
              </span>
              <span className="text-[#f47521] text-[10px] font-black uppercase bg-[#f47521]/10 px-2 py-0.5 rounded">
                Exclusive
              </span>
            </div>
            <p className="text-2xl font-black text-black">$54.99</p>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-6">
            {/* Functional Size Selection */}
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
                    className={`flex-1 h-[54px] flex items-center justify-center border-2 font-bold text-base transition-all duration-300 rounded-md ${
                      selectedSize === size
                        ? "border-[#f47521] text-white bg-[#f47521]"
                        : "border-gray-200 text-black hover:border-black bg-transparent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Full-Width Dynamic Quantity Selector */}
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-full w-full overflow-hidden h-14">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-8 h-full"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-8 h-full"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-[#f47521] hover:bg-[#d6621a] text-black font-black py-7 rounded-full uppercase text-base tracking-wider transition-transform active:scale-95">
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-black font-black py-7 rounded-full uppercase text-base tracking-wider hover:bg-black hover:text-white transition-all active:scale-95"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </section>

        {/* SHARE & SOCIALS */}
        <section className="p-5 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <Share2 className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
            <FaFacebook className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
            <FaInstagram className="w-5 h-5 cursor-pointer hover:text-pink-600 transition-colors" />
            <FaYoutube className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
          </div>
        </section>

        {/* PRODUCT DESCRIPTION/SPEC DETAILS */}
        <section className="p-5 border-t border-gray-100 mb-10">
          <h4 className="font-black text-sm uppercase mb-4 tracking-widest">
            Product Details
          </h4>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <li>• Officially Licensed One Piece Merchandise</li>
            <li>• 80% Cotton / 20% Polyester Premium Blend</li>
            <li>• Screen-printed Devil Fruit graphics on chest and back</li>
            <li>• Ribbed cuffs and waistband for a comfortable fit</li>
          </ul>
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
    </div>
  );
};

export default ProductCheckoutPage;
