import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Settings,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { fetchSiteOptions, type SiteOptions } from "@/lib/woocommerce";
import AnnouncementsSlider from "@/components/AnnouncementsSlider";

const Diagnostic = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [siteOptions, setSiteOptions] = useState<SiteOptions>({});

  useEffect(() => {
    fetchSiteOptions().then(setSiteOptions);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-24 min-h-screen">
      <SEO 
        title={isSubmitted ? "Demande Envoyée - ProMedias" : "Diagnostic Complet & Devis Gratuit"}
        description="Obtenez un diagnostic technique pour vos smartphones, ordinateurs et Mac à Liège. Devis transparent, pièces garanties et intervention en 24h."
      />
      
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.section 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container pt-44 pb-32 text-center"
          >
              <div className="max-w-xl mx-auto space-y-8 bg-zinc-50 p-16 rounded-[4rem] border border-zinc-100">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/30">
                      <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <div className="space-y-4">
                      <h1 className="text-5xl font-headline font-bold">Merci !</h1>
                      <p className="text-xl text-muted-foreground font-light leading-relaxed">
                          Votre demande de diagnostic a été transmise avec succès. Un de nos techniciens vous contactera par téléphone ou email sous <span className="text-primary font-bold">2 heures ouvrées</span>.
                      </p>
                  </div>
                  <div className="pt-8 flex flex-col gap-4">
                      <Link to="/shop">
                          <Button size="xl" className="w-full h-16 text-lg font-bold rounded-2xl">
                              Visiter la Boutique
                          </Button>
                      </Link>
                      <button 
                          onClick={() => setIsSubmitted(false)}
                          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors"
                      >
                          Envoyer une autre demande
                      </button>
                  </div>
              </div>
          </motion.section>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PageHero
              label="Diagnostic Technique"
              title="La précision au service de"
              accent="votre technologie."
              subtitle="Identifiez l'origine exacte de la panne. Nos experts Liégeois analysent vos composants avec une rigueur chirurgicale sous 24h à 48h."
              bgImage={siteOptions.diagnostic_hero_bg}
            />

            <section className="container grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
              <aside className="lg:col-span-5 xl:col-span-4 space-y-12 pr-0 lg:pr-8">
                  <div>
                      <h2 className="text-2xl font-headline font-bold mb-8 flex items-center gap-4 whitespace-nowrap">
                          <Settings className="text-primary shrink-0" />
                          Le Processus
                      </h2>
                      <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200">
                          {[
                              { step: "01", title: "Soumission", desc: "Remplissez le formulaire avec précision pour nous aider à préparer les tests." },
                              { step: "02", title: "Dépôt & Examen", desc: "Déposez votre appareil à notre comptoir. Analyse complète des circuits." },
                              { step: "03", title: "Rapport Détaillé", desc: "Réception d'un devis transparent. Aucune réparation sans votre accord." },
                              { step: "04", title: "Renaissance", desc: "Réparation effectuée avec des pièces d'origine et validation finale." }
                          ].map((item, i) => (
                              <div key={i} className="relative pl-10">
                                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-primary z-10" />
                                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 whitespace-nowrap">{item.step}. {item.title}</h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="p-10 bg-zinc-900 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 -skew-x-12 translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-all duration-700" />
                      <h3 className="text-2xl font-headline font-bold relative z-10 leading-tight">Accédez à votre expert en direct.</h3>
                      <p className="text-zinc-400 text-lg font-light relative z-10">Un conseil technique immédiat peut parfois sauver votre matériel.</p>
                      <a href="tel:+32466058793" className="flex items-center gap-4 text-primary font-bold text-2xl relative z-10 hover:translate-x-2 transition-transform duration-500">
                          +32 466 05 87 93
                          <ArrowRight size={24} />
                      </a>
                  </div>
              </aside>

              <div className="lg:col-span-7 xl:col-span-7 xl:col-start-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50"
                  >
                      <form className="space-y-10" onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Type d'appareil</label>
                                  <select className="w-full h-14 bg-zinc-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 font-medium appearance-none">
                                      <option>iPhone / Smartphone</option>
                                      <option>MacBook / iMac</option>
                                      <option>Ordinateur Portable PC</option>
                                      <option>Ordinateur Fixe</option>
                                      <option>Tablette / iPad</option>
                                  </select>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Modèle Précis</label>
                                  <input className="w-full h-14 bg-zinc-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 font-medium" type="text" placeholder="ex: iPhone 15 Pro, Dell XPS 13..." required />
                              </div>
                          </div>

                          <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Symptômes constatés</label>
                              <textarea className="w-full bg-zinc-50 border-none rounded-xl p-6 focus:ring-2 focus:ring-primary/20 font-medium min-h-[160px] leading-relaxed" placeholder="Décrivez les signes de panne (écran noir, liquide renversé, surchauffe...)" required />
                          </div>

                          <div className="pt-10 border-t border-zinc-100 flex flex-col gap-8">
                              <h3 className="text-2xl font-headline font-bold">Vos Coordonnées</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Nom Complet</label>
                                      <input className="w-full h-14 bg-zinc-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20" type="text" required />
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Numéro de Téléphone</label>
                                      <input className="w-full h-14 bg-zinc-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20" type="tel" required />
                                  </div>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Adresse Email</label>
                                  <input className="w-full h-14 bg-zinc-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20" type="email" required />
                              </div>
                          </div>

                          <div className="flex items-center gap-3 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                              <input type="checkbox" className="w-6 h-6 rounded border-zinc-300 text-primary focus:ring-primary" id="urgent" />
                              <label htmlFor="urgent" className="text-sm font-bold cursor-pointer">Demande Prioritaire / Urgence Informatique</label>
                          </div>

                          <Button size="xl" type="submit" className="w-full h-20 text-lg font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 group">
                              Envoyer
                              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </Button>
                      </form>
                  </motion.div>
              </div>
            </section>

            <section className="container mt-24">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { icon: ShieldCheck, title: "Pièces Certifiées" },
                      { icon: Clock, title: "Service Express" },
                      { icon: CheckCircle2, title: "Expertise Garantie" },
                      { icon: FileText, title: "Devis Transparent" }
                  ].map((item, i) => (
                      <div key={i} className="bg-zinc-100 p-8 rounded-2xl flex flex-col items-center gap-6 text-center group hover:bg-zinc-900 hover:text-white transition-all duration-700">
                          <item.icon size={32} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.title}</span>
                      </div>
                  ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16">
        <AnnouncementsSlider />
      </div>
    </div>
  );
};

export default Diagnostic;
