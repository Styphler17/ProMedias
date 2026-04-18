import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Leaf, 
  MapPin, 
  Clock, 
  Phone,
  ArrowRight,
  Monitor,
  Recycle,
  Microscope,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { fetchPage, fetchContact, type PageData } from "@/lib/woocommerce";

const About = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);
  const [storefrontUrl, setStorefrontUrl] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const [data, contact] = await Promise.all([fetchPage("about"), fetchContact()]);
      setPageData(data);
      setMapsUrl(contact.contact_maps_url ?? null);
      setStorefrontUrl(contact.contact_storefront_url ?? '');
    };
    loadData();
  }, []);

  // Helper to get ACF image with fallback
  const getImg = (slug: string, fallback: string): string => {
    const val = pageData?.acf?.[slug];
    return typeof val === 'string' ? val : fallback;
  };
  return (
    <div className="pb-24">
      <SEO
        title="À Propos de l'Atelier"
        description="Plongez au cœur de l'Atelier ProMedias à Liège : 10 ans d'expertise dans la réparation de haute précision et un engagement fort pour l'économie circulaire et la technologie durable."
      />
      <PageHero
        label="L'Atelier de Précision"
        title="La renaissance de"
        accent="vos appareils."
        subtitle="Depuis plus de 10 ans au cœur de Liège, PROMEDIAS redéfinit la réparation informatique. Nous restaurons l'excellence technique de vos outils de travail et de vie."
        aside={
          <div className="relative shrink-0 w-full lg:w-80">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl transform lg:rotate-2">
              <img
                className="w-full h-full object-cover"
                src={getImg("hero_image", "https://lh3.googleusercontent.com/aida-public/AB6AXuB8ogJAQ2GTKG3xlUTnGYtnhZUPBzLNbo_GWLqgzTSiEf5PaCrQfUuYvChSkVjIKaSl8pLPS3GR-ZDzeYIQveXPF7rRJfuUdhBBscLaDtF4PnqqatBlo4YS1gz1n6bumSibxXrnVBgE9jbaiC_GeqXGPcm-V-7U38TrW779mx_U1el7ZNNRMsIyxuVhQ8_M1pODZaLLAxV5V4t8jaQ3uESs116O_j6vshM4JtsxMIaasQQW4mpDV1NaA-khxgcGKJi-7U9oMkZz3nA")}
                alt="Technician"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2rem] shadow-2xl hidden lg:block max-w-[200px]">
              <p className="text-4xl font-headline font-bold text-primary mb-1">10+</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-loose">Années d'expertise à Liège</p>
            </div>
          </div>
        }
      />

      {/* Values Section */}
      <section className="bg-zinc-50 py-32">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-headline font-bold">L'Honnêteté Structurelle</h3>
              <p className="text-muted-foreground leading-relaxed">Aucun coût caché, aucun jargon inutile. Nous vous expliquons la panne comme si nous étions devant le schéma technique, en toute transparence.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Microscope size={32} />
              </div>
              <h3 className="text-2xl font-headline font-bold">Composants Premium</h3>
              <p className="text-muted-foreground leading-relaxed">Nous refusons les copies bas de gamme. Chaque condensateur, chaque écran et chaque batterie est sélectionné pour sa longévité industrielle.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-headline font-bold">Ancrage Local</h3>
              <p className="text-muted-foreground leading-relaxed">Plus qu'une boutique, nous sommes un partenaire de confiance pour les Liégeois. Réparer localement, c'est soutenir l'économie de proximité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="container py-32">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 block font-headline">Notre Engagement Écologique</span>
          <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight">Réparer pour <span className="text-primary italic">la planète.</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[700px]">
          <div className="md:col-span-2 md:row-span-2 rounded-[2.5rem] overflow-hidden relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
              src={getImg("environmental_impact_image", "https://lh3.googleusercontent.com/aida-public/AB6AXuDO7YQO7QUlqoVYwIzLePWc1Mpb61kTZxMzH_JdLhZHN5OF3ZYsr7z7jrFBNj7BnvFwzNluJ44raQdyTUQn-Z5uexErSLSg2BzXirJx-Kiy7bNLFXpB-gFyQT60y3KvYwr_lt0hqVb65c3Unju3_W8LGufbFH4vIzyQImuYlMCoHerU6KB6dmeOXn6IK-WExFEoygG4C5rR-G5r9Ap8DJ3Ur_tzh69Mf0gm-6677_26GEeT2TkMEGa4g9AdocOeD5ML6gDu0dPYAh0")} 
              alt="Recycling"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-10 left-10 p-4 text-white">
              <h4 className="text-3xl font-headline font-bold mb-3">-80% d'empreinte carbone</h4>
              <p className="text-white/80 max-w-sm font-light">Choisir la réparation réduit drastiquement les émissions liées à l'extraction de métaux rares.</p>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-zinc-900 rounded-[2.5rem] p-12 flex flex-col justify-between text-white">
            <Leaf size={48} className="text-primary" />
            <div>
              <h4 className="text-3xl font-headline font-bold mb-4">Économie Circulaire</h4>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">Chaque appareil sauvé est un déchet électronique en moins. En 10 ans, nous avons évité des tonnes de déchets à Liège.</p>
            </div>
          </div>
          
          <div className="md:col-span-1 bg-zinc-100 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center">
            <Recycle size={32} className="text-primary mb-4" />
            <p className="text-4xl font-headline font-bold mb-1">15k+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Appareils sauvés</p>
          </div>
          
          <div className="md:col-span-1 bg-primary rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center text-white">
            <Monitor size={32} className="mb-4" />
            <p className="text-4xl font-headline font-bold mb-1">0%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Gaspillage Technique</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-zinc-50 py-32">
        <div className="container grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6 transform lg:-rotate-2">
                {[
                  { slug: "team_1", fallback: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVszKE-7YOrUU6f_3YdB8mvTmeiXpXfyh2o5K9Zh4NKlegXv_zTsIFm5GDgol-G6Rv3xeXTAWBCLIIHKJqdF3wxxzxeUep6Zy4-r-d1opep-0-c8CTRXRooaGSQtmJW8qUKXkjXt-lAV94Tsqm0kd030NBEiHKgYyk0Qd6g0TUuDezqPl9JtTtKxxdTGjF_7U0BwXsNGKjf1pje4V5uYceTtonn-FsN66RGOOIS3p67pWWlFcv9YPR1r2fpE4cnXJW7ge1eB-mX0Y", role: "Expert iPhone" },
                  { slug: "team_2", fallback: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm-YSb1tRksBS6805h-klqPd0gWMfoBGvk9KQsDnfkTv9QVXY9e6bwVuYNypfigtcA7aGOV_cR-ZfrQfnax-3r5C_p7Uyi1l223TzSDz2VkacDFS9j4iZjl-SweTEF-ejaKQDAqmoNqyVHkvmo2QTg4tNWkorLPG52Vme1g9g1MIaK-nbMk0ouevhvBp3PZ7qkAFDh_RxsLkiPSqHJD8_S1Zet-mnS5YveSlyZfKsd8GoPtu1Fiz2IPDHnLvn2pFJvfFhtMRqGQ08", role: "Specialiste Mac" },
                  { slug: "team_3", fallback: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkT1JCZnR3rpV566MRMrnjS7vhNR9REAlEJ8oStnpG_VvRVv5C7yUhwym97gFp8NrtpvBc-erLIo5urEIPV6zRQTDqzdiXv8ROmpUmmkhxhNF2VHKmV0Dv0BkYTLLKkZs0F-Khq1G3GZ3LTQqdpiOyR9JAlL2wfXdFQY9OKqW3F2IPFYwvHAH5ojaMAQDJ4jFQIbY_OMBNFJTLy0psjxKDN5EsKCJ108uirFl-HxJo8wdtZGCMlK9HProWpx5W8pd9lk3NPdTpBJA", role: "Micro-Soudure" },
                  { slug: "team_4", fallback: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZua75j2aCKUqcbKcnpyF0466roC_RRHBt0umZOAVQRy_-NFq9CjKk3ZDuZXt2CDfDNkErjFSJk9Sw2GfSb74-9M9DlrJlXWcBZgeq67dANPcAJPP4rJyRAupwS9iMTutxYFle5oNFvLLZ--NmkcbgpPW7WhMtDEOM2Cu7lZkNhP_eUwLCwxWyar4rUHpBCnwEqh7mil3nmmc6bIV_lrmQTM1yZzn8wVNJ53wf_7JGeXkw_6sO6QBVUjgLQCyp034iUdcHiXp3HBE", role: "Diagnostic" }
                ].map((member, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700 relative group">
                        <img src={getImg(member.slug, member.fallback)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Expert" />
                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-white font-headline font-bold text-lg leading-tight">{member.role}</span>
                            <div className="w-8 h-px bg-white/50 mt-2" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-10">
                <span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase font-headline">L'Élite Technique</span>
                <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight">Une équipe d'experts <span className="italic font-light">passionnés.</span></h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-light">
                    Notre équipe à Liège est composée de techniciens certifiés possédant une expertise pointue en micro-soudure et architecture logicielle. Chaque réparation est un défi que nous relevons avec la même rigueur horlogère.
                </p>
                <div className="pt-10 flex gap-12 border-t border-zinc-200">
                    <div>
                        <p className="text-4xl font-headline font-bold">12</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Experts dévoués</p>
                    </div>
                    <div>
                        <p className="text-4xl font-headline font-bold">48h</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Délai moyen</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Boutique Experience Section */}
      <section className="py-24 overflow-hidden">
        <div className="container">
          <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
            
            <div className="w-full lg:w-1/2 space-y-8 relative z-10">
              <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase font-headline">Visitez Nous</span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter capitalize l">Le comptoir de <span className="text-primary italic">Saint-Léonard.</span></h2>
              <p className="text-xl text-zinc-400 font-light leading-relaxed">
                Situé au cœur de Liège, notre atelier vous accueille dans un espace moderne dédié à la haute technicité. Venez découvrir notre expertise en direct et explorez notre sélection d'appareils reconditionnés.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {storefrontUrl && (
                  <a
                    href={storefrontUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl"
                  >
                    <Eye size={20} />
                    Voir la Vitrine (360°)
                  </a>
                )}
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative group">
              <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative">
                <img 
                  src={getImg("boutique_storefront_image", "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=awRRmECzGmtnHHzk42XHQw&cb_client=lu.gallery.gps&w=800&h=450&yaw=301.9327&pitch=0&thumbfov=100")} 
                  alt="Storefront ProMedias Liège" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    141 Rue St-Léonard, 4000 Liège
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container py-32">
        <div className="bg-zinc-900 rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
          <div className="flex-1 p-16 lg:p-24 space-y-10">
            <h2 className="text-5xl font-headline font-bold text-white">Nous <span className="text-primary italic">trouver.</span></h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <MapPin className="text-primary shrink-0" size={28} />
                <div className="text-white">
                  <p className="font-bold text-xl mb-1">PROMEDIAS Liège</p>
                  <p className="text-zinc-400">Rue St Léonard 141, 4000 Liège, Belgique</p>
                </div>
              </div>
              <div className="flex gap-6">
                <Clock className="text-primary shrink-0" size={28} />
                <div className="text-white">
                  <p className="font-bold text-xl mb-1">Horaires</p>
                  <p className="text-zinc-400">Lun - Ven: 09h00 - 18h30</p>
                  <p className="text-zinc-400">Samedi: 10h00 - 17h00</p>
                </div>
              </div>
              <div className="flex gap-6">
                <Phone className="text-primary shrink-0" size={28} />
                <div className="text-white">
                  <p className="font-bold text-xl mb-1">En Direct</p>
                  <p className="text-zinc-400">+32 466 05 87 93</p>
                  <p className="text-zinc-400">contact@promedias-liege.be</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <a 
                  href="https://wa.me/32466058793?text=Bonjour%20PROMEDIAS%20!%20Je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20services." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-primary hover:bg-primary-variant text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/10 hover:scale-105"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chatter sur WhatsApp
                </a>
              </div>
            </div>
            <Link to="/diagnostic">
                <Button size="xl" className="w-full md:w-auto h-16 px-12 text-lg font-bold rounded-2xl group shadow-2xl shadow-primary/20">
                    Obtenir un Devis
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
            </Link>
          </div>
          <div className="w-full md:w-1/2 min-h-[500px] relative transition-all duration-1000 grayscale hover:grayscale-0">
            {mapsUrl && (
              <iframe
                src={mapsUrl}
                className="w-full h-full min-h-[500px] border-none"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
