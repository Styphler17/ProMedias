import { 
  ShieldCheck, 
  Star, 
  Award, 
  Zap, 
  Smartphone, 
  Laptop, 
  Monitor, 
  Package, 
  CircleDollarSign, 
  Printer, 
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import ThreeHero from "@/components/ThreeHero";

const containerVariants = {
// ... existing variants
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const Home = () => {
  return (
    <>
      <SEO 
        title="Expert en Réparation Informatique à Liège"
        description="PROMEDIAS redonne vie à vos smartphones, laptops et Mac au cœur de Liège. Micro-soudure de précision, pièces premium et boutique d'appareils reconditionnés garantis."
      />
      {/* Hero Section */}
      <section id="hero" className="relative pt-40 pb-20 overflow-hidden">
        <ThreeHero />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10" 
        />
        
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-widest uppercase mx-auto lg:mx-0">
              <ShieldCheck size={14} />
              Expertise Certifiée à Liège
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="font-headline tracking-tighter">
              PROMEDIAS — <br />
              <span className="text-primary italic">Votre Comptoir</span><br />
              Informatique
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-xl font-light leading-relaxed mx-auto lg:mx-0">
              De la micro-soudure de précision à la revente d'équipements reconditionnés. Nous redonnons vie à votre technologie avec la rigueur d'un atelier d'horlogerie.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link to="/diagnostic">
                <Button size="xl" className="text-lg font-bold h-14 w-full sm:w-auto hover:scale-105 transition-transform duration-300">
                  Demander un devis
                </Button>
              </Link>
              <Link to="/services">
                <Button size="xl" variant="outline" className="text-lg font-bold h-14 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 transition-all border-none hover:translate-x-1 duration-300">
                  Nos services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-border/50">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUbrwXoYdvgWKRP1ajippa5w364mhCEydLT3BIQRIchZ7a847uHJGZIB0fQ0ons8aiAYlqNFOdNqdVKNHKCHlP-j0gPG6THxZUUDQsY1GYnpHidJsdwERSsovr7nplsac1NK26FkRfLC6HWiaMWWgVTxpG27w4ePSwOhJbT9u12ohjAgUTrQVaXtVwjpiLjGkLofOYlqtPXTXY4W66boTZ6LnpzG3YztpL3FDPTOUOUn1MQxQyRzydEfz0B2B1jXqXtvyMPMAm_GU" 
                alt="Workshop" 
                className="w-full h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <span className="font-headline font-bold text-xl">4.9/5</span>
                    <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold ml-2">Google Reviews</span>
                  </div>
                </div>
              </div>
            </div>
            <motion.div 
              animate={{ rotate: [1, -2, 1], x: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" 
            />
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Award, title: "10+ ans", desc: "D'expérience métier", color: "text-primary" },
              { icon: Star, title: "Note 4.9/5", desc: "Avis clients vérifiés", color: "text-secondary" },
              { icon: Zap, title: "Rapide & Fiable", desc: "Réparations express", color: "text-orange-500" }
            ].map((badge, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex items-center gap-6 p-8 bg-card rounded-2xl shadow-sm border border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className={cn("w-16 h-16 rounded-xl bg-current/5 flex items-center justify-center", badge.color)}>
                  <badge.icon size={36} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl">{badge.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 border-y border-zinc-100 bg-white/50 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-3 md:grid-cols-7 gap-8 md:gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {["APPLE", "SAMSUNG", "HUAWEI", "SONY", "ASUS", "HP", "DELL"].map((brand) => (
              <span key={brand} className="font-headline font-black text-xl md:text-2xl tracking-[0.3em] text-center">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Context Section */}
      <section id="services" className="py-24">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-widest text-xs uppercase">Nos Compétences</span>
              <h2 className="font-headline tracking-tight mt-4">
                Un service complet pour votre <br /><span className="text-zinc-400">écosystème numérique.</span>
              </h2>
            </div>
            <Link to="/services" className="text-primary font-bold flex items-center gap-2 group transition-all">
              Voir tous nos tarifs 
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            <motion.article variants={itemVariants} className="md:col-span-3">
              <Card className="bg-muted border-none p-4 group hover:bg-muted/80 transition-all flex flex-col justify-between min-h-[320px] rounded-2xl overflow-hidden cursor-pointer">
                <div className="flex justify-between items-start pt-4 pl-4">
                  <Smartphone size={48} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                    <ArrowRight size={20} className="text-primary" />
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl font-headline mb-2">Réparation GSM</CardTitle>
                  <CardDescription className="text-base text-muted-foreground font-medium">
                    Écrans, batteries et connecteurs de charge. iPhone, Samsung, Xiaomi et plus.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.article>

            <motion.article variants={itemVariants} className="md:col-span-3">
              <Card className="bg-foreground text-background border-none p-4 group flex flex-col justify-between min-h-[320px] rounded-2xl overflow-hidden cursor-pointer">
                <div className="flex justify-between items-start pt-4 pl-4">
                  <Laptop size={48} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                    <ArrowRight size={20} className="text-primary" />
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl font-headline mb-2">Réparation PC/Laptop</CardTitle>
                  <CardDescription className="text-base text-zinc-400 font-medium">
                    Optimisation système, remplacement clavier, nettoyage interne et upgrade SSD.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.article>

            <motion.article variants={itemVariants} className="md:col-span-2">
              <Card className="bg-muted/30 border-border/50 p-4 group flex flex-col justify-between min-h-[280px] rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                <Monitor size={40} className="text-secondary ml-4 mt-4 group-hover:rotate-6 transition-transform" />
                <CardHeader className="p-4">
                  <CardTitle className="text-xl font-headline mb-2">Dépannage Mac</CardTitle>
                  <CardDescription>Spécialiste Apple: MacBook, iMac et Mac Mini.</CardDescription>
                </CardHeader>
              </Card>
            </motion.article>

            <motion.article variants={itemVariants} className="md:col-span-2">
              <Card className="bg-primary text-white border-none p-4 group flex flex-col justify-between min-h-[280px] rounded-2xl overflow-hidden cursor-pointer hover:brightness-110 transition-all">
                <Package size={40} className="ml-4 mt-4 group-hover:bounce transition-all" />
                <CardHeader className="p-4">
                  <CardTitle className="text-xl font-headline mb-2">Vente Reconditionnée</CardTitle>
                  <CardDescription className="text-white/80">Appareils testés en 50 points de contrôle avec garantie 1 an.</CardDescription>
                </CardHeader>
              </Card>
            </motion.article>

            <motion.article variants={itemVariants} className="md:col-span-1">
              <Card className="bg-muted border-none p-4 group flex flex-col justify-between min-h-[280px] items-start rounded-2xl hover:bg-muted/80 transition-all cursor-pointer">
                 <CircleDollarSign size={40} className="ml-4 mt-4 group-hover:scale-110 transition-transform" />
                 <CardHeader className="p-4">
                  <CardTitle className="text-lg font-headline mb-2">Achat / Reprise</CardTitle>
                 </CardHeader>
              </Card>
            </motion.article>

            <motion.article variants={itemVariants} className="md:col-span-1">
              <a href="mailto:promedias.liege@gmail.com?subject=Impression documents ProMedias">
                <Card className="bg-background border-border/50 p-4 group flex flex-col justify-between min-h-[280px] items-start rounded-2xl hover:border-primary transition-all cursor-pointer">
                   <Printer size={40} className="ml-4 mt-4 text-primary group-hover:scale-110 transition-transform" />
                   <CardHeader className="p-4">
                    <CardTitle className="text-lg font-headline mb-2">Impression</CardTitle>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">promedias.liege@gmail.com</p>
                   </CardHeader>
                </Card>
              </a>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* The Journey / How it Works */}
      <section className="py-32 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
        <div className="container">
          <div className="text-center mb-24">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase font-headline">Simplicité & Rigueur</span>
            <h2 className="text-4xl md:text-6xl font-headline font-bold mt-4 tracking-tighter">Votre réparation en 3 étapes.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 hidden md:block -translate-y-1/2" />
            {[
              { step: "01", title: "Dépôt Direct", desc: "Passez sans rendez-vous au 141 Rue St-Léonard pour une prise en charge immédiate." },
              { step: "02", title: "Diagnostic Scan", desc: "Nos experts analysent les circuits sous 24h et vous proposent un devis transparent." },
              { step: "03", title: "Récupération", desc: "Repartez avec un matériel ressuscité, testé et garanti 12 mois." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center font-headline font-black text-xl mb-8 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-zinc-50 overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase font-headline">La Voix de nos Clients</span>
              <h2 className="text-4xl md:text-6xl font-headline font-bold mt-4 tracking-tighter italic">Approuvé par <span className="text-primary italic">Liège.</span></h2>
            </div>
            <div className="flex gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-zinc-100">
                <div className="text-right">
                    <p className="font-bold text-xl">4.9/5</p>
                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Sur Google Reviews</p>
                </div>
                <div className="flex gap-1 text-primary">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                text: "Service exceptionnel ! Mon iPhone 13 Pro était complètement brisé, il a été réparé en 45 minutes chrono avec des pièces de qualité. Merci ProMedias !",
                author: "Jean Dupont",
                role: "Client Fidèle (Liège)",
                initials: "JD"
              },
              { 
                text: "J'ai acheté un MacBook reconditionné ici il y a 6 mois. L'état est impeccable et les conseils techniques étaient excellents. Une adresse incontournable.",
                author: "Marie Leclerc",
                role: "Graphiste (Angleur)",
                initials: "ML"
              },
              { 
                text: "Expertise incroyable en micro-soudure. Là où d'autres m'ont dit que ma carte mère était morte, ProMedias l'a sauvée. Sauvetage réussi !",
                author: "Thomas Berger",
                role: "Photographe (Grivegnée)",
                initials: "TB"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="space-y-6">
                    <div className="flex gap-1 text-primary">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                    </div>
                    <p className="text-lg font-light leading-relaxed italic text-zinc-600">"{testimonial.text}"</p>
                </div>
                <div className="mt-10 flex items-center gap-4 pt-6 border-t border-zinc-50">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
                        {testimonial.initials}
                    </div>
                    <div>
                        <p className="font-bold text-sm">{testimonial.author}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{testimonial.role}</p>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-black/10 -skew-x-12 translate-x-1/2" />
        <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="font-headline font-bold mb-6">Prêt à redonner vie à votre appareil ?</h2>
            <p className="text-xl text-white/80 font-light">Nos experts vous attendent en boutique pour un diagnostic gratuit.</p>
          </div>
          <Link to="/diagnostic">
            <Button size="xl" className="bg-white text-primary hover:bg-white/90 text-xl font-bold h-16 px-12 rounded-full shadow-2xl">
              Commencer le Diagnostic
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="container max-w-4xl">
           <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">Questions Fréquentes</span>
            <h2 className="font-headline tracking-tight mt-4">Tout ce qu'il faut savoir</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-card border px-6 rounded-lg">
              <AccordionTrigger className="text-lg font-headline font-bold py-6 text-left">Combien de temps prend une réparation d'écran ?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6">
                La plupart des réparations d'écran (iPhone, Samsung) sont effectuées en moins de 60 minutes dans notre atelier de Liège.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-card border px-6 rounded-lg">
              <AccordionTrigger className="text-lg font-headline font-bold py-6 text-left">Vos produits reconditionnés sont-ils garantis ?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6">
                Oui, tous nos appareils reconditionnés bénéficient d'une garantie de 12 mois et ont été testés sur plus de 50 points de contrôle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-card border px-6 rounded-lg">
              <AccordionTrigger className="text-lg font-headline font-bold py-6 text-left">Faut-il prendre rendez-vous pour un diagnostic ?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6">
                Le diagnostic est sans rendez-vous. Passez simplement nous voir au 141 Rue St-Léonard pour une expertise immédiate.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default Home;
