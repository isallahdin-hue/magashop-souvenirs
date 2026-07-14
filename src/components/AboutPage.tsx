import React from 'react';
import { ShieldCheck, Sparkles, Award, Star, History, Users } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { TESTIMONIALS, CRAFTING_GALLERY } from '../data';
import { RosetteDivider, DotGrid } from './Header';
import magashopHero from '../assets/images/magashop_hero_1783861535659.jpg';

interface AboutPageProps {
  currentLang: Language;
}

export default function AboutPage({ currentLang }: AboutPageProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  return (
    <div className="bg-transparent text-white min-h-screen py-12 relative overflow-hidden">
      {/* Intricate gold Moroccan lattice background */}
      <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.08] pointer-events-none" />
      <div className="absolute inset-0 bg-moroccan-lattice-blue opacity-[0.05] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* 1. Page Header */}
        <div className="text-center space-y-4">
          <span className="text-xs text-[#C9A227] tracking-[0.25em] uppercase font-bold block">
            {t.shopName}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#C9A227] uppercase tracking-wider">
            {t.ourStory}
          </h1>
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-2" />
        </div>

        {/* 2. Heritage / Story Section */}
        <section className="bg-[#0A1120]/65 backdrop-blur-md rounded-2xl p-8 sm:p-12 border border-[#C9A227]/20 shadow-2xl relative">
          <div className="absolute top-4 left-4">
            <DotGrid />
          </div>
          <div className="absolute bottom-4 right-4 rotate-180">
            <DotGrid />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 text-[#C9A227]">
                <History className="w-6 h-6" />
                <span className="text-xs sm:text-sm uppercase tracking-widest font-black font-sans">
                  {currentLang === 'fr' ? 'Notre Héritage' : currentLang === 'en' ? 'Our Heritage' : 'إرثنا العريق'}
                </span>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C9A227]">
                {t.storyTitle}
              </h2>
              
              <RosetteDivider />
              
              <div className={`space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                <p>{t.storyP1}</p>
                <p>{t.storyP2}</p>
                <p>
                  {currentLang === 'fr' 
                    ? 'Chaque création est le fruit d\'heures de travail minutieux. Nous collaborons directement avec les familles d\'artisans à travers le Royaume pour préserver ce patrimoine immatériel inestimable et assurer un commerce équitable.'
                    : currentLang === 'en'
                    ? 'Each creation is the result of hours of meticulous work. We collaborate directly with artisan families across the Kingdom to preserve this invaluable intangible heritage and ensure fair trade.'
                    : 'إن كل قطعة نقدمها لكم هي نتاج ساعات طوال من العمل الدقيق والصبر الجميل. نحن نعمل جنباً إلى جنب مع العائلات الحرفية بمختلف ربوع المملكة للحفاظ على هذا التراث اللامادي العريق وضمان دخل عادل ومستدام للصناع التقليديين.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Image Frame with Golden Borders */}
              <div className="relative rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-2xl aspect-square">
                <img 
                  src={magashopHero} 
                  alt="Magashop Heritage" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B2E] via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Elegant floating overlay */}
              <div className={`absolute -bottom-6 ${isRTL ? '-left-6' : '-right-6'} bg-[#0F1B2E] border border-[#C9A227]/30 p-4 rounded-xl shadow-xl max-w-[200px] hidden sm:block`}>
                <div className="flex items-center gap-2.5">
                  <Award className="w-8 h-8 text-[#C9A227] shrink-0" />
                  <div>
                    <span className="block text-xs font-black text-[#C9A227] uppercase tracking-wider">
                      {currentLang === 'fr' ? '100% Authentique' : currentLang === 'en' ? '100% Authentic' : 'أصلي 100%'}
                    </span>
                    <span className="block text-[9px] text-gray-400">
                      {currentLang === 'fr' ? 'Artisanat Marocain' : currentLang === 'en' ? 'Moroccan Craft' : 'صناعة مغربية تقليدية'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 4. Testimonials Block */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#C9A227] mb-2">
              <Users className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-black font-sans">
                {currentLang === 'fr' ? 'Avis Clients' : currentLang === 'en' ? 'Happy Customers' : 'آراء زوارنا'}
              </span>
            </div>
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
                  className="bg-[#0A1120]/40 border border-[#C9A227]/15 p-6 rounded-2xl relative space-y-4 shadow-md overflow-hidden group hover:border-[#C9A227]/40 transition-colors"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15, 27, 46, 0.95), rgba(15, 27, 46, 0.98)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' stroke='%23C9A227' stroke-opacity='0.05' fill='none'/%3E%3C/svg%3E")`
                  }}
                >
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

      </div>
    </div>
  );
}
