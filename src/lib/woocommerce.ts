const WC_URL = '/wp-json/wc/v3';
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

export interface WCProduct {
  id: number;
  name: string;
  price: string;
  description: string;
  short_description: string;
  images: { src: string }[];
  categories: { name: string }[];
  attributes: { name: string; options: string[] }[];
}

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${WC_URL}/products?per_page=100`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch products');
    
    const data: WCProduct[] = await response.json();

    return data.map(product => {
      // Find specific attributes (case-insensitive)
      const findAttr = (name: string) => 
        product.attributes.find(a => a.name.toLowerCase() === name.toLowerCase())?.options[0] || '';

      const specs = findAttr('Specs') || findAttr('Spécifications');
      const condition = findAttr('Condition') || 'Excellent';
      const score = parseInt(findAttr('Score')) || 100;
      
      // Determine main category mapping
      const categoryNames = product.categories.map(c => c.name);
      let mainCat: "Téléphonie" | "Informatique" | "Accessoires" = "Téléphonie";
      
      if (categoryNames.includes("Informatique")) mainCat = "Informatique";
      else if (categoryNames.includes("Accessoires")) mainCat = "Accessoires";

      return {
        id: product.id,
        name: product.name,
        price: product.price + " €",
        specs: specs || product.short_description.replace(/<[^>]*>?/gm, '').substring(0, 60),
        image: product.images[0]?.src || '',
        gallery: product.images.map(img => img.src),
        mainCategory: mainCat,
        category: product.categories[0]?.name || 'Général',
        condition: condition,
        conditionScore: score
      };
    });
  } catch (error) {
    console.error('WooCommerce Fetch Error:', error);
    return [];
  }
};

export interface PageData {
  title: string;
  content: string;
  acf: Record<string, string | number | boolean | undefined | null>;
}

// SEO Mapper: Code (English) -> WordPress (French)
const PAGE_SLUGS: Record<string, string> = {
  "about": "a-propos",
  "home": "accueil",
  "services": "services"
};

export const fetchPage = async (slug: string): Promise<PageData | null> => {
  const finalSlug = PAGE_SLUGS[slug] || slug; // Use mapper or fallback to original
  try {
    const response = await fetch(`/wp-json/wp/v2/pages?slug=${finalSlug}`);
    if (!response.ok) throw new Error('Failed to fetch page');
    
    const data = await response.json();
    if (data.length === 0) return null;

    const page = data[0];
    return {
      title: page.title.rendered,
      content: page.content.rendered,
      acf: page.acf || {}
    };
  } catch (error) {
    console.error('WordPress Page Fetch Error:', error);
    return null;
  }
};
