export interface Product {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  category: string;
  price: number; // in MAD (Moroccan Dirham)
  image: string;
  gallery: string[];
  description_fr: string;
  description_en: string;
  description_ar: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  material_fr: string;
  material_en: string;
  material_ar: string;
  dimensions: string;
  weight: string;
  rating: number;
  createdAt?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Language = 'fr' | 'en' | 'ar';

export interface FilterState {
  category: string;
  priceRange: [number, number];
  material: string;
  searchQuery: string;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  rating: number;
  text_fr: string;
  text_en: string;
  text_ar: string;
  date: string;
}

export interface CraftingImage {
  url: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  desc_fr: string;
  desc_en: string;
  desc_ar: string;
}
