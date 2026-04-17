import React from 'react';
import { Search, ShoppingCart, Menu, ChevronRight, Star, Instagram, Twitter, Youtube, Facebook, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// --- Sub-Components ---

const TopNotice = () => (
  <div className="bg-[#141519] text-white text-[10px] py-2 px-4 flex justify-between items-center border-b border-white/10">
    <span>Free U.S. Shipping on Orders $75+</span>
    <span className="text-[#f47521] font-bold">Stream Anime on <span className="uppercase">Crunchyroll</span></span>
  </div>
);

const Header = () => (
  <header className="sticky top-0 z-50 bg-black">
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <div className="flex items-center gap-3">
        <Menu className="text-white w-6 h-6" />
        <div className="text-[#f47521] font-black text-xl tracking-tighter flex items-center">
          crunchyroll <span className="text-white ml-1 font-light text-sm uppercase tracking-widest">store</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
           <span className="text-lg mr-1">🇺🇸</span>
        </div>
        <ShoppingCart className="text-white w-6 h-6" />
      </div>
    </div>
    <div className="px-4 pb-3">
      <div className="relative">
        <Input 
          className="bg-white text-black rounded-sm pr-10 h-10 border-none focus-visible:ring-0" 
          placeholder="What are you looking for?" 
        />
        <div className="absolute right-0 top-0 h-full w-10 bg-[#f47521] flex items-center justify-center rounded-r-sm">
          <Search className="text-white w-5 h-5" />
        </div>
      </div>
    </div>
  </header>
);

const ProductCard = ({ title, price, image, badge, rating }: any) => (
  <div className="min-w-[160px] max-w-[160px] flex flex-col group cursor-pointer">
    <div className="relative aspect-[3/4] bg-[#23252b] rounded-sm overflow-hidden mb-2">
      {badge && (
        <Badge className="absolute top-2 left-2 bg-[#00a3e0] hover:bg-[#00a3e0] text-[8px] uppercase font-bold rounded-none px-1">
          {badge}
        </Badge>
      )}
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute top-2 right-2 bg-white/10 rounded-full p-1">
         <div className="w-4 h-4 border border-white rounded-full opacity-50" />
      </div>
    </div>
    <div className="flex flex-col flex-grow">
      <h3 className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">{title}</h3>
      <p className="text-white font-bold text-sm mb-1">${price}</p>
      {rating && (
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-[#f47521] text-[#f47521]" />
          <span className="text-[10px] text-gray-400">{rating}</span>
        </div>
      )}
      <Button className="w-full bg-black border border-white text-white rounded-full text-[10px] font-bold h-9 hover:bg-white hover:text-black transition-colors uppercase tracking-tighter">
        Select Size
      </Button>
    </div>
  </div>
);

const HeroBanner = ({ bg, title, subtitle, cta }: any) => (
  <div className="relative w-full h-[220px] overflow-hidden">
    <img src={bg} className="w-full h-full object-cover" alt="Hero" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-center">
      <h2 className="text-white text-2xl font-black italic uppercase leading-none mb-2 max-w-[200px]">
        {title}
      </h2>
      <p className="text-gray-300 text-[10px] mb-4 max-w-[180px]">
        {subtitle}
      </p>
      <Button className="bg-[#f47521] text-white rounded-full w-fit px-6 font-bold text-xs uppercase">
        {cta}
      </Button>
    </div>
  </div>
);

// --- Main Page ---

export default function AnimeStore() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-[#f47521]">
      <TopNotice />
      <Header />

      <main className="pb-20">
        {/* Main Hero */}
        <HeroBanner 
          bg="https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800"
          title="The Defender who fights like a hero"
          subtitle="Argentine champion Lisandro 'The Butcher' Martinez channels anime power."
          cta="Shop Now"
        />

        {/* Horizontal Section: One Piece */}
        <section className="py-6 px-4">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-white text-xl font-bold">Shop One Piece</h2>
            </div>
            <a href="#" className="text-white text-xs font-bold underline decoration-[#f47521] underline-offset-4">Shop All</a>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            <ProductCard 
              title="One Piece - Devil Fruit Graphic Crew Sweatshirt"
              price="54.99"
              image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400"
              badge="Exclusive"
            />
            <ProductCard 
              title="One Piece - Monkey D. Luffy Straw Hat Crew T-Shirt"
              price="29.99"
              image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400"
              badge="Exclusive"
            />
            <ProductCard 
              title="One Piece - Luffy Funko POP! (Live Action)"
              price="14.99"
              image="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=400"
            />
             <ProductCard 
              title="One Piece - Sanji Variable Action Figure"
              price="74.99"
              image="https://images.unsplash.com/photo-1613371841083-20161ca71f8a?auto=format&fit=crop&q=80&w=400"
              rating="1.0"
            />
          </div>
        </section>

        {/* Promo Banner */}
        <div className="px-4 mb-8">
          <div className="bg-[#141519] rounded-sm p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="z-10 flex-1">
              <h3 className="text-[#f47521] font-black text-lg italic">New merch ahoy!</h3>
              <p className="text-white text-[10px] opacity-80 mb-3">Limited-edition ONE PIECE merch has washed ashore.</p>
              <Button size="sm" className="bg-[#f47521] text-white uppercase text-[10px] font-bold rounded-full">Shop Now</Button>
            </div>
            <div className="z-10 flex gap-2">
               <div className="w-16 h-20 bg-gray-800 rounded-sm rotate-3" />
               <div className="w-16 h-20 bg-gray-700 rounded-sm -rotate-3" />
            </div>
            <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Big Categories */}
        <section className="space-y-4 px-4">
          <div className="bg-[#f47521] h-[180px] rounded-sm relative overflow-hidden group cursor-pointer">
             <div className="absolute bottom-4 left-4 z-10">
                <h2 className="text-white text-3xl font-black italic uppercase leading-none">Figures</h2>
                <p className="text-black text-[10px] font-bold">Discover new anime figures and grow your collection.</p>
             </div>
             <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/10 skew-x-[-12deg] translate-x-12" />
          </div>

          <div className="bg-[#b388eb] h-[180px] rounded-sm relative overflow-hidden group cursor-pointer">
             <div className="absolute bottom-4 left-4 z-10">
                <h2 className="text-white text-3xl font-black italic uppercase leading-none">Blu-rays</h2>
                <p className="text-black text-[10px] font-bold">Grow your physical media collection.</p>
             </div>
             <div className="absolute right-4 bottom-4 w-32 h-40 bg-white/20 rounded shadow-2xl" />
          </div>
        </section>

        {/* Series Logos Grid */}
        <section className="py-10 px-4">
           <h2 className="text-white text-lg font-bold mb-6">Shop by Series</h2>
           <div className="grid grid-cols-3 gap-y-8 gap-x-4 grayscale opacity-70">
              {['Frieran', 'Dan Da Dan', 'Apothecary', 'Attack on Titan', 'Berserk', 'Naruto'].map((s) => (
                <div key={s} className="flex items-center justify-center h-8">
                   <span className="text-white font-black text-center text-[10px] leading-tight">{s}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Premium Section */}
        <section className="bg-white/5 py-10 px-6 mx-4 rounded-sm border border-white/10 text-center">
            <div className="flex justify-center mb-4">
               <div className="p-3 bg-white/10 rounded-full">
                  <Star className="text-[#f47521] w-8 h-8" />
               </div>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Premium Members Save More</h2>
            <p className="text-gray-400 text-xs mb-6">Enjoy up to 15% off select products and free shipping.</p>
            
            <div className="space-y-3 mb-8">
               {[
                 { p: '5%', label: 'Fans' },
                 { p: '10%', label: 'Mega Fans' },
                 { p: '15%', label: 'Ultimate Fans' }
               ].map((tier) => (
                 <div key={tier.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold text-xs">
                      {tier.p}
                    </div>
                    <span className="text-white text-xs font-medium text-left">{tier.label} get {tier.p} off select products.</span>
                 </div>
               ))}
            </div>

            <Button className="w-full bg-white text-black font-bold uppercase rounded-none h-12">Get Premium</Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 pt-10 pb-6 px-6">
        <div className="mb-10">
          <h3 className="text-white font-bold mb-4">Join our mailing list</h3>
          <p className="text-gray-400 text-xs mb-4">Be the first to get special offers & deals!</p>
          <div className="flex">
            <Input className="bg-white rounded-none h-12" placeholder="Email Address" />
            <Button className="bg-[#f47521] rounded-none h-12 uppercase font-black px-6">Subscribe</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[11px] text-gray-400">
           <div className="space-y-2">
              <h4 className="text-white font-bold uppercase mb-3">Shop by Series</h4>
              <p>Chainsaw Man</p>
              <p>One Piece</p>
              <p>Jujutsu Kaisen</p>
              <p>Solo Leveling</p>
           </div>
           <div className="space-y-2">
              <h4 className="text-white font-bold uppercase mb-3">About</h4>
              <p>About Us</p>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Help Center</p>
           </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
           <div className="flex gap-6">
              <Instagram className="text-white w-5 h-5" />
              <Twitter className="text-white w-5 h-5" />
              <Youtube className="text-white w-5 h-5" />
              <Facebook className="text-white w-5 h-5" />
           </div>
           <p className="text-gray-600 text-[10px]">Copyright © 2026, Crunchyroll LLC</p>
        </div>
      </footer>
    </div>
  );
}