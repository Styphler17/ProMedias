import { useState, useEffect } from "react";
import { 
  Check,
  ChevronRight,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { cn } from "@/lib/utils";
import { BauhausCard } from "@/components/ui/bauhaus-card";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { CardSkeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { fetchProducts, fetchCategories, fetchPage, fetchSiteOptions, type WCCategory, type PageData, type SiteOptions } from "@/lib/woocommerce";

interface Product {
  id: number;
  name: string;
  price: string;
  specs: string;
  tag?: string;
  image: string; // Featured image
  gallery: string[]; // Up to 5 images
  mainCategory: "Téléphonie" | "Informatique" | "Accessoires";
  category: string; // This is the sub-category
  condition: string;
  conditionScore: number;
}

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const ITEMS_PER_PAGE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const CATEGORY_GROUPS = {
  "Téléphonie": ["iPhones", "Androids", "Tablettes"],
  "Informatique": ["Laptops", "Écrans", "Systèmes fixes"],
  "Accessoires": ["Chargeurs", "Coques", "Verres Trempés", "Casques", "Souris", "Claviers"]
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Tous": "Chaque appareil est minutieusement inspecté, testé et certifié par nos techniciens à Liège. Performance d'origine, prix réduit.",
  "Téléphonie": "Le meilleur des iPhones et smartphones reconditionnés avec une batterie certifiée et un écran d'origine.",
  "Informatique": "Des MacBook et ordinateurs performants pour les pros et les étudiants, rigoureusement vérifiés.",
  "Accessoires": "Une sélection d'accessoires de haute qualité pour protéger et optimiser vos appareils préférés.",
  "iPhones": "La puissance de l'écosystème Apple, reconditionnée avec soin et garantie 12 mois.",
  "Androids": "Une large gamme de smartphones performants, testés sur plus de 50 points de contrôle.",
  "Tablettes": "iPad et tablettes polyvalentes pour le dessin, le travail ou les loisirs.",
  "Laptops": "Des ordinateurs portables comme neufs, idéaux pour la productivité et le divertissement.",
  "Écrans": "Améliorez votre espace de travail avec nos moniteurs haute performance.",
  "Systèmes fixes": "La puissance brute au meilleur prix pour vos projets créatifs ou bureautiques.",
  "Chargeurs": "Alimentation certifiée et sécurisée pour la longévité de vos batteries.",
  "Coques": "Protection élégante et robuste pour sécuriser votre smartphone au quotidien.",
  "Verres Trempés": "La protection ultime contre les chocs et les rayures pour votre écran.",
  "Casques": "L'excellence sonore reconditionnée pour une immersion totale.",
  "Souris": "Précision et ergonomie pour votre setup informatique.",
  "Claviers": "Confort de frappe et durabilité pour tous vos supports."
};

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<WCCategory[]>([]);
  const [shopContent, setShopContent] = useState<PageData | null>(null);
  const [siteOptions, setSiteOptions] = useState<SiteOptions>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Téléphonie"]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [prodData, catData, shopData, opts] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchPage("shop"),
        fetchSiteOptions(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      setShopContent(shopData);
      setSiteOptions(opts);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "Tous" 
      ? true 
      : (p.category === selectedCategory || p.mainCategory === selectedCategory);
    
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.specs.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category: string) => {
    if (category === "Tous") return products.length;
    if (Object.keys(CATEGORY_GROUPS).includes(category)) {
        return products.filter(p => p.mainCategory === category).length;
    }
    return products.filter(p => p.category === category).length;
  };

  const renderFilters = (isMobile = false) => (
    <div className="space-y-12">
        <button 
            onClick={() => {
                handleCategoryChange("Tous");
                if (isMobile) setIsMobileFiltersOpen(false);
            }}
            className={cn(
            "w-full px-6 py-4 text-sm font-bold rounded-2xl transition-all text-left flex items-center justify-between group h-14 border",
            selectedCategory === "Tous" 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "bg-white border-zinc-100 text-zinc-900 hover:border-primary/30"
            )}
        >
            <span className="flex items-center gap-2">
                Voir Tout le Catalogue
                <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    selectedCategory === "Tous" ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-400"
                )}>
                    {getCategoryCount("Tous")}
                </span>
            </span>
            <ChevronRight size={18} className={selectedCategory === "Tous" ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
        </button>

        {Object.entries(CATEGORY_GROUPS).map(([main, subs]) => (
            <div key={main} className="space-y-2">
            <button 
                onClick={() => toggleGroup(main)}
                className={cn(
                "w-full text-xs font-black uppercase tracking-[0.2em] px-2 py-2 flex justify-between items-center transition-colors group",
                expandedGroups.includes(main) ? "text-primary" : "text-zinc-500 hover:text-zinc-900"
                )}
            >
                <span className="flex items-center gap-3">
                <ChevronRight 
                    size={14} 
                    className={cn("transition-transform duration-300", expandedGroups.includes(main) ? "rotate-90 text-primary" : "text-zinc-300")} 
                />
                {main}
                <span className="text-[10px] text-zinc-400 font-bold ml-2 lowercase tracking-normal">({getCategoryCount(main)})</span>
                </span>
                <span className="h-px bg-zinc-100 flex-grow ml-4 opacity-50"></span>
            </button>
            
            <AnimatePresence initial={false}>
                {expandedGroups.includes(main) && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-1 gap-1 pl-6 pt-2 pb-4">
                    <button 
                        onClick={() => {
                            handleCategoryChange(main);
                            if (isMobile) setIsMobileFiltersOpen(false);
                        }}
                        className={cn(
                        "px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all text-left mb-1",
                        selectedCategory === main 
                            ? "bg-primary/10 text-primary" 
                            : "text-zinc-400 hover:text-primary hover:bg-primary/5"
                        )}
                    >
                        Voir tout dans {main}
                    </button>
                    {subs.map(sub => (
                        <button 
                        key={sub}
                        onClick={() => {
                            handleCategoryChange(sub);
                            if (isMobile) setIsMobileFiltersOpen(false);
                        }}
                        className={cn(
                            "px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left flex items-center justify-between group",
                            selectedCategory === sub 
                            ? "bg-zinc-900 text-white shadow-xl shadow-black/10 translate-x-1" 
                            : "bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        )}
                        >
                        {sub}
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold",
                            selectedCategory === sub ? "bg-white/10 text-white/50" : "bg-zinc-100 text-zinc-400"
                        )}>
                            {getCategoryCount(sub)}
                        </span>
                        </button>
                    ))}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            </div>
        ))}

        {!isMobile && (
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100"
            >
                <h4 className="text-primary font-bold mb-4 flex items-center gap-2 font-headline">
                <Check size={18} />
                Garantie 12 Mois
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Sérénité totale. Nous garantissons le hardware pendant 1 an sur tout le catalogue.</p>
            </motion.div>
        )}
    </div>
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleWhatsApp = (product: Product) => {
    const shopNumber = "32466058793"; 
    const message = encodeURIComponent(
      `Bonjour PROMEDIAS ! Je suis intéressé par cet article :\n\n` +
      `📦 *${product.name}*\n` +
      `💰 *Prix :* ${product.price}\n` +
      `⚙️ *Specs :* ${product.specs}\n\n` +
      `Lien de l'image : ${activeImage || product.image}`
    );
    window.open(`https://wa.me/${shopNumber}?text=${message}`, "_blank");
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveImage(product.image);
  };

  return (
    <div className="pb-24">
      <SEO
        title="Boutique Reconditionnée Apple"
        description="Découvrez le meilleur d'Apple reconditionné à Liège. iPhone, MacBook et iPad rigoureusement testés et certifiés avec une garantie de 12 mois. La performance sans le prix du neuf."
      />
      <PageHero
        label="Boutique Reconditionnée"
        title={selectedCategory === "Tous" ? "Le meilleur d'Apple," : selectedCategory}
        accent={selectedCategory === "Tous" ? "sans le prix du neuf." : undefined}
        subtitle={(() => {
          const acf = shopContent?.acf;
          if (selectedCategory === "Tous") return acf?.desc_tous || CATEGORY_DESCRIPTIONS["Tous"];
          if (selectedCategory === "Téléphonie") return acf?.desc_telephonie || CATEGORY_DESCRIPTIONS["Téléphonie"];
          if (selectedCategory === "Informatique") return acf?.desc_informatique || CATEGORY_DESCRIPTIONS["Informatique"];
          if (selectedCategory === "Accessoires") return acf?.desc_accessoires || CATEGORY_DESCRIPTIONS["Accessoires"];
          const nativeCat = categories.find(c => c.name === selectedCategory);
          if (nativeCat?.description) return nativeCat.description.replace(/<[^>]*>?/gm, "");
          return CATEGORY_DESCRIPTIONS[selectedCategory] || CATEGORY_DESCRIPTIONS["Tous"];
        })()}
        animKey={selectedCategory}
        bgImage={siteOptions.shop_hero_bg}
      />

      <section className="container">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Mobile Filter Trigger */}
          <div className="lg:hidden flex justify-between items-center mb-8 pb-4 border-b">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Catalogue</span>
              <p className="font-headline font-bold text-xl">{selectedCategory}</p>
            </div>
            <Button 
                variant="outline" 
                className="rounded-2xl gap-2 font-bold px-6 h-12 bg-white"
                onClick={() => setIsMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={18} />
              Filtrer
            </Button>
          </div>

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:w-72 space-y-12 shrink-0">
            {renderFilters()}
          </aside>
  
          {/* Mobile Filters Dialog */}
          <Dialog open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <DialogContent className="max-w-md h-[80vh] overflow-y-auto rounded-[2.5rem] p-10">
                <DialogHeader className="mb-8">
                    <DialogTitle className="font-headline text-3xl tracking-tighter">Filtrer par Catégorie</DialogTitle>
                    <DialogDescription className="text-zinc-500 font-medium">Sélectionnez un univers pour affiner votre recherche.</DialogDescription>
                </DialogHeader>
                <div className="space-y-8">
                    {renderFilters(true)}
                </div>
              </DialogContent>
          </Dialog>

          {/* Product Grid */}
          <div className="flex-grow flex flex-col">
            {/* Search Bar */}
            <div className="mb-12 relative group group-hover:scale-[1.01] transition-all duration-300">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un modèle, une pièce..." 
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="w-full h-16 pl-16 pr-6 bg-white border border-zinc-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all font-medium text-lg"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
                  >
                    Effacer
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`${selectedCategory}-${currentPage}-${isLoading}`}
              className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-12 flex-grow"
            >
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                      <CardSkeleton />
                    </motion.div>
                  ))
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <motion.article
                      key={product.id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group"
                    >
                      <BauhausCard
                        id={product.id.toString()}
                        image={product.image}
                        gallery={product.gallery}
                        topInscription={product.price}
                        mainText={product.name}
                        subMainText={product.specs}
                        progressBarInscription="Condition Technique"
                        progress={product.conditionScore}
                        progressValue={product.condition}
                        onFilledButtonClick={() => openProduct(product)}
                        onOutlinedButtonClick={() => handleWhatsApp(product)}
                        onCardClick={() => openProduct(product)}
                        accentColor="var(--bauhaus-card-accent)"
                        backgroundColor="var(--bauhaus-card-bg)"
                        separatorColor="var(--bauhaus-card-separator)"
                        textColorTop="var(--bauhaus-card-inscription-top)"
                        textColorMain="var(--bauhaus-card-inscription-main)"
                        textColorSub="var(--bauhaus-card-inscription-sub)"
                        textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
                        textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
                        progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
                      />
                    </motion.article>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center space-y-6 bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200"
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Search className="text-zinc-300" size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-headline font-bold text-zinc-900">Aucun résultat trouvé</h3>
                        <p className="text-zinc-500 max-w-xs mx-auto mt-2">Nous n'avons trouvé aucun produit correspondant à <span className="text-primary font-bold">"{searchTerm}"</span></p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm("")}
                        className="rounded-xl border-zinc-200 hover:border-primary hover:text-primary"
                    >
                        Réinitialiser la recherche
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 py-8 border-t border-zinc-100 flex flex-col items-center gap-6">
                <PaginationCustom 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Affichage de <span className="text-zinc-900">{paginatedProducts.length}</span> sur {filteredProducts.length} produits
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none rounded-[2.5rem] shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 flex flex-col bg-zinc-50">
                <div className="flex-grow p-12 flex items-center justify-center bg-zinc-100 h-[450px]">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={activeImage || selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Thumbnail Gallery */}
                <div className="p-6 flex justify-center gap-3 bg-zinc-50 border-t border-zinc-200/50">
                  {selectedProduct.gallery.map((img, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white",
                        activeImage === img ? "border-primary shadow-lg scale-110" : "border-transparent opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={img} className="w-full h-full object-cover rounded-lg" alt="" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <DialogHeader className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase font-headline">Produit Certifié</span>
                     <span className="font-headline font-bold text-2xl text-primary">{selectedProduct.price}</span>
                  </div>
                  <DialogTitle className="text-4xl font-headline font-bold tracking-tighter mb-4 leading-none">
                    {selectedProduct.name}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-lg font-light leading-relaxed">
                    Cet appareil a été rigoureusement testé sur plus de 50 points de contrôle. Vendu avec une garantie de 12 mois dans notre atelier de Liège.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mb-12">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Spécifications Techniques</h5>
                    <p className="text-sm font-bold text-zinc-900">{selectedProduct.specs}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                      <Check size={14} className="text-primary" /> Garantie 1 an
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                      <Check size={14} className="text-primary" /> Batterie &gt;85%
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleWhatsApp(selectedProduct)}
                    className="flex-grow h-16 rounded-2xl bg-primary hover:bg-primary-variant text-white font-bold text-lg gap-3 shadow-xl shadow-primary/20 border-none"
                  >
                    <WhatsAppIcon size={26} />
                    Contacter pour cet article
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
