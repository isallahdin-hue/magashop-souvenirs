import React, { useState, useMemo, useEffect } from 'react';
import { Star, ShieldCheck, Truck, CreditCard, Sparkles, Instagram, Send, Heart, MessageCircle, Search, SlidersHorizontal, RotateCcw, PackageOpen, Filter, Coffee, Box, Layers, Palette } from 'lucide-react';
import { Product, Language } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import { TESTIMONIALS, CRAFTING_GALLERY, INSTAGRAM_FEED } from '../data';
import { TRANSLATIONS } from '../translations';
import magashopHero from '../assets/images/magashop_hero_1783861535659.jpg';
import ProductCard from './ProductCard';
import { RosetteDivider, DotGrid } from './Header';

interface HomepageProps {
  currentLang: Language;
  products: Product[];
  categories?: string[];
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onViewDetails: (product: Product) => void;
  setCurrentPage: (page: string) => void;
  onSelectCategory: (category: string) => void;
}

// Custom Moroccan hand-drawn minimalist SVGs
const TagineIcon = () => (
  <svg className="w-8 h-8 text-[#C9A227]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M50 15 L50 25 C35 35, 25 50, 25 65 L75 65 C75 50, 65 35, 50 25 Z" />
    <path d="M15 65 L85 65 L85 75 C85 80, 80 85, 75 85 L25 85 C20 85, 15 80, 15 75 Z" />
    <circle cx="50" cy="12" r="3" fill="currentColor" />
  </svg>
);

const ZelligePlateIcon = () => (
  <svg className="w-8 h-8 text-[#C9A227]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
    <circle cx="50" cy="50" r="38" />
    <rect x="35" y="35" width="30" height="30" transform="rotate(0 50 50)" />
    <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" />
  </svg>
);

const TeapotIcon = () => (
  <svg className="w-8 h-8 text-[#C9A227]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M50 25 C35 25, 25 38, 25 53 C25 68, 35 78, 50 78 C65 78, 75 68, 75 53 C75 38, 65 25, 50 25 Z" />
    <path d="M50 15 L50 25 M42 15 L58 15" />
    <path d="M25 53 C12 45, 8 62, 18 70" />
    <path d="M75 45 C88 40, 88 68, 75 68" />
  </svg>
);

const PerfumeIcon = () => (
  <svg className="w-8 h-8 text-[#C9A227]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
    <rect x="30" y="42" width="40" height="42" rx="6" />
    <path d="M45 28 L55 28 L55 42 L45 42 Z" />
    <circle cx="50" cy="20" r="3" fill="currentColor" />
    <path d="M50 42 L50 80 M30 60 L70 60" strokeWidth="1" opacity="0.6" />
  </svg>
);

const LanternIcon = () => (
  <svg className="w-8 h-8 text-[#C9A227]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M50 12 L50 22" />
    <circle cx="50" cy="9" r="3" />
    <path d="M50 22 C35 32, 30 46, 30 60 L70 60 C70 46, 65 32, 50 22 Z" />
    <rect x="32" y="60" width="36" height="18" rx="2" />
    <path d="M35 78 L40 88 L60 88 L65 78" />
    <path d="M50 22 L50 60 M40 37 L40 60 M60 37 L60 60" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
  </svg>
);

export default function Homepage({
  currentLang,
  products,
  categories,
  onAddToCart,
  onViewDetails,
  setCurrentPage,
  onSelectCategory,
}: HomepageProps) {
  const t = TRANSLATIONS[currentLang];
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Core search state for direct catalog on Homepage
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const handleCategoryBadgeClick = (cat: string) => {
    onSelectCategory(cat);
    setTimeout(() => {
      const targetSection = document.getElementById(`category-section-${cat}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const catalogEl = document.getElementById('products-catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  const uniqueCategories = useMemo(() => {
    const cats = products.map((p) => p.category);
    const unique = Array.from(new Set(cats));
    const combined = Array.from(new Set([...(categories || []), ...unique]));
    return combined.filter(cat => unique.includes(cat));
  }, [products, categories]);

  // Dynamically compute filtered products for the homepage catalog when searching
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = (currentLang === 'fr' ? p.name_fr : currentLang === 'en' ? p.name_en : p.name_ar).toLowerCase();
        const desc = (currentLang === 'fr' ? p.description_fr : currentLang === 'en' ? p.description_en : p.description_ar).toLowerCase();
        return name.includes(query) || desc.includes(query);
      });
    }

    return result;
  }, [products, searchQuery, currentLang]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const isRTL = currentLang === 'ar';

  return (
    <div className="bg-transparent overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        id="hero-section"
      >
        {/* Subtle geometric lines and traditional zellige/girih patterns */}
        <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.24] pointer-events-none" />
        <div className="absolute inset-0 bg-moroccan-lattice-blue opacity-[0.16] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
        
        {/* Intricate rotating background medallion inspired by Image 1 and 4 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.45] pointer-events-none overflow-hidden select-none">
          <svg className="w-[150%] max-w-[900px] aspect-square text-[#C9A227] animate-spin-slow filter drop-shadow-[0_0_20px_rgba(201,162,39,0.3)]" viewBox="0 0 500 500" fill="none" stroke="currentColor">
            {/* Concentric geometric stars & floral curves simulating Image 1 */}
            <circle cx="250" cy="250" r="240" strokeWidth="1.5" strokeDasharray="5,5" />
            <circle cx="250" cy="250" r="220" strokeWidth="2.5" />
            
            {/* 16-point star lattice lines (Image 2/3) */}
            {[...Array(16)].map((_, idx) => (
              <line 
                key={idx} 
                x1="250" 
                y1="10" 
                x2="250" 
                y2="490" 
                transform={`rotate(${idx * 11.25} 250 250)`} 
                strokeWidth="0.75" 
                opacity="0.5" 
              />
            ))}
            
            {/* Overlapping polygons of Girih style (Image 2/3) */}
            <rect x="100" y="100" width="300" height="300" transform="rotate(0 250 250)" strokeWidth="1.5" />
            <rect x="100" y="100" width="300" height="300" transform="rotate(22.5 250 250)" strokeWidth="1.5" />
            <rect x="100" y="100" width="300" height="300" transform="rotate(45 250 250)" strokeWidth="1.5" />
            <rect x="100" y="100" width="300" height="300" transform="rotate(67.5 250 250)" strokeWidth="1.5" />
            
            {/* Elegant Arabesque scrolls in concentric paths */}
            <circle cx="250" cy="250" r="160" strokeWidth="2" />
            <circle cx="250" cy="250" r="100" strokeWidth="2.5" strokeDasharray="10,5" />
            
            {/* Inner rosette */}
            <polygon points="250,190 268,232 310,250 268,268 250,310 232,268 190,250 232,232" strokeWidth="2.5" />
            <circle cx="250" cy="250" r="20" fill="currentColor" fillOpacity="0.5" />
          </svg>
        </div>

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0F1B2E] via-[#0F1B2E]/50 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F1B2E] via-[#0F1B2E]/50 to-transparent z-10" />

        <div className="max-w-4xl mx-auto px-4 text-center z-20 space-y-6 relative">
          
          {/* Logo element on Hero */}
          <div className="inline-flex flex-col items-center select-none py-1 animate-fade-in-down">
            <svg 
              className="w-14 h-16 text-[#C9A227] filter drop-shadow-lg" 
              viewBox="0 0 100 120" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4"
            >
              <path d="M50 15 C30 15, 20 30, 25 50 C20 55, 18 62, 18 70 L18 105 L82 105 L82 70 C82 62, 80 55, 75 50 C80 30, 70 15, 50 15 Z" />
              <path d="M50 25 C37 25, 30 35, 33 48 C29 52, 28 57, 28 62 L28 95 L72 95 L72 62 C72 57, 71 52, 67 48 C70 35, 63 25, 50 25 Z" strokeWidth="2" opacity="0.6"/>
            </svg>
            <div className="mt-2 filter drop-shadow-[0_2px_8px_rgba(10,17,32,0.95)]">
              <span className="font-sans font-black tracking-[0.1em] text-[#C9A227] text-2xl sm:text-4xl leading-none block uppercase">
                MAGASHOP SOUVENIRS
              </span>
              <span className={`${currentLang === 'ar' ? 'font-serif' : 'font-sans'} text-[11px] sm:text-[13px] text-white tracking-[0.45em] font-light leading-none block mt-1.5 uppercase`}>
                {currentLang === 'ar' ? 'بازار السوفنيرز المتميز' : 'SOUVENIRS'}
              </span>
            </div>
          </div>

          <RosetteDivider />

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto drop-shadow-[0_4px_12px_rgba(10,17,32,0.95)]">
            {t.tagline}
          </h2>

          <p className="text-white font-medium text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(10,17,32,0.95)]">
            {currentLang === 'fr' 
              ? 'Laiton ciselé, céramique marocaine et poteries traditionnelles. Rapportez un morceau du patrimoine impérial marocain chez vous.' 
              : currentLang === 'en'
              ? 'Chiseled brass, Moroccan ceramics, and traditional pottery. Take home a beautiful piece of imperial Moroccan heritage.'
              : 'نحاس منقوش، فخار مغربي فاخر، وزليج تقليدي أصيل. احصل على قطعة مميزة تجسد التراث العريق للمغرب.'}
          </p>

          <div className="pt-4">
            <button
              onClick={() => {
                onSelectCategory('all');
                setTimeout(() => {
                  const catalogEl = document.getElementById('products-catalog');
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold uppercase tracking-widest text-xs py-3.5 px-8 rounded-xl shadow-xl transition-all duration-300 border border-[#C9A227] hover:scale-105 active:scale-95"
            >
              {t.discoverCTA}
            </button>
          </div>
        </div>
      </section>


      {/* 2. SPACE (EMPTY) OR GAP */}
      <div className="py-6" />

      {/* 3. PRODUCTS BY CATEGORY */}
      <section id="products-catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="text-center space-y-2">
          <span className="text-xs text-[#C9A227] uppercase tracking-[0.25em] font-bold block">
            {currentLang === 'fr' ? 'Trésors de l\'Atelier' : currentLang === 'en' ? 'Atelier Treasures' : 'روائع المعرض'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] uppercase tracking-wider">
            {currentLang === 'fr' ? 'Notre Catalogue d\'Art' : currentLang === 'en' ? 'Our Art Catalog' : 'كتالوج المنتجات'}
          </h2>
          <div className="h-[1px] w-24 bg-[#C9A227]/30 mx-auto mt-2" />
        </div>

        {/* Search Input Bar (Simple & Uncluttered) */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder={isRTL ? 'البحث عن تحفة...' : currentLang === 'fr' ? 'Rechercher un trésor...' : 'Search for a treasure...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/25 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
        </div>

        {/* Product Catalog Display (Normal View: Categorized Sections) */}
        {products.length === 0 ? (
          <div className="py-20 px-6 text-center max-w-lg mx-auto bg-slate-900/40 border border-[#C9A227]/20 rounded-3xl space-y-6 relative overflow-hidden backdrop-blur-md">
            {/* Ambient gold radial glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
            
            <PackageOpen className="w-16 h-16 text-[#C9A227] mx-auto opacity-70 animate-pulse" />
            
            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#C9A227]">
                {currentLang === 'ar' ? 'المعرض فارغ حالياً' : currentLang === 'fr' ? 'Le catalogue est vide' : 'The catalog is empty'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {currentLang === 'ar' 
                  ? 'يرجى العودة لاحقاً، نحن بصدد تحضير وإضافة مجموعة جديدة ومميزة من التحف التقليدية المغربية الفاخرة.' 
                  : currentLang === 'fr'
                  ? 'Veuillez revenir plus tard, nous préparons une nouvelle collection de chefs-d\'œuvre de l\'artisanat marocain.'
                  : 'Please check back soon! We are preparing a brand new collection of premium Moroccan traditional masterworks.'}
              </p>
            </div>

            {currentUser ? (
              <div className="pt-4 border-t border-[#C9A227]/10 space-y-3">
                <p className="text-xs text-[#C9A227] font-medium">
                  {currentLang === 'ar' 
                    ? 'بصفتك المشرف، يمكنك تهيئة المتجر أو إضافة منتجات جديدة الآن.' 
                    : currentLang === 'fr'
                    ? 'En tant qu\'administrateur, vous pouvez initialiser la base de données ou ajouter des produits.'
                    : 'As the administrator, you can seed the database or start adding new products now.'}
                </p>
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {currentLang === 'ar' ? 'الذهاب للوحة التحكم والتهيئة' : currentLang === 'fr' ? 'Aller au panneau d\'administration' : 'Go to Admin Panel'}
                </button>
              </div>
            ) : null}
          </div>
        ) : !searchQuery.trim() ? (
          // GROUPED BY CATEGORY VIEW
          <div className="space-y-16">
            {uniqueCategories.map((catKey) => {
              // Filter products belonging to this category
              const catProducts = products.filter((p) => p.category === catKey);
              if (catProducts.length === 0) return null;

              // Translate category label
              const catLabel = t[catKey as keyof typeof t] || catKey.toUpperCase();

              return (
                <div key={catKey} id={`category-section-${catKey}`} className="space-y-6 scroll-mt-24">
                  {/* Category Section Title with Arabesque Border */}
                  <div className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C9A227]" />
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#C9A227] uppercase tracking-wider">
                      {catLabel}
                    </h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-[#C9A227]/30 to-transparent" />
                  </div>

                  {/* Products Grid inside Category */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {catProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        currentLang={currentLang}
                        onAddToCart={onAddToCart}
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // FILTERED GRID VIEW (when searching)
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Filter className="w-4 h-4 text-[#C9A227]" />
              <span>
                {isRTL 
                  ? `العثور على ${filteredProducts.length} منتج يطابق خياراتك` 
                  : `Trouvé ${filteredProducts.length} produit(s) correspondant à vos critères`}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-[#0F1B2E]/40 border border-[#C9A227]/15 rounded-2xl">
                <PackageOpen className="w-12 h-12 text-[#C9A227] mx-auto opacity-50 mb-3" />
                <p className="text-sm text-gray-400">
                  {isRTL ? 'لا توجد منتجات تطابق المعايير' : 'Aucun produit ne correspond à vos critères.'}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-xs bg-[#C9A227] text-[#0F1B2E] font-bold px-4 py-2 rounded-xl"
                >
                  {isRTL ? 'إظهار كل المنتجات' : 'Voir tout le catalogue'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    currentLang={currentLang}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </section>

      {/* 5. OUR STORY / CRAFTSMANSHIP */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Story Column */}
          <div className="space-y-6">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <span className="text-xs text-[#C9A227] uppercase tracking-[0.25em] font-bold block mb-2">
                SOUK LHAD AGADIR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#C9A227] tracking-tight">
                {t.storyTitle}
              </h2>
            </div>

            <RosetteDivider />

            <div className={`space-y-4 text-gray-300 text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              <p>{t.storyP1}</p>
              <p>{t.storyP2}</p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setCurrentPage('contact')}
                className="text-xs uppercase font-bold tracking-widest text-[#C9A227] hover:text-white flex items-center gap-2 group transition-colors"
              >
                <span>{currentLang === 'fr' ? 'Visiter notre boutique' : currentLang === 'en' ? 'Visit our shop' : 'تفضل بزيارتنا'}</span>
                <span className={`transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Beautiful Showroom Image of the shop */}
          <div className="relative h-96 rounded-2xl overflow-hidden border border-[#C9A227]/25 shadow-xl group">
            <img 
              src={magashopHero} 
              alt="MAGASHOP Bazar Souvenirs Souk Lhad" 
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Arched Inner Border Frame */}
            <div className="absolute inset-4 border border-[#C9A227]/30 rounded-xl transition-all group-hover:border-[#C9A227] pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 6. WHY SHOP WITH US */}
      <section className="bg-[#0A1120]/75 backdrop-blur-md py-16 border-t border-[#C9A227]/15 relative overflow-hidden">
        {/* Intricate gold Moroccan lattice background (Image 1 and 2) */}
        <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.12] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C9A227] uppercase tracking-wider">
              {t.whyUsTitle}
            </h2>
            <div className="h-[1px] w-20 bg-[#C9A227]/30 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-[#0F1B2E]/50 backdrop-blur-sm border border-[#C9A227]/10 hover:border-[#C9A227]/30 p-6 rounded-2xl text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/5 border border-[#C9A227]/30 flex items-center justify-center mx-auto text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0F1B2E] transition-all duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">{t.feat1Title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t.feat1Desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0F1B2E]/50 backdrop-blur-sm border border-[#C9A227]/10 hover:border-[#C9A227]/30 p-6 rounded-2xl text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/5 border border-[#C9A227]/30 flex items-center justify-center mx-auto text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0F1B2E] transition-all duration-300">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">{t.feat2Title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t.feat2Desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0F1B2E]/50 backdrop-blur-sm border border-[#C9A227]/10 hover:border-[#C9A227]/30 p-6 rounded-2xl text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/5 border border-[#C9A227]/30 flex items-center justify-center mx-auto text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0F1B2E] transition-all duration-300">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">{t.feat3Title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t.feat3Desc}</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0F1B2E]/50 backdrop-blur-sm border border-[#C9A227]/10 hover:border-[#C9A227]/30 p-6 rounded-2xl text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/5 border border-[#C9A227]/30 flex items-center justify-center mx-auto text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0F1B2E] transition-all duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">{t.feat4Title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t.feat4Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C9A227] uppercase tracking-wider">
            {t.testimonialsTitle}
          </h2>
          <div className="h-[1px] w-20 bg-[#C9A227]/30 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test) => {
            const text = currentLang === 'fr' ? test.text_fr : currentLang === 'en' ? test.text_en : test.text_ar;
            return (
              <div 
                key={test.id} 
                className="bg-slate-900/40 border border-[#C9A227]/15 p-6 rounded-2xl relative space-y-4 shadow-md overflow-hidden group hover:border-[#C9A227]/40 transition-colors"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(15, 27, 46, 0.95), rgba(15, 27, 46, 0.98)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' stroke='%23C9A227' stroke-opacity='0.05' fill='none'/%3E%3C/svg%3E")`
                }}
              >
                {/* Gold Stars */}
                <div className="flex text-[#C9A227]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic font-sans">
                  "{text}"
                </p>

                <div className="pt-2 border-t border-[#C9A227]/10 flex items-center justify-between">
                  <div>
                    <span className="block font-semibold text-[#C9A227] text-xs uppercase tracking-wider">{test.name}</span>
                    <span className="block text-[10px] text-gray-500">{test.country}</span>
                  </div>
                  <span className="text-[10px] text-gray-600">{test.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY FEED */}
      <section className="bg-[#0A1120]/75 backdrop-blur-md py-16 border-t border-[#C9A227]/15 relative overflow-hidden shadow-blue-glow">
        {/* Intricate cobalt blue zellige pattern (Image 3 and 4) */}
        <div className="absolute inset-0 bg-moroccan-lattice-blue opacity-[0.1] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C9A227] uppercase tracking-wider flex items-center justify-center gap-2">
              <Instagram className="w-6 h-6 text-[#C9A227]" />
              <span>{t.instagramFeedTitle}</span>
            </h2>
            <a 
              href="https://instagram.com/magashop_souvenirs" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#C9A227] text-xs font-mono font-bold tracking-wider hover:underline inline-block"
            >
              {t.instagramHandle}
            </a>
            <div className="h-[1px] w-20 bg-[#C9A227]/30 mx-auto mt-2" />
          </div>

          {/* Grid of lifestyle photos */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {INSTAGRAM_FEED.map((item) => (
              <a 
                key={item.id} 
                href="https://instagram.com/magashop_souvenirs" 
                target="_blank" 
                rel="noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-[#C9A227]/10 block"
              >
                <img 
                  src={item.image} 
                  alt="Instagram Post" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0F1B2E]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10 text-xs font-semibold text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-sky-400" />
                    <span>{item.comments}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER SIGNUP */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div 
          className="bg-[#0A1120]/75 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-[#C9A227]/25 relative overflow-hidden shadow-2xl text-center space-y-6"
          id="newsletter-container"
        >
          {/* Decorative Corner Accent: Dot Grids */}
          <div className="absolute top-4 left-4">
            <DotGrid />
          </div>
          <div className="absolute bottom-4 right-4 rotate-180">
            <DotGrid />
          </div>

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#C9A227] uppercase tracking-wider leading-tight">
              {t.newsletterTitle}
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              {t.newsletterDesc}
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="p-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl text-[#C9A227] text-xs font-semibold max-w-md mx-auto animate-pulse">
              {t.successSubscribe}
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2 relative z-10">
              <input
                type="email"
                required
                placeholder={t.newsletterInput}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-[#0F1B2E]/60 border border-[#C9A227]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-all"
              />
              <button
                type="submit"
                className="bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold uppercase tracking-widest text-xs px-6 py-3.5 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.subscribe}</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
