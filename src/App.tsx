import { motion } from "motion/react";
import { Coffee, Laptop, MapPin, Phone, Instagram, Facebook, Menu as MenuIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Components ---

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Menu", href: "#menu" },
    { name: "About", href: "#about" },
    { name: "Location", href: "#contact" },
  ];

  return (
    <header className="flex justify-between items-center px-4 py-6 md:px-10">
      <div className="font-serif text-2xl font-bold text-brown tracking-tight">
        Café Rodina.
      </div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-[13px] font-semibold uppercase tracking-widest text-grey hover:text-accent transition-colors"
          >
            {link.name}
          </a>
        ))}
      </nav>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-dark" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white absolute top-20 left-4 right-4 z-50 shadow-bento rounded-2xl border border-black/5 py-6 px-6 flex flex-col space-y-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-widest text-grey"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
};

const HeroCard = () => {
  return (
    <Card className="hero-card col-span-1 md:col-span-2 row-span-1 bg-dark text-white border-none rounded-bento shadow-bento overflow-hidden relative flex flex-col justify-center p-8 md:p-12 min-h-[400px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-white/50 font-bold mb-4">
          Welcome to Salé
        </div>
        <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-none">
          Coffee. Comfort.<br />Creativity.
        </h1>
        <p className="text-xl text-accent font-light mb-8">
          Your premium workspace in the heart of the city.
        </p>
        <Button className="bg-accent hover:bg-accent/90 text-dark font-bold text-sm uppercase tracking-widest rounded-full px-8 py-6 h-auto transition-transform hover:scale-105">
          Visit Us
        </Button>
      </div>
    </Card>
  );
};

const GalleryCard = () => {
  return (
    <Card className="gallery-card col-span-1 row-span-1 bg-[#E5E7EB] border-none rounded-bento shadow-bento overflow-hidden relative min-h-[300px]">
      <img
        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800"
        alt="Café Interior"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-semibold text-dark">
        Instagram Aesthetic ✨
      </div>
    </Card>
  );
};

const MenuCard = () => {
  const items = [
    { name: "Espresso Gold", price: "18 MAD" },
    { name: "Moroccan Mint Special", price: "15 MAD" },
    { name: "Avocado Toast", price: "45 MAD" },
    { name: "Cold Brew", price: "28 MAD" },
    { name: "Croissant aux Amandes", price: "22 MAD" },
  ];

  return (
    <Card className="menu-card col-span-1 row-span-1 bg-white border-none rounded-bento shadow-bento p-8">
      <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-6">
        Signature Menu
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
            <span className="font-semibold text-dark">{item.name}</span>
            <span className="font-serif text-brown">{item.price}</span>
          </div>
        ))}
      </div>
      <Button variant="link" className="text-accent p-0 h-auto mt-6 font-bold text-xs uppercase tracking-widest">
        Full Menu →
      </Button>
    </Card>
  );
};

const ContactCard = () => {
  return (
    <Card className="contact-card col-span-1 row-span-1 bg-white border-none rounded-bento shadow-bento p-8 flex flex-col justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-6">
          Find Us
        </div>
        <p className="text-sm leading-relaxed text-grey mb-4">
          X7W8+VXC, Av. Atlas,<br />Salé, Morocco
        </p>
        <p className="text-lg font-bold text-brown">
          08 08 63 18 60
        </p>
      </div>
      <div className="mt-6">
        <a href="#" className="text-xs text-accent font-bold uppercase tracking-widest no-underline hover:underline">
          Get Directions →
        </a>
      </div>
    </Card>
  );
};

const VibeCard = () => {
  return (
    <Card className="vibe-card col-span-1 row-span-1 bg-gold-soft border-2 border-accent rounded-bento shadow-bento p-8 flex flex-col justify-center">
      <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-4">
        The Vibe
      </div>
      <div className="text-3xl font-extrabold text-brown mb-1">
        4.0 ★
      </div>
      <div className="text-xs text-grey mb-4">
        44 Verified Reviews
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-brown text-white border-none rounded-sm text-[10px] font-semibold uppercase px-3 py-1">
          Study Friendly
        </Badge>
        <Badge className="bg-brown text-white border-none rounded-sm text-[10px] font-semibold uppercase px-3 py-1">
          High-Speed WiFi
        </Badge>
      </div>
      <p className="text-[11px] text-brown italic leading-relaxed">
        "Best place to work and enjoy a latte in Salé."
      </p>
    </Card>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-12">
      <Card className="bg-white border-none rounded-bento shadow-bento p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-4">
              Our Story
            </div>
            <h2 className="font-serif text-4xl text-dark mb-6">A Space Where Ideas Brew</h2>
            <p className="text-grey leading-relaxed mb-6">
              Café Rodina was born from a simple vision: to create a bridge between the traditional Moroccan café culture and the modern needs of students and freelancers in Salé.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-brown text-sm mb-2">Artisanal Coffee</h4>
                <p className="text-xs text-grey">Carefully sourced beans, roasted to perfection.</p>
              </div>
              <div>
                <h4 className="font-bold text-brown text-sm mb-2">Coworking Ready</h4>
                <p className="text-xs text-grey">High-speed Wi-Fi and plenty of outlets.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-video md:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000"
              alt="Café Vibe"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </Card>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 text-center">
      <div className="font-serif text-xl font-bold text-brown mb-6">Café Rodina.</div>
      <p className="text-xs text-grey uppercase tracking-widest">
        © {new Date().getFullYear()} Café Rodina. All rights reserved.
      </p>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-bg font-bento selection:bg-accent/30 p-4 md:p-6 lg:p-10 flex flex-col gap-6 max-w-[1200px] mx-auto">
      <Navbar />
      
      <main className="flex-grow flex flex-col gap-6">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HeroCard />
          <GalleryCard />
          <MenuCard />
          <ContactCard />
          <VibeCard />
        </div>

        {/* About Section (Preserved) */}
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
