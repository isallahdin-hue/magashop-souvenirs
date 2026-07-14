import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, ChevronRight, Scale, Move, Hammer } from 'lucide-react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { RosetteDivider } from './Header';

interface ProductDetailPageProps {
  product: Product;
  products: Product[];
  currentLang: Language;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductDetailPage({
  product,
  products,
  currentLang,
  onAddToCart,
  onBack,
  onViewProduct,
}: ProductDetailPageProps) {
  const t = TRANSLATIONS[currentLang];
  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showDirectBuyModal, setShowDirectBuyModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');

  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
    setShowDirectBuyModal(false);
    setBuyerName('');
  }, [product]);

  const productName = currentLang === 'fr' 
    ? product.name_fr 
    : currentLang === 'en' 
    ? product.name_en 
    : product.name_ar;

  const productDesc = currentLang === 'fr' 
    ? product.description_fr 
    : currentLang === 'en' 
    ? product.description_en 
    : product.description_ar;

  const productMaterial = currentLang === 'fr' 
    ? product.material_fr 
    : currentLang === 'en' 
    ? product.material_en 
    : product.material_ar;

  const isRTL = currentLang === 'ar';

  const eurPrice = (product.price * 0.091).toFixed(1);
  const usdPrice = (product.price * 0.098).toFixed(1);

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDirectWhatsAppBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) return;

    const isRTL = currentLang === 'ar';
    let message = '';

    const name = currentLang === 'fr' 
      ? product.name_fr 
      : currentLang === 'en' 
      ? product.name_en 
      : product.name_ar;

    if (isRTL) {
      message = `🧾 *طلب شراء مباشر - MAGASHOP* 🧾\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👤 *الزبون:* ${buyerName}\n\n`;
      message += `📦 *المنتج المطلوب:*\n`;
      message += `• *${name}*\n  (الكمية: ${quantity}) ➔ ${product.price * quantity} درهم\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *المجموع الإجمالي:* *${product.price * quantity} درهم مغربي*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💬 *شكراً لتسوقكم! نتطلع لتأكيد طلبكم وتوصيله.*`;
    } else {
      message = `🧾 *ACHAT DIRECT - MAGASHOP* 🧾\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👤 *Client :* ${buyerName}\n\n`;
      message += `📦 *Produit demandé :*\n`;
      message += `• *${name}*\n  (Qté: ${quantity}) ➔ ${product.price * quantity} MAD\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *TOTAL COMMANDE :* *${product.price * quantity} MAD*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💬 *Merci pour votre confiance ! Nous finalisons l'expédition ensemble.*`;
    }

    const encodedMessage = encodeURIComponent(message);
    const targetUrl = `https://wa.me/212661443259?text=${encodedMessage}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setShowDirectBuyModal(false);
  };

  return (
    <div className="bg-transparent text-white min-h-screen py-8 relative overflow-hidden">
      {/* Intricate gold Moroccan lattice background (Image 1 and 2) */}
      <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.08] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[#C9A227] hover:text-white transition-colors group"
          >
            <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="uppercase tracking-wider text-xs font-semibold">
              {currentLang === 'fr' ? 'Retour aux produits' : currentLang === 'en' ? 'Back to products' : 'الرجوع للمنتجات'}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <span>{t.home}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            <span>{currentLang === 'fr' ? 'Collection' : currentLang === 'en' ? 'Collection' : 'المعروضات'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[#C9A227] truncate max-w-[150px]">{productName}</span>
          </div>
        </div>

        {/* Core Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/40 rounded-2xl p-6 sm:p-8 border border-[#C9A227]/15 shadow-xl">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-[#C9A227]/20 relative shadow-inner">
              <img
                src={activeImage}
                alt={productName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-[#0F1B2E] text-[#C9A227] border border-[#C9A227]/40 text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded shadow-md">
                {t.badgeHandmade}
              </span>
            </div>

            {/* Thumbnail Row */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border shrink-0 transition-all ${
                      activeImage === img 
                        ? 'border-[#C9A227] ring-1 ring-[#C9A227]' 
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category label */}
              <span className="text-xs uppercase text-[#C9A227] tracking-[0.25em] font-bold block mb-2">
                {product.category}
              </span>

              {/* Product Title */}
              <h1 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-black text-[#C9A227] leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {productName}
              </h1>

              {/* Rating and Reviews summary */}
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-300">
                <div className="flex text-[#C9A227]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#C9A227]' : ''}`} 
                    />
                  ))}
                </div>
                <span className="font-semibold text-white">{product.rating} / 5</span>
                <span className="text-gray-500">|</span>
                <span className="text-xs text-gray-400">Authentic Moroccan Souk Item</span>
              </div>

              {/* Price display */}
              <div className="mt-5 p-4 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-xl inline-block">
                <span className="text-xs text-gray-400 block uppercase tracking-wider">{currentLang === 'fr' ? 'Prix d\'Atelier' : 'Workshop Price'}</span>
                <span className="text-3xl font-black text-[#C9A227] tracking-tight block">{product.price} <span className="text-lg font-serif">MAD</span></span>
                <span className="text-xs text-amber-500 font-bold block mt-1">
                  ≈ {eurPrice} EUR / {usdPrice} USD
                </span>
              </div>

              {/* Localized Authentic Description */}
              <div className="mt-6 space-y-3">
                <h3 className="text-xs uppercase text-[#C9A227] font-bold tracking-wider">{t.authenticDescription}</h3>
                <p className="text-gray-300 text-sm leading-relaxed font-sans">{productDesc}</p>
              </div>
            </div>

            {/* Specifications Box */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-[#C9A227]/10 space-y-3">
              <h3 className="text-xs uppercase text-[#C9A227] font-bold tracking-wider">{t.specifications}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                <div className="flex items-center gap-2 bg-[#0F1B2E]/50 p-2.5 rounded border border-[#C9A227]/5">
                  <Hammer className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <div>
                    <span className="text-gray-500 block leading-tight">{t.material}</span>
                    <span className="font-semibold text-gray-200 block truncate">{productMaterial}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#0F1B2E]/50 p-2.5 rounded border border-[#C9A227]/5">
                  <Move className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <div>
                    <span className="text-gray-500 block leading-tight">{t.dimensions}</span>
                    <span className="font-semibold text-gray-200 block">{product.dimensions}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#0F1B2E]/50 p-2.5 rounded border border-[#C9A227]/5">
                  <Scale className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <div>
                    <span className="text-gray-500 block leading-tight">{t.weight}</span>
                    <span className="font-semibold text-gray-200 block">{product.weight}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-4 border-t border-[#C9A227]/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity input */}
                <div className="flex items-center justify-between border border-gray-700 bg-slate-900 rounded-lg overflow-hidden h-12 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors h-full"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors h-full"
                  >
                    +
                  </button>
                </div>

                {/* Big Main Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-xs rounded-lg shadow border border-gray-700 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-[#C9A227]" />
                  <span>{added ? t.addedToCart : t.addToCart}</span>
                </button>

                {/* Direct WhatsApp Buy */}
                <button
                  onClick={() => setShowDirectBuyModal(true)}
                  className="flex-1 h-12 bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg hover:shadow-[#C9A227]/20 hover:shadow-xl transition-all duration-300 border border-[#C9A227] flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.957 11.5.957c-5.442 0-9.866 4.372-9.87 9.802 0 1.905.525 3.76 1.517 5.372l-.993 3.626 3.74-.973zm11.398-7.384c-.312-.156-1.847-.91-2.128-1.012-.282-.102-.487-.153-.69.153-.205.307-.795.998-.973 1.201-.178.204-.357.228-.669.072-1.395-.7-2.34-1.258-3.262-2.845-.24-.413.24-.383.687-1.272.078-.156.039-.293-.02-.397-.059-.104-.487-1.173-.668-1.609-.176-.425-.37-.366-.508-.373-.13-.005-.28-.006-.43-.006-.15 0-.395.056-.603.282-.207.227-.792.774-.792 1.888s.81 2.19.922 2.344c.112.155 1.594 2.435 3.862 3.415 1.348.58 2.395.922 3.218 1.183.83.263 1.585.226 2.182.137.665-.1 1.847-.756 2.11-1.487.262-.731.262-1.356.184-1.488-.078-.13-.282-.207-.594-.363z"/>
                  </svg>
                  <span>{currentLang === 'ar' ? 'شراء عبر الواتساب' : 'Acheter via WhatsApp'}</span>
                </button>

              </div>

              {/* Secure order statement */}
              <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>{currentLang === 'ar' ? 'ضمان 100% أصلي من أكادير • مساعدة مباشرة عبر واتساب' : 'Garantie 100% Authentique d\'Agadir • Assistance WhatsApp directe'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#C9A227] uppercase tracking-wider text-center mb-1">
              {currentLang === 'fr' ? 'Vous Aimerez Aussi' : currentLang === 'en' ? 'You May Also Like' : 'منتجات قد تعجبك'}
            </h2>
            <div className="flex items-center justify-center">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent my-3" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {relatedProducts.map((p) => {
                const relName = currentLang === 'fr' ? p.name_fr : currentLang === 'en' ? p.name_en : p.name_ar;
                return (
                  <div
                    key={p.id}
                    onClick={() => onViewProduct(p)}
                    className="bg-slate-900/30 rounded-xl p-3 border border-[#C9A227]/10 hover:border-[#C9A227]/40 cursor-pointer transition-all hover:-translate-y-1 group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-950 border border-gray-800">
                      <img 
                        src={p.image} 
                        alt={relName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs text-[#C9A227] uppercase tracking-wider font-semibold">{p.category}</h4>
                      <h3 className="font-serif font-bold text-sm text-white line-clamp-1 mt-0.5 group-hover:text-[#C9A227] transition-colors">{relName}</h3>
                      <p className="text-sm font-bold mt-1 text-gray-200">
                        {p.price} MAD
                        <span className="text-[10px] text-amber-500 font-semibold block mt-0.5">
                          ≈ {(p.price * 0.091).toFixed(1)}€ / {(p.price * 0.098).toFixed(1)}$
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showDirectBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-[#C9A227]/30 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
              <h3 className="font-serif text-xl font-bold text-[#C9A227] tracking-wider uppercase">
                {currentLang === 'ar' ? 'طلب شراء مباشر عبر واتساب' : 'Achat Rapide via WhatsApp'}
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {currentLang === 'ar' 
                  ? 'يرجى إدخال اسمك الكامل لبدء المحادثة وإتمام طلبك مباشرة عبر واتساب.' 
                  : 'Saisissez votre nom complet pour lancer la discussion et finaliser l\'achat sur WhatsApp.'}
              </p>

              <form onSubmit={handleDirectWhatsAppBuy} className="space-y-4">
                <input
                  type="text"
                  required
                  autoFocus
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'الاسم الكامل' : 'Nom Complet'}
                  className="w-full bg-[#0F1B2E] border border-[#C9A227]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C9A227] transition-all text-center"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDirectBuyModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-700 hover:bg-slate-800 text-gray-300 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    {currentLang === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.957 11.5.957c-5.442 0-9.866 4.372-9.87 9.802 0 1.905.525 3.76 1.517 5.372l-.993 3.626 3.74-.973zm11.398-7.384c-.312-.156-1.847-.91-2.128-1.012-.282-.102-.487-.153-.69.153-.205.307-.795.998-.973 1.201-.178.204-.357.228-.669.072-1.395-.7-2.34-1.258-3.262-2.845-.24-.413.24-.383.687-1.272.078-.156.039-.293-.02-.397-.059-.104-.487-1.173-.668-1.609-.176-.425-.37-.366-.508-.373-.13-.005-.28-.006-.43-.006-.15 0-.395.056-.603.282-.207.227-.792.774-.792 1.888s.81 2.19.922 2.344c.112.155 1.594 2.435 3.862 3.415 1.348.58 2.395.922 3.218 1.183.83.263 1.585.226 2.182.137.665-.1 1.847-.756 2.11-1.487.262-.731.262-1.356.184-1.488-.078-.13-.282-.207-.594-.363z"/>
                    </svg>
                    <span>{currentLang === 'ar' ? 'إرسال الطلب' : 'Envoyer'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
