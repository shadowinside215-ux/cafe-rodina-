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
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { AdminPanel } from "./AdminPanel";

// --- Components ---

const Navbar = ({ logoUrl, showAdminPanel, setShowAdminPanel }: { logoUrl?: string, showAdminPanel: boolean, setShowAdminPanel: (show: boolean) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const navLinks = [
    { name: t('home'), href: "#" },
    { name: t('menu'), href: "#menu" },
    { name: t('about'), href: "#about" },
    { name: t('location'), href: "https://www.google.com/maps/search/?api=1&query=X7W8%2BVXC%2C+Av.+Atlas%2C+Salé", external: true },
  ];

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="flex justify-between items-center px-4 py-6 md:px-10 bg-brown-900/60 backdrop-blur-xl rounded-2xl mb-4 border border-accent/20 sticky top-4 z-[60]">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-16 h-16 rounded-full border border-accent/30 overflow-hidden bg-brown-800 flex items-center justify-center shrink-0 transition-transform cursor-pointer hover:scale-105 active:scale-95"
          title={t('home')}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Coffee className="text-accent" size={32} />
          )}
        </button>
        <div className="font-serif text-2xl font-bold text-accent tracking-tight">
          Café Rodina.
        </div>
      </div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8">
        <div className="flex items-center gap-2 mr-4 border-r border-accent/20 pr-4">
          {(['en', 'fr', 'ar'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[10px] font-bold uppercase transition-colors ${language === lang ? 'text-accent' : 'text-foreground/40 hover:text-foreground'}`}
            >
              {lang}
            </button>
          ))}
        </div>

        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-[13px] font-semibold uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            {link.name}
          </a>
        ))}
        
        {user && (
          <button 
            onClick={() => signOut(auth)}
            className="text-foreground/60 hover:text-foreground transition-colors text-[11px] font-bold uppercase tracking-widest"
          >
            {t('logout')}
          </button>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:hidden">
        <div className="flex items-center gap-2">
          {(['en', 'fr', 'ar'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[10px] font-bold uppercase ${language === lang ? 'text-accent' : 'text-foreground/40'}`}
            >
              {lang}
            </button>
          ))}
        </div>
        {/* Mobile Menu Toggle Hidden as requested */}
        {/* <button className="text-accent z-[70]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={32} /> : <MenuIcon size={32} />}
        </button> */}
      </div>

      {/* Full Screen Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
        >
          {/* Close Button */}
          <button 
            className="absolute top-8 right-8 text-accent hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={40} />
          </button>

          <div className="flex flex-col items-center space-y-10 w-full">
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="text-4xl font-serif font-bold text-accent hover:text-foreground transition-all tracking-wide text-center uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
            
            <div className="h-px w-32 bg-accent/30 my-2" />

            {user && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  signOut(auth);
                  setIsMobileMenuOpen(false);
                }} 
                className="text-foreground/60 text-base font-bold uppercase tracking-[6px] hover:text-foreground transition-colors"
              >
                {t('logout')}
              </motion.button>
            )}
          </div>

          <div className="absolute bottom-16 text-center">
            <div className="font-serif text-2xl font-bold text-accent/30 mb-2">Café Rodina.</div>
            <p className="text-xs text-accent/20 uppercase tracking-[4px]">Salé, Morocco</p>
          </div>
        </motion.div>
      )}

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </header>
  );
};

const HeroCard = () => {
  const { t } = useLanguage();
  return (
    <Card id="home" className="hero-card col-span-1 md:col-span-2 row-span-1 bg-brown-900/70 backdrop-blur-xl border border-accent/30 rounded-bento shadow-bento overflow-hidden relative flex flex-col justify-center p-8 md:p-12 min-h-[400px] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.2),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent/80 font-bold mb-4">
          {t('welcome')}
        </div>
        <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-none text-foreground">
          {t('heroTitle')}
        </h1>
        <p className="text-xl text-accent font-light mb-8">
          {t('heroSub')}
        </p>
        <a 
          href="https://www.google.com/maps/search/?api=1&query=X7W8%2BVXC%2C+Av.+Atlas%2C+Salé" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button className="bg-accent hover:bg-accent/90 text-brown-900 font-bold text-sm uppercase tracking-widest rounded-full px-8 py-6 h-auto transition-transform hover:scale-105">
            {t('visitUs')}
          </Button>
        </a>
      </div>
    </Card>
  );
};

const GalleryCard = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Card className="gallery-card col-span-1 row-span-1 bg-brown-900/50 backdrop-blur-md border border-accent/20 rounded-bento shadow-bento overflow-hidden relative min-h-[300px]">
      <img
        src={imageUrl}
        alt="Café Interior"
        className="w-full h-full object-cover opacity-70"
        referrerPolicy="no-referrer"
      />
    </Card>
  );
};

const MenuCard = () => {
  const { t } = useLanguage();
  const items = [
    { name: "Espresso Gold", price: "18 MAD" },
    { name: "Moroccan Mint Special", price: "15 MAD" },
    { name: "Avocado Toast", price: "45 MAD" },
    { name: "Cold Brew", price: "28 MAD" },
    { name: "Croissant aux Amandes", price: "22 MAD" },
  ];

  return (
    <Card id="menu" className="menu-card col-span-1 row-span-1 bg-brown-900/60 backdrop-blur-xl border border-accent/20 rounded-bento shadow-bento p-8 text-foreground relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-6">
          {t('signatureMenu')}
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
          {t('fullMenu')} →
        </Button>
      </div>
    </Card>
  );
};

const ContactCard = () => {
  const { t } = useLanguage();
  return (
    <Card id="contact" className="contact-card col-span-1 row-span-1 bg-brown-900/60 backdrop-blur-xl border border-accent/20 rounded-bento shadow-bento p-8 flex flex-col justify-between text-foreground relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-6">
          {t('findUs')}
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
          {t('getDirections')} →
        </a>
      </div>
    </Card>
  );
};

const VibeCard = () => {
  const { t } = useLanguage();
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
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-4">
          {t('reviewsTitle')}
        </div>
        <div className="text-3xl font-extrabold text-accent mb-1">
          4.0 ★
        </div>
        <div className="text-xs text-foreground/60 mb-4">
          44 {t('verifiedReviews')}
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
            {t('studyFriendly')}
          </Badge>
          <Badge className="bg-accent text-brown-900 border-none rounded-sm text-[10px] font-semibold uppercase px-3 py-1">
            {t('highSpeedWifi')}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

const AboutSection = ({ imageUrl }: { imageUrl: string }) => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-12">
      <Card className="bg-brown-900/80 backdrop-blur-2xl border border-accent/20 rounded-bento shadow-bento p-8 md:p-12 relative overflow-hidden text-foreground">
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-accent font-bold mb-4">
              {t('ourStory')}
            </div>
            <h2 className="font-serif text-4xl text-foreground mb-6">{t('aboutTitle')}</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              {t('aboutText')}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-accent text-sm mb-2">{t('artisanalCoffee')}</h4>
                <p className="text-xs text-foreground/60">{t('coffeeDesc')}</p>
              </div>
              <div>
                <h4 className="font-bold text-accent text-sm mb-2">{t('coworkingReady')}</h4>
                <p className="text-xs text-foreground/60">{t('coworkingDesc')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square border border-accent/20">
            <img
              src={imageUrl}
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

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => {
  const { t } = useLanguage();
  const { isAdmin, user } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <footer className="py-12 text-center bg-brown-900/80 backdrop-blur-xl rounded-t-3xl mt-12 border-t border-accent/20">
      <div className="font-serif text-xl font-bold text-accent mb-6">Café Rodina.</div>
      <p className="text-xs text-accent/40 uppercase tracking-widest mb-4">
        © {new Date().getFullYear()} Café Rodina. {t('allRights')}
      </p>
      
      {/* Hidden Admin Trigger */}
      <div className="mt-4 flex justify-center opacity-10 hover:opacity-100 transition-opacity">
        {isAdmin ? (
          <button onClick={onAdminClick} className="text-[10px] text-accent uppercase tracking-widest">
            {t('admin')}
          </button>
        ) : !user ? (
          <button onClick={handleLogin} className="text-[10px] text-accent uppercase tracking-widest">
            .
          </button>
        ) : null}
      </div>
    </footer>
  );
};

// --- Main App ---

const AppContent = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [settings, setSettings] = useState({
    backgroundImageUrl: 'https://images.unsplash.com/photo-1590059235658-f72fd2d6d282?auto=format&fit=crop&q=80&w=2000',
    galleryImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    aboutImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000',
    logoImageUrl: ''
  });

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(prev => ({
          backgroundImageUrl: data.backgroundImageUrl || prev.backgroundImageUrl,
          galleryImageUrl: data.galleryImageUrl || prev.galleryImageUrl,
          aboutImageUrl: data.aboutImageUrl || prev.aboutImageUrl,
          logoImageUrl: data.logoImageUrl || prev.logoImageUrl
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen font-bento selection:bg-accent/30 relative">
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-[-1] transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(rgba(45, 36, 30, 0.4), rgba(45, 36, 30, 0.4)), url('${settings.backgroundImageUrl}')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="p-4 md:p-6 lg:p-10 flex flex-col gap-6 max-w-[1200px] mx-auto">
        <Navbar 
          logoUrl={settings.logoImageUrl} 
          showAdminPanel={showAdminPanel} 
          setShowAdminPanel={setShowAdminPanel} 
        />
        
        <main className="flex-grow flex flex-col gap-6">
          {/* Bento Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HeroCard />
            <GalleryCard imageUrl={settings.galleryImageUrl} />
            <MenuCard />
            <ContactCard />
            <VibeCard />
          </div>

          {/* About Section */}
          <AboutSection imageUrl={settings.aboutImageUrl} />
        </main>

        <Footer onAdminClick={() => setShowAdminPanel(true)} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
