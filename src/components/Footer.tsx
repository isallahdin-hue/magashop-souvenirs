import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, ShieldCheck, Award } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface FooterProps {
  currentLang: Language;
  setCurrentPage: (page: string) => void;
  onSelectCategory: (category: string) => void;
}

export default function Footer({ currentLang, setCurrentPage, onSelectCategory }: FooterProps) {
  const t = TRANSLATIONS[currentLang];

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    setCurrentPage('home');
    setTimeout(() => {
      const catalogEl = document.getElementById('featured-categories');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const isRTL = currentLang === 'ar';

  return (
    <footer className="bg-[#0A1120]/85 backdrop-blur-md text-gray-300 relative border-t border-[#C9A227]/20">
      
      {/* Repeating thin gold zellige border pattern at the very top of the footer */}
      <div className="w-full h-3 bg-transparent overflow-hidden relative border-b border-[#C9A227]/30">
        <div 
          className="absolute inset-0 opacity-50" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12' viewBox='0 0 24 12' fill='none'%3E%3Cpath d='M0 6 L6 0 L12 6 L6 12 Z M12 6 L18 0 L24 6 L18 12 Z' stroke='%23C9A227' stroke-width='1'/%3E%3Ccircle cx='6' cy='6' r='1.5' fill='%23C9A227'/%3E%3Ccircle cx='18' cy='6' r='1.5' fill='%23C9A227'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x'
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-start'} select-none`}>
              <svg 
                className="w-7 h-8 text-[#C9A227]" 
                viewBox="0 0 100 120" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              >
                <path d="M50 15 C30 15, 20 30, 25 50 C20 55, 18 62, 18 70 L18 105 L82 105 L82 70 C82 62, 80 55, 75 50 C80 30, 70 15, 50 15 Z" />
                <path d="M50 25 C37 25, 30 35, 33 48 C29 52, 28 57, 28 62 L28 95 L72 95 L72 62 C72 57, 71 52, 67 48 C70 35, 63 25, 50 25 Z" strokeWidth="2" opacity="0.6"/>
              </svg>
              <div className="mt-1">
                <span className="font-sans font-black tracking-[0.15em] text-[#C9A227] text-md leading-none block">
                  MAGASHOP
                </span>
                <span className="font-sans text-[8px] text-white tracking-[0.3em] font-light leading-none block mt-0.5 uppercase">
                  SOUVENIRS
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mt-3">
              {currentLang === 'fr' 
                ? 'Créateurs d\'émotions artisanales à Agadir. Spécialisés dans les pièces d\'exception ornées du traditionnel zellige géométrique marocain.' 
                : currentLang === 'en'
                ? 'Creators of artisanal emotions in Agadir. Specializing in exceptional pieces adorned with traditional geometric Moroccan zellige.'
                : 'صناع المشاعر الأصيلة بأكادير. متخصصون في التحف الفاخرة المزينة بالزليج الهندسي المغربي الأصيل.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com/profile.php?id=61573562521782" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0F1B2E] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/magashop_souvenirs" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0F1B2E] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="space-y-4">
            <h3 className="text-[#C9A227] font-semibold text-sm tracking-wider uppercase border-b border-[#C9A227]/20 pb-2">
              {currentLang === 'fr' ? 'Catégories' : currentLang === 'en' ? 'Categories' : 'التصنيفات'}
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => handleCategoryClick('ceramics')} className="hover:text-[#C9A227] transition-colors">
                  {t.ceramics}
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('lanterns')} className="hover:text-[#C9A227] transition-colors">
                  {t.lanterns}
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('tea')} className="hover:text-[#C9A227] transition-colors">
                  {t.tea}
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('mirrors')} className="hover:text-[#C9A227] transition-colors">
                  {t.mirrors}
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('boxes')} className="hover:text-[#C9A227] transition-colors">
                  {t.boxes}
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('perfumes')} className="hover:text-[#C9A227] transition-colors">
                  {t.perfumes}
                </button>
              </li>
              <li className="pt-2 border-t border-[#C9A227]/10 mt-2">
                <button 
                  onClick={() => {
                    setCurrentPage('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-[#C9A227] hover:underline font-bold text-xs"
                >
                  {currentLang === 'ar' ? '⚙️ لوحة التحكم' : currentLang === 'en' ? '⚙️ Admin Panel' : '⚙️ Espace Admin'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-[#C9A227] font-semibold text-sm tracking-wider uppercase border-b border-[#C9A227]/20 pb-2">
              Contact & Souk Lhad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
              <div className="space-y-3">
                <a 
                  href="https://wa.me/212661443259" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-start gap-2.5 hover:text-[#C9A227] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-semibold text-white">WhatsApp & GSM</span>
                    <span>0661443259</span>
                  </div>
                </a>
                <a 
                  href="mailto:magashopsouvenirs@gmail.com" 
                  className="flex items-start gap-2.5 hover:text-[#C9A227] transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-semibold text-white">Email</span>
                    <span className="break-all">magashopsouvenirs@gmail.com</span>
                  </div>
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">Adresse / العنوان</span>
                    <span className="block text-[11px] leading-relaxed">
                      Souk Lhad Agadir, Port N°3, Sijil Massa
                    </span>
                    <span className="block text-[11px] font-sans mt-0.5" dir="rtl">
                      سوق الأحد أكادير باب رقم 3 سجل ماسة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Divider line */}
        <div className="border-t border-[#C9A227]/10 my-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Magashop Souvenirs. All Rights Reserved. Crafted with traditional Zellige passion.
          </p>

          {/* Payment icons & Trust badges */}
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-1.5 text-[10px] border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 px-2 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Paiement Sécurisé</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] border border-[#C9A227]/20 bg-[#C9A227]/5 text-[#C9A227] px-2 py-1 rounded">
              <Award className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Artisanat Certifié</span>
            </div>
            {/* Payment Systems Icons (simulated clean text badges) */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] bg-gray-900 border border-gray-800 text-gray-400 px-1 rounded">VISA</span>
              <span className="font-mono text-[9px] bg-gray-900 border border-gray-800 text-gray-400 px-1 rounded">MC</span>
              <span className="font-mono text-[9px] bg-gray-900 border border-gray-800 text-gray-400 px-1 rounded">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
