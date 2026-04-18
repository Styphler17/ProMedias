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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { ScrollSequence } from "@/components/ScrollSequence";
import { fetchSiteOptions, type SiteOptions } from "@/lib/woocommerce";
import AnnouncementsSlider from "@/components/AnnouncementsSlider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";

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
  const [siteOptions, setSiteOptions] = useState<SiteOptions>({});

  useEffect(() => {
    fetchSiteOptions().then(setSiteOptions);
  }, []);

  const heroBg = siteOptions.home_hero_bg || '';

  return (
    <>
      <SEO 
        title="Expert en Réparation Informatique à Liège"
        description="PROMEDIAS redonne vie à vos smartphones, laptops et Mac au cœur de Liège. Micro-soudure de précision, pièces premium et boutique d'appareils reconditionnés garantis."
      />
      {/* Hero Section */}
      <section id="hero" className="relative h-screen min-h-[600px] lg:min-h-[800px] flex items-center overflow-hidden bg-black">
        {/* Cinematic Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={heroBg}
            className="w-full h-full object-cover object-[70%_center] lg:object-center"
            alt="Macro ProMedias detail"
          />
          <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-black/40 lg:hidden" />
        </motion.div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 md:space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel text-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                <ShieldCheck size={16} />
                L'Excellence Certifiée à Liège
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-white font-headline tracking-tighter text-4xl md:text-6xl lg:text-hero leading-[0.9] lg:leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                PROMEDIAS <br />
                <span className="text-primary italic">L'Art de la</span> <br />
                Résurrection.
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-2xl font-light leading-relaxed drop-shadow-md mx-auto lg:mx-0">
                De la micro-soudure de précision au reconditionnement d'élite. Nous redonnons vie à votre technologie avec la rigueur d'une manufacture d'horlogerie.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-6 pt-4 md:pt-8">
                <Link to="/diagnostic" className="w-full sm:w-auto">
                  <Button size="xl" className="w-full text-lg font-bold h-14 md:h-16 px-12 rounded-2xl hover:scale-105 bg-primary text-white hover:shadow-[0_0_40px_rgba(209,44,44,0.4)] transition-all duration-300">
                    Demander un devis
                  </Button>
                </Link>
                <Link to="/shop" className="w-full sm:w-auto">
                  <Button size="xl" variant="outline" className="w-full text-lg font-bold h-14 md:h-16 px-12 bg-zinc-900/60 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all border-white/20 rounded-2xl">
                    Explorer la boutique
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-zinc-50 to-transparent z-20 pointer-events-none" />
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
      
      <section className="py-12 border-y border-zinc-100 bg-white overflow-hidden">
        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              AutoScroll({
                speed: 1,
                stopOnInteraction: false,
                playOnInit: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="flex items-center -ml-0">
              {["APPLE", "SAMSUNG", "HUAWEI", "SONY", "ASUS", "HP", "DELL", "LENOVO", "XIAOMI", "ACER", "APPLE", "SAMSUNG", "HUAWEI", "SONY"].map((brand, idx) => (
                <CarouselItem key={`${brand}-${idx}`} className="pl-0 basis-auto px-12">
                  <span 
                    className="font-headline font-black text-3xl md:text-6xl tracking-[0.4em] text-zinc-300/60 hover:text-primary transition-colors cursor-grab active:cursor-grabbing select-none uppercase"
                  >
                    {brand}
                  </span>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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

      {/* Scroll-Driven Sequence */}
      <ScrollSequence />

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

      <section className="py-32 bg-zinc-50 overflow-hidden">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-20 gap-12">
            <div className="max-w-3xl">
              <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase font-headline">La Voix de nos Clients</span>
              <h2 className="text-4xl md:text-7xl font-headline font-bold mt-4 tracking-tighter italic">Approuvé par <span className="text-primary italic">Liège.</span></h2>
            </div>
            <div className="flex justify-center w-full">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-3 border border-zinc-100 min-w-[280px]">
                <div className="flex items-center gap-3 mb-1">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-headline font-bold text-2xl tracking-tight text-zinc-900">4.9/5</span>
                </div>
                <div className="flex gap-1.5 text-yellow-400">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                </div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest text-center mt-1">Sur Google Reviews</p>
              </div>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 py-8">
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
                },
                { 
                  text: "Très professionnel et honnête sur les prix. Pas de frais cachés et un travail soigné. Je recommande les yeux fermés.",
                  author: "Sarah Martin",
                  role: "Entrepreneur",
                  initials: "SM"
                }
              ].map((testimonial, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 h-full rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500"
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
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {testimonial.initials}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{testimonial.author}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{testimonial.role}</p>
                        </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-end gap-3 mt-8">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
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

      <AnnouncementsSlider />
    </>
  );
};

export default Home;
