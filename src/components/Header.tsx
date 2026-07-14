import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  onCartToggle: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Header({
  currentLang,
  setLang,
  cartCount,
  onCartToggle,
  currentPage,
  setCurrentPage,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const handleNav = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'story', label: t.ourStory },
    { id: 'contact', label: t.contact },
    { id: 'admin', label: currentLang === 'ar' ? 'لوحة التحكم' : currentLang === 'fr' ? 'Admin' : 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full select-none" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* 1. ELEGANT BOUTIQUE ANNOUNCEMENT BAR */}
      <div className="bg-[#0A1120] border-b border-[#C9A227]/30 text-[11px] py-2 text-center text-white font-medium relative overflow-hidden tracking-widest">
        {/* Subtle glowing gold line animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent animate-pulse pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 relative z-10">
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#C9A227] shadow-[0_0_6px_#C9A227]" />
          <p className={`${currentLang === 'ar' ? 'font-serif text-xs' : 'font-sans'} text-[#F3EFE0] opacity-95`}>
            {currentLang === 'ar' 
              ? '✨ شحن مجاني لكافة الطلبات داخل المغرب • منتجات يدوية أصيلة من كافة أنحاء المملكة' 
              : currentLang === 'fr'
              ? '✨ Livraison gratuite pour toutes les commandes au Maroc • Artisanat d\'exception fait main'
              : '✨ Free shipping on all orders in Morocco • Exquisite Handcrafted Treasures'
            }
          </p>
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#C9A227] shadow-[0_0_6px_#C9A227]" />
        </div>
      </div>

      {/* 2. LUXURIOUS MAIN NAVIGATION BAR */}
      <div className="bg-[#0F1B2E]/90 backdrop-blur-xl border-b border-[#C9A227]/20 shadow-2xl relative">
        {/* Fine gold horizontal highlights mimicking traditional brass inlay */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#C9A227]/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="flex items-center justify-between">
            
            {/* Left side: Luxury Language Switcher (Desktop) or Burger Menu (Mobile) */}
            <div className="flex items-center gap-4">
              {/* Mobile menu trigger button with authentic gold trim */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#C9A227] hover:bg-[#C9A227]/10 rounded-full transition-all duration-300 border border-[#C9A227]/20 active:scale-95"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {/* Minimalist boutique-style Language Selector (Desktop) */}
              <div className="hidden md:flex items-center gap-3 text-xs tracking-widest font-semibold text-gray-300">
                {(['ar', 'fr', 'en'] as Language[]).map((lang, idx) => (
                  <React.Fragment key={lang}>
                    {idx > 0 && <span className="text-[#C9A227]/30 select-none">•</span>}
                    <button
                      onClick={() => setLang(lang)}
                      className={`hover:text-[#C9A227] transition-all duration-300 relative py-1 ${
                        currentLang === lang 
                          ? 'text-[#C9A227] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#C9A227]' 
                          : 'text-gray-400 font-medium'
                      }`}
                    >
                      {lang === 'ar' ? 'العربية' : lang === 'fr' ? 'FR' : 'EN'}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Middle: Brand Logo Concept (Inspired by a Moroccan Riad archway) */}
            <div 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-3 cursor-pointer select-none py-1 group"
            >
              <div className="relative flex items-center justify-center">
                {/* Rotating geometric brass star outline behind the logo */}
                <div className="absolute w-10 h-10 border border-[#C9A227]/25 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-1000 ease-out" />
                <div className="absolute w-10 h-10 border border-[#C9A227]/15 rounded-sm rotate-12 group-hover:rotate-45 transition-transform duration-1000 ease-out" />
                
                {/* Finely sculpted keyhole arch icon */}
                <svg 
                  className="w-7 h-8 text-[#C9A227] transition-transform duration-500 group-hover:scale-110 filter drop-shadow-[0_0_4px_rgba(201,162,39,0.3)] z-10" 
                  viewBox="0 0 100 120" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="6"
                >
                  <path d="M50 15 C30 15, 20 30, 25 50 C20 55, 18 62, 18 70 L18 105 L82 105 L82 70 C82 62, 80 55, 75 50 C80 30, 70 15, 50 15 Z" />
                  <path d="M50 25 C37 25, 30 35, 33 48 C29 52, 28 57, 28 62 L28 95 L72 95 L72 62 C72 57, 71 52, 67 48 C70 35, 63 25, 50 25 Z" strokeWidth="2.5" opacity="0.6"/>
                </svg>
              </div>
              <div className="text-start">
                <span className="font-sans text-lg sm:text-xl font-black tracking-[0.05em] text-[#C9A227] leading-none block">
                  MAGASHOP souvenirs
                </span>
                <span className="text-[9px] text-gray-300 tracking-[0.3em] font-light leading-none block mt-1 uppercase opacity-80">
                  {currentLang === 'ar' ? 'روائع الصناعة التقليدية' : 'SOUVENIRS DE PRESTIGE'}
                </span>
              </div>
            </div>

            {/* Right Side: Desktop Navigation Links & Fine-Line Shopping Cart */}
            <div className="flex items-center gap-7">
              {/* DESKTOP NAVIGATION */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`text-xs tracking-widest font-semibold transition-all duration-300 relative py-2 uppercase cursor-pointer ${
                        currentLang === 'ar' ? 'font-serif text-base' : 'font-sans'
                      } ${
                        isActive 
                          ? 'text-[#C9A227] font-bold' 
                          : 'text-gray-300 hover:text-white hover:scale-105'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-[#C9A227] shadow-[0_0_6px_#C9A227]" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Ornate Shopping Cart Button */}
              <button
                onClick={onCartToggle}
                className="relative p-2.5 text-[#C9A227] hover:bg-[#C9A227]/15 rounded-full transition-all duration-300 border border-[#C9A227]/25 bg-[#0F1B2E]/50 hover:scale-105 shadow-md group"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-[#0F1B2E] bg-gradient-to-r from-[#C9A227] to-[#DFB93C] rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)] animate-pulse border border-[#0F1B2E]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION MENU WITH RICH MOROCCAN MOSAIC FEEL */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-moroccan border-b border-[#C9A227]/30 py-6 px-6 space-y-6 shadow-2xl relative overflow-hidden animate-fade-in z-40">
          {/* Authentic Morrocan details */}
          <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[#0F1B2E]/95 z-[-1]" />
          
          <nav className="flex flex-col gap-2 relative z-10">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-lg tracking-widest font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-between border ${
                    currentLang === 'ar' ? 'font-serif text-right flex-row-reverse' : 'font-sans text-left'
                  } ${
                    isActive 
                      ? 'text-[#C9A227] bg-[#C9A227]/10 border-[#C9A227]/30 shadow-md' 
                      : 'text-gray-300 border-transparent hover:text-white hover:bg-[#C9A227]/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="w-2 h-2 rotate-45 bg-[#C9A227] shadow-[0_0_6px_#C9A227]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rotate-45 bg-gray-600 opacity-45" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Language Selector inside Mobile Drawer */}
          <div className="pt-5 border-t border-[#C9A227]/20 flex flex-col gap-3 relative z-10">
            <span className={`text-[10px] text-[#C9A227] uppercase tracking-[0.25em] font-bold ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
              {currentLang === 'ar' ? 'اختر اللغة / Choisir la langue' : 'Select Language'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLang(lang);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2.5 px-3 text-xs rounded-xl font-bold border transition-all duration-300 ${
                    currentLang === lang
                      ? 'bg-[#C9A227] text-[#0F1B2E] border-[#C9A227] shadow-lg scale-102'
                      : 'bg-[#0F1B2E]/60 text-gray-300 border-[#C9A227]/15 hover:bg-[#C9A227]/10'
                  }`}
                >
                  {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function RosetteDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C9A227]/40 to-[#C9A227]" />
      <svg className="w-8 h-8 text-[#C9A227] animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Outer 8-point geometric star */}
        <path d="M 50,2 L 64,36 L 98,50 L 64,64 L 50,98 L 36,64 L 2,50 L 36,36 Z" strokeWidth="2" strokeLinejoin="miter" />
        {/* Overlapping rotated elegant frame */}
        <path d="M 50,16 L 73,27 L 84,50 L 73,73 L 50,84 L 27,73 L 16,50 L 27,27 Z" strokeWidth="1.2" strokeDasharray="3,2" />
        {/* Inner concentric octagram stars */}
        <rect x="30" y="30" width="40" height="40" transform="rotate(0 50 50)" strokeWidth="1.2" />
        <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" strokeWidth="1" opacity="0.8" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-[#C9A227]/40 to-[#C9A227]" />
    </div>
  );
}

export function DotGrid() {
  return (
    <div className="grid grid-cols-6 gap-1.5 opacity-40">
      {[...Array(24)].map((_, i) => (
        <div key={i} className="w-1 h-1 rounded-full bg-[#C9A227]" />
      ))}
    </div>
  );
}
