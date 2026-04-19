import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  PhoneCall,
  Menu,
  X,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { fetchSiteOptions, fetchContact, type SiteOptions, type ContactInfo } from "@/lib/woocommerce";

interface LayoutProps {
  children: React.ReactNode;
}

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.667 4.53-4.667 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [siteOptions, setSiteOptions] = useState<SiteOptions>({});
  const [facebookUrl, setFacebookUrl] = useState('');
  const [contact, setContact] = useState<ContactInfo>({});
  const location = useLocation();

  useEffect(() => {
    fetchSiteOptions().then(setSiteOptions);
    fetchContact().then(c => {
      setFacebookUrl(c.contact_facebook ?? '');
      setContact(c);
    });
  }, []);

  const logoSrc       = siteOptions.site_logo       || logo;
  const logoWhiteSrc  = siteOptions.site_logo_white || logo;

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes;

      if (day >= 1 && day <= 5) { // Mon - Fri
        setIsStoreOpen(currentTime >= 9 * 60 && currentTime < 18 * 60 + 30);
      } else if (day === 6) { // Sat
        setIsStoreOpen(currentTime >= 10 * 60 && currentTime < 17 * 60);
      } else { // Sun
        setIsStoreOpen(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Réparations", path: "/services" },
    { name: "Boutique", path: "/shop" },
    { name: "Diagnostics", path: "/diagnostic" },
    { name: "À Propos", path: "/about" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header
        ref={mobileMenuRef}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled ? "py-2" : "py-5"
        )}
      >
        <div className="container">
          <nav className={cn(
            "rounded-[2.5rem] px-8 h-20 flex items-center justify-between transition-all duration-500",
            isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg border border-white/20" : "bg-transparent"
          )}>
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4"
            >
              <img src={logoSrc} alt="Promedias Logo" className="h-12 md:h-16 w-auto object-contain" />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100">
                <span className={cn(
                    "w-2 h-2 rounded-full",
                    isStoreOpen ? "bg-green-500 animate-pulse" : "bg-zinc-300"
                )} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {isStoreOpen ? "Ouvert" : "Fermé"}
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 font-headline font-medium text-xs uppercase tracking-widest">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    "hover:text-primary transition-all duration-300 relative group",
                    location.pathname === link.path ? "text-primary font-bold" : "text-zinc-500"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                    location.pathname === link.path ? "w-full" : ""
                  )} />
                </Link>
              ))}
              <Link to="/diagnostic">
                <Button size="sm" className="font-bold tracking-widest uppercase text-[10px] px-6">
                  Diagnostic
                </Button>
              </Link>
            </div>

            <button 
              className={cn(
                "md:hidden transition-colors duration-500",
                isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border p-8 space-y-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-lg font-headline font-bold uppercase tracking-widest",
                  location.pathname === link.path ? "text-primary" : "text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </header>

      <main>
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white pt-32 pb-12 overflow-hidden relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <Link to="/" className="flex items-center">
                <img src={logoWhiteSrc} alt="Promedias Logo" className="h-12 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Le comptoir informatique de précision à Liège. Expertise, rapidité et transparence pour tous vos besoins technologiques.
              </p>
              <div className="flex gap-4">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary flex items-center justify-center transition-all bg-transparent"
                  >
                    <FacebookIcon size={20} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Services</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link to="/services" className="hover:text-primary transition-colors">Réparation GSM</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">Réparation PC & Mac</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">Données Perdues</Link></li>
                <li><Link to="/shop" className="hover:text-primary transition-colors">Vente reconditionné</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Horaires & Accès</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li className="flex flex-col gap-1">
                    {contact.contact_hours_weekdays && <span className="text-white font-bold">{contact.contact_hours_weekdays}</span>}
                    {contact.contact_hours_saturday && <span className="text-[10px] uppercase tracking-widest opacity-50">{contact.contact_hours_saturday}</span>}
                    {contact.contact_hours_sunday   && <span className="text-[10px] uppercase tracking-widest opacity-50">{contact.contact_hours_sunday}</span>}
                </li>
                <li className="flex items-start gap-2 pt-2 border-t border-zinc-900">
                    <MapPin size={14} className="text-primary mt-1 shrink-0" />
                    <span>Rue St Léonard 141, 4000 Liège</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Newsletter</h5>
              <p className="text-zinc-500 text-sm">Recevez nos offres exclusives sur le reconditionné.</p>
              <div className="flex border-b border-zinc-800 pb-2">
                <input type="email" placeholder="Votre email" className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" />
                <Button variant="ghost" className="text-primary font-bold text-[10px] uppercase tracking-widest p-0 h-auto">S'abonner</Button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs">
            <p>© 2026 PROMEDIAS Liège — Le Comptoir Informatique de Précision.</p>
            <div className="flex gap-6 uppercase font-bold tracking-widest text-[10px]">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Bancontact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <a href="tel:+32466058793" className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl z-40 hover:scale-110 active:scale-95 transition-all bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center text-white">
        <PhoneCall size={28} />
      </a>
    </div>
  );
};

export default Layout;
