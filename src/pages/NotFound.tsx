import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <SEO 
        title="Page Introuvable - ProMedias"
        description="Oups ! La page que vous recherchez semble avoir disparu. Retournez sur la boutique ProMedias pour vos besoins high-tech."
      />
      
      <div className="container max-w-2xl text-center space-y-12">
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[12rem] md:text-[18rem] font-headline font-black text-zinc-100 leading-none"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div
                animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 10, 0]
                }}
                transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="bg-white p-8 rounded-[2rem] shadow-2xl border border-zinc-50"
             >
                <Search size={64} className="text-primary" />
             </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter">Oups ! <span className="text-primary italic">Circuit coupé.</span></h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            La page que vous cherchez n'existe pas ou a été déplacée. <br className="hidden md:block" />
            Pas d'inquiétude, nos experts sont sur le coup.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link to="/">
            <Button size="xl" variant="outline" className="h-16 px-8 rounded-2xl group border-zinc-200">
              <Home className="mr-2 h-5 w-5" />
              Accueil
            </Button>
          </Link>
          <Link to="/shop">
            <Button size="xl" className="h-16 px-12 rounded-2xl group shadow-2xl shadow-primary/20 font-bold">
              Retour à la Boutique
              <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
