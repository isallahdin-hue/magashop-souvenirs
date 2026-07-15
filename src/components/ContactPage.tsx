import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { DotGrid } from './Header';

interface ContactPageProps {
  currentLang: Language;
}

export default function ContactPage({ currentLang }: ContactPageProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  return (
    <div className="bg-transparent text-white min-h-screen py-10 relative overflow-hidden">
      {/* Intricate gold Moroccan lattice background (Image 1 and 2) */}
      <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.08] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs text-[#C9A227] tracking-[0.25em] uppercase font-bold block">
            {t.shopName}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] uppercase tracking-wider">
            {t.contact}
          </h1>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-2" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Address and details (Left 2 cols) */}
          <div className="lg:col-span-2 bg-[#0A1120]/60 backdrop-blur-sm border border-[#C9A227]/15 rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
            
            {/* Decorative dot grid */}
            <div className="absolute top-4 right-4">
              <DotGrid />
            </div>

            <div className={`space-y-6 relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
              
              {/* Address details */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[#C9A227]">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-sm uppercase tracking-wider">{t.addressTitle}</h3>
                </div>
                <div className="text-xs sm:text-sm text-gray-300 space-y-1 pl-8">
                  <p className="font-semibold text-white">MAGASHOP SOUVENIRS</p>
                  <p>Sijil Massa, Souk El Had, Porte N°3</p>
                  <p>Agadir 80000, Maroc</p>
                  <p className="font-sans text-[11px] text-[#C9A227] mt-1" dir="rtl">
                    MAGASHOP SOUVENIRS، سجل ماسة، سوق الحد، باب رقم 3، أكادير 80000
                  </p>
                </div>
              </div>

              {/* Operating hours */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[#C9A227]">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-sm uppercase tracking-wider">{t.hoursTitle}</h3>
                </div>
                <div className="text-xs sm:text-sm text-gray-300 pl-8 space-y-1">
                  <p className="font-semibold text-white">{t.hoursDetails}</p>
                  <p className="text-gray-500">
                    {currentLang === 'fr' 
                      ? '*Le lundi est le jour de fermeture hebdomadaire de l\'ensemble du Souk Lhad.' 
                      : currentLang === 'en'
                      ? '*Monday is the weekly closing day of the entire Souk Lhad.'
                      : '*يوم الإثنين هو يوم الإغلاق الأسبوعي لسوق الأحد بأكمله.'}
                  </p>
                </div>
              </div>

              {/* Contact numbers */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[#C9A227]">
                  <Phone className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-sm uppercase tracking-wider">{t.phoneTitle}</h3>
                </div>
                <div className="text-xs sm:text-sm text-gray-300 pl-8 space-y-2">
                  <div>
                    <span className="block font-semibold text-white">
                      {currentLang === 'ar' ? 'هشام' : 'Hicham'}
                    </span>
                    <a href="tel:+212661443259" className="hover:text-[#C9A227] transition-colors">0661443259 / +212 661 443259</a>
                  </div>
                  <div>
                    <span className="block font-semibold text-white">WhatsApp</span>
                    <a href="https://wa.me/212661443259" target="_blank" rel="noreferrer" className="hover:text-[#C9A227] transition-colors font-mono font-bold">0661443259</a>
                  </div>
                  <div>
                    <span className="block font-semibold text-white">{currentLang === 'fr' ? 'Email de Contact' : 'Contact Email'}</span>
                    <a href="mailto:magashopsouvenirs@gmail.com" className="hover:text-[#C9A227] transition-colors break-all">magashopsouvenirs@gmail.com</a>
                  </div>
                </div>
              </div>

              {/* Click-to-chat WhatsApp button */}
              <div className="pt-4">
                <a
                  href="https://wa.me/212661443259"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.957 11.5.957c-5.442 0-9.866 4.372-9.87 9.802 0 1.905.525 3.76 1.517 5.372l-.993 3.626 3.74-.973zm11.398-7.384c-.312-.156-1.847-.91-2.128-1.012-.282-.102-.487-.153-.69.153-.205.307-.795.998-.973 1.201-.178.204-.357.228-.669.072-1.395-.7-2.34-1.258-3.262-2.845-.24-.413.24-.383.687-1.272.078-.156.039-.293-.02-.397-.059-.104-.487-1.173-.668-1.609-.176-.425-.37-.366-.508-.373-.13-.005-.28-.006-.43-.006-.15 0-.395.056-.603.282-.207.227-.792.774-.792 1.888s.81 2.19.922 2.344c.112.155 1.594 2.435 3.862 3.415 1.348.58 2.395.922 3.218 1.183.83.263 1.585.226 2.182.137.665-.1 1.847-.756 2.11-1.487.262-.731.262-1.356.184-1.488-.078-.13-.282-.207-.594-.363z"/>
                  </svg>
                  <span>{t.chatWhatsApp}</span>
                </a>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#C9A227]/10">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{currentLang === 'fr' ? 'Réseaux' : 'Socials'}:</span>
                <a 
                  href="https://facebook.com/profile.php?id=61573562521782" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-[#C9A227] transition-colors"
                >
                  <Facebook className="w-4 h-4 text-[#C9A227]" />
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://instagram.com/magashop_souvenirs" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-[#C9A227] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#C9A227]" />
                  <span>Instagram</span>
                </a>
              </div>

            </div>

          </div>

          {/* Map display column (Right 3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/40 border border-[#C9A227]/15 rounded-2xl overflow-hidden h-[450px] lg:h-full min-h-[400px] relative">
            <iframe
              title="Magashop Souvenirs Map - Souk Lhad Agadir"
              src="https://maps.google.com/maps?q=MAGASHOP%20SOUVENIRS%2C%20%D8%B3%D8%AC%D9%84%20%D9%85%D8%A7%D8%B3%D8%A9%D8%8C%20%D8%B3%D9%88%D9%82%20%D8%A7%D9%84%D8%AD%D8%AF%D9%8E%D8%8C%20%D8%A8%D8%A7%D8%A8%20%D8%B1%D9%82%D9%85%203%2C%20Agadir%2080000&t=&z=17&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              allowFullScreen={false}
              loading="lazy"
            />
            {/* Overlay map label */}
            <div className="absolute bottom-4 left-4 bg-[#0F1B2E]/90 backdrop-blur-md border border-[#C9A227]/30 p-3.5 rounded-xl max-w-xs text-xs space-y-1.5 text-left">
              <span className="font-bold text-[#C9A227] block">Souk Lhad - Gate 3</span>
              <p className="text-gray-300 leading-snug font-sans">
                {currentLang === 'fr' 
                  ? 'Entrez par la Porte N°3, nous sommes situés près de la section artisanale Sijil Massa.' 
                  : currentLang === 'en'
                  ? 'Enter via Gate N°3, we are located near the Sijil Massa handicraft section.'
                  : 'ادخل من الباب رقم 3، نحن نتواجد بالقرب من جناح الصناعة التقليدية سجل ماسة.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
