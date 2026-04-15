import { motion } from "motion/react";
import { Coffee, Laptop, MapPin, Phone, Instagram, Facebook, Menu as MenuIcon, X, LogIn, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth, db, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthProvider, useAuth } from "./AuthContext";
import { AdminPanel } from "./AdminPanel";

// --- Components ---

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Menu", href: "#menu" },
    { name: "About", href: "#about" },
    { name: "Location", href: "#contact" },
  ];

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-6 md:px-10 bg-brown-900/60 backdrop-blur-xl rounded-2xl mb-4 border border-accent/20">
      <div className="font-serif text-2xl font-bold text-accent tracking-tight">
        Café Rodina.
      </div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-[13px] font-semibold uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            {link.name}
          </a>
        ))}
        
        {isAdmin && (
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="text-accent hover:text-accent/80 transition-colors flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest"
          >
            <Settings size={18} />
            Admin
          </button>
        )}

        {user ? (
          <button 
            onClick={() => signOut(auth)}
            className="text-foreground/60 hover:text-foreground transition-colors text-[11px] font-bold uppercase tracking-widest"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="text-accent/60 hover:text-accent transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest"
          >
            <LogIn size={16} />
            Admin Login
          </button>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:hidden">
        {isAdmin && (
          <button onClick={() => setShowAdminPanel(true)} className="text-accent">
            <Settings size={20} />
          </button>
        )}
        <button className="text-accent" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brown-900/90 backdrop-blur-xl absolute top-20 left-4 right-4 z-50 shadow-bento rounded-2xl border border-accent/20 py-6 px-6 flex flex-col space-y-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-widest text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {!user && (
            <button onClick={handleLogin} className="text-accent text-sm font-bold uppercase tracking-widest text-left">
              Admin Login
            </button>
          )}
          {user && (
            <button onClick={() => signOut(auth)} className="text-foreground/60 text-sm font-bold uppercase tracking-widest text-left">
              Logout
            </button>
          )}
        </motion.div>
      )}

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </header>
  );
};

const HeroCard = () => {
  return (
    <Card className="hero-card col-span-1 md:col-span-2 row-span-1 bg-brown-900/70 backdrop-blur-xl border border-accent/30 rounded-bento shadow-bento overflow-hidden relative flex flex-col justify-center p-8 md:p-12 min-h-[400px] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.2),transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent/80 font-bold mb-4">
          Welcome to Salé
        </div>
        <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-none text-foreground">
          Coffee. Comfort.<br />Creativity.
        </h1>
        <p className="text-xl text-accent font-light mb-8">
          Your premium workspace in the heart of the city.
        </p>
        <Button className="bg-accent hover:bg-accent/90 text-brown-900 font-bold text-sm uppercase tracking-widest rounded-full px-8 py-6 h-auto transition-transform hover:scale-105">
          Visit Us
        </Button>
      </div>
    </Card>
  );
};

const GalleryCard = () => {
  return (
    <Card className="gallery-card col-span-1 row-span-1 bg-brown-900/50 backdrop-blur-md border border-accent/20 rounded-bento shadow-bento overflow-hidden relative min-h-[300px]">
      <img
        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800"
        alt="Café Interior"
        className="w-full h-full object-cover opacity-70"
        referrerPolicy="no-referrer"
      />
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
    <Card className="menu-card col-span-1 row-span-1 bg-brown-900/60 backdrop-blur-xl border border-accent/20 rounded-bento shadow-bento p-8 text-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-6">
          Signature Menu
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.name} className="flex justify-between items-center border-b border-dashed border-accent/20 pb-2">
              <span className="font-semibold text-foreground">{item.name}</span>
              <span className="font-serif text-accent">{item.price}</span>
            </div>
          ))}
        </div>
        <Button variant="link" className="text-accent p-0 h-auto mt-6 font-bold text-xs uppercase tracking-widest hover:no-underline hover:text-accent/80">
          Full Menu →
        </Button>
      </div>
    </Card>
  );
};

const ContactCard = () => {
  return (
    <Card className="contact-card col-span-1 row-span-1 bg-brown-900/60 backdrop-blur-xl border border-accent/20 rounded-bento shadow-bento p-8 flex flex-col justify-between text-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-6">
          Find Us
        </div>
        <p className="text-sm leading-relaxed text-foreground/80 mb-4">
          X7W8+VXC, Av. Atlas,<br />Salé, Morocco
        </p>
        <p className="text-lg font-bold text-accent">
          08 08 63 18 60
        </p>
      </div>
      <div className="mt-6 relative z-10">
        <a 
          href="https://www.google.com/maps/search/?api=1&query=X7W8%2BVXC%2C+Av.+Atlas%2C+Salé" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-accent font-bold uppercase tracking-widest no-underline hover:underline"
        >
          GET DIRECTIONS →
        </a>
      </div>
    </Card>
  );
};

const VibeCard = () => {
  const reviews = [
    {
      author: "Amine Fritry",
      text: "The perfect place to work: calm, inspiring, and delicious! A huge thank you to the servers for their warm welcome and exceptional service. A café where work becomes a real pleasure!",
      stats: "3 reviews • 2 years ago"
    },
    {
      author: "Maria Ghanjaoui",
      text: "A very nice cafe and pleasant service, I highly recommend it.",
      stats: "Local Guide • 14 reviews • 3 years ago"
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="vibe-card col-span-1 row-span-1 bg-brown-900/70 backdrop-blur-xl border border-accent/30 rounded-bento shadow-bento p-8 flex flex-col justify-center text-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-4">
          Google Maps Reviews
        </div>
        <div className="text-3xl font-extrabold text-accent mb-1">
          4.0 ★
        </div>
        <div className="text-xs text-foreground/60 mb-4">
          44 Verified Reviews
        </div>
        
        <motion.div
          key={currentReview}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[120px]"
        >
          <p className="text-[11px] text-foreground/90 italic leading-relaxed mb-4">
            "{reviews[currentReview].text}"
          </p>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-accent">{reviews[currentReview].author}</span>
            <span className="text-[9px] text-accent/40">{reviews[currentReview].stats}</span>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mt-6">
          <Badge className="bg-accent text-brown-900 border-none rounded-sm text-[10px] font-semibold uppercase px-3 py-1">
            Study Friendly
          </Badge>
          <Badge className="bg-accent text-brown-900 border-none rounded-sm text-[10px] font-semibold uppercase px-3 py-1">
            High-Speed WiFi
          </Badge>
        </div>
      </div>
    </Card>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-12">
      <Card className="bg-brown-900/80 backdrop-blur-2xl border border-accent/20 rounded-bento shadow-bento p-8 md:p-12 relative overflow-hidden text-foreground">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=1000')] bg-cover" />
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-4">
              Our Story
            </div>
            <h2 className="font-serif text-4xl text-foreground mb-6">A Space Where Ideas Brew</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Café Rodina was born from a simple vision: to create a bridge between the traditional Moroccan café culture and the modern needs of students and freelancers in Salé.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-accent text-sm mb-2">Artisanal Coffee</h4>
                <p className="text-xs text-foreground/60">Carefully sourced beans, roasted to perfection.</p>
              </div>
              <div>
                <h4 className="font-bold text-accent text-sm mb-2">Coworking Ready</h4>
                <p className="text-xs text-foreground/60">High-speed Wi-Fi and plenty of outlets.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-video md:aspect-square border border-accent/20">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000"
              alt="Café Vibe"
              className="w-full h-full object-cover opacity-80"
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
    <footer className="py-12 text-center bg-brown-900/80 backdrop-blur-xl rounded-t-3xl mt-12 border-t border-accent/20">
      <div className="font-serif text-xl font-bold text-accent mb-6">Café Rodina.</div>
      <p className="text-xs text-accent/40 uppercase tracking-widest">
        © {new Date().getFullYear()} Café Rodina. All rights reserved.
      </p>
    </footer>
  );
};

// --- Main App ---

const AppContent = () => {
  const [bgUrl, setBgUrl] = useState('https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=2000');

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().backgroundImageUrl) {
        setBgUrl(docSnap.data().backgroundImageUrl);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div 
      className="min-h-screen font-bento selection:bg-accent/30 p-4 md:p-6 lg:p-10 flex flex-col gap-6 max-w-[1200px] mx-auto transition-all duration-1000"
      style={{
        backgroundImage: `linear-gradient(rgba(45, 36, 30, 0.3), rgba(45, 36, 30, 0.3)), url('${bgUrl}')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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

        {/* About Section */}
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
