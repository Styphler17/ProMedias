import { 
  Smartphone, 
  Laptop, 
  ArrowRight,
  SmartphoneIcon,
  Printer
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const Services = () => {
  const serviceGroups = [
    {
      title: "Réparation Mobiles & Tablettes",
      icon: <Smartphone className="text-primary" size={32} />,
      services: [
        "Réparation/Remplacement d'écran",
        "Réparation de boutons & Power button",
        "Caméra & Optique",
        "Système connecteur de charge",
        "Réparation de châssis / Case repair",
        "Désoxydation (Water-damage repair)",
        "Réparation Tablettes toutes marques",
        "Mise à jour système Android",
        "Installations des Applications",
        "Protection Gsm & Pochettes"
      ]
    },
    {
      title: "Expertise PC & Apple Mac",
      icon: <Laptop className="text-secondary" size={32} />,
      services: [
        "Réparation spécialisée iMac",
        "Réparation Apple Macbook Pro & Air",
        "Formatage Windows (Toutes versions)",
        "Formatage Apple OS (macOS)",
        "Résolution problèmes logiciels",
        "Dépannage système & drivers",
        "Upgrade RAM & SSD",
        "Nettoyage interne complet"
      ]
    },
    {
      title: "Impression, Photocopie & Consulting",
      icon: <Printer className="text-orange-500" size={32} />,
      info: "Envoyez vos fichiers à promedias.liege@gmail.com",
      services: [
        "Impression Noir & Blanc et Couleur",
        "Photocopie Haute Résolution",
        "Numérisation de documents (Email/USB)",
        "IT Consulting & Conseil Technique",
        "Récupération de données",
        "Service express en boutique"
      ],
      cta: {
        text: "Envoyer mes fichiers",
        email: "promedias.liege@gmail.com"
      }
    }
  ];

  return (
    <div className="pt-32 pb-24">
      <SEO 
        title="Services de Réparation & Expertise IT"
        description="Nos services de réparation à Liège : écrans, batteries, connecteurs de charge, micro-soudure et IT Consulting. Diagnostic complet pour mobiles Apple, Samsung et ordinateurs PC/Mac."
      />
      {/* Hero Section */}
      <section className="container mb-32">
        <div className="max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary font-bold tracking-[0.2em] text-xs mb-4 block uppercase font-headline"
          >
            NOTRE CATALOGUE D'EXPERTISE
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline tracking-tighter mb-8"
          >
            Toutes les solutions <br /><span className="text-zinc-400">sous un même toit.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-light"
          >
            Du simple changement d'écran à l'IT Consulting complexe, nous déployons une rigueur technique absolue pour chaque demande.
          </motion.p>
        </div>
      </section>

      {/* Modern Services Grid */}
      <section className="container mb-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {serviceGroups.map((group, idx) => (
            <motion.article 
              key={idx} 
              variants={itemVariants}
              className="bg-white rounded-[2.5rem] border border-zinc-100 p-12 shadow-sm hover:shadow-2xl transition-all duration-700 group hover:-translate-y-2 flex flex-col"
            >
              <div className="mb-10 p-5 bg-zinc-50 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                {group.icon}
              </div>
              <h3 className="text-3xl font-headline font-bold mb-8">{group.title}</h3>
              {group.info && (
                <p className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full mb-8 w-fit border border-primary/10">
                   {group.info}
                </p>
              )}
              <ul className="space-y-4 mb-10 flex-grow">
                {group.services.map((service, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-4 text-zinc-500 text-sm font-medium hover:text-zinc-900 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {group.cta?.email ? (
                  <a href={`mailto:${group.cta.email}?subject=Impression documents ProMedias`}>
                    <Button className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs group/btn shadow-lg shadow-primary/20">
                      {group.cta.text} <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                ) : (
                  <Link to="/diagnostic">
                    <Button variant="ghost" className="p-0 h-auto font-bold uppercase tracking-widest text-[10px] text-primary flex items-center gap-2 group/btn">
                      Demander un devis <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Support Center Highlight */}
      <section className="bg-zinc-900 text-white py-32 mb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <SmartphoneIcon size={600} className="rotate-12 translate-x-1/4" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs mb-4 block uppercase font-headline">Centre de Diagnostic</span>
              <h2 className="text-5xl md:text-6xl font-headline font-bold mb-8">Scan complet avant chaque intervention.</h2>
              <p className="text-zinc-400 text-lg font-light leading-relaxed mb-12">
                Nous ne devinons jamais. Chaque appareil subit un **Diagnostic Scan** approfondi pour identifier la cause racine des problèmes logiciels ou matériels, garantissant une réparation durable.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-headline font-bold text-primary mb-2">100%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Précision Technique</div>
                </div>
                <div>
                  <div className="text-4xl font-headline font-bold text-primary mb-2">48h</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Délai Max Diagnostic</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem]">
              <h3 className="text-2xl font-headline font-bold mb-8">Processus de prise en charge</h3>
              <div className="space-y-8">
                {[
                  { title: "Dépôt en boutique", desc: "Sans rendez-vous au 141 Rue St Léonard." },
                  { title: "Scan & Analyse", desc: "Test complet des circuits et du système." },
                  { title: "Devis Fixe", desc: "Prix garanti avant toute main-d'œuvre." },
                  { title: "Récupération", desc: "Test final en votre présence." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">{i+1}</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                      <p className="text-zinc-500 text-sm uppercase tracking-tighter">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
       <section className="container">
        <div className="bg-primary rounded-[3rem] p-16 md:p-24 relative overflow-hidden flex flex-col items-center text-center group">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-black/10 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">Un problème, une solution.</h2>
            <p className="text-white/80 text-xl font-light max-w-lg mx-auto leading-relaxed mb-12">Passez en boutique dès aujourd'hui ou obtenez une estimation gratuite en ligne.</p>
             <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/diagnostic">
                     <Button size="xl" className="bg-white text-primary hover:bg-primary hover:text-white text-xl font-bold h-20 px-12 rounded-full shadow-2xl transition-all duration-300">
                     Demander mon devis
                     </Button>
                 </Link>
                 <a href="tel:+32466058793">
                     <Button size="xl" className="bg-zinc-950 text-white hover:bg-zinc-800 text-xl font-bold h-20 px-12 rounded-full shadow-2xl transition-all duration-300">
                     Appeler l'atelier
                     </Button>
                 </a>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
