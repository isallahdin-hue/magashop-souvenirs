import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, User, CheckCircle2, Award } from 'lucide-react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface CheckoutPageProps {
  currentLang: Language;
  cartItems: CartItem[];
  onClearCart: () => void;
  setCurrentPage: (page: string) => void;
}

export default function CheckoutPage({
  currentLang,
  cartItems,
  onClearCart,
  setCurrentPage,
}: CheckoutPageProps) {
  const t = TRANSLATIONS[currentLang];
  const [fullName, setFullName] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compile order details text to send to WhatsApp
    const isRTL = currentLang === 'ar';
    let message = '';

    if (isRTL) {
      message = `🧾 *فاتورة طلبية جديدة - MAGASHOP* 🧾\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👤 *الزبون:* ${fullName}\n\n`;
      message += `📦 *المنتجات المطلوبة:*\n`;
      cartItems.forEach((item) => {
        message += `• *${item.product.name_ar}*\n  (الكمية: ${item.quantity}) ➔ ${item.product.price * item.quantity} درهم\n`;
      });
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *المجموع الإجمالي:* *${subtotal} درهم مغربي*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💬 *شكراً لتسوقكم من متجرنا! نتطلع لتأكيد طلبيتكم وتوصيلها.*`;
    } else {
      message = `🧾 *NOUVELLE COMMANDE - MAGASHOP* 🧾\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👤 *Client :* ${fullName}\n\n`;
      message += `📦 *Produits commandés :*\n`;
      cartItems.forEach((item) => {
        const name = currentLang === 'fr' ? item.product.name_fr : item.product.name_en;
        message += `• *${name}*\n  (Qté: ${item.quantity}) ➔ ${item.product.price * item.quantity} MAD\n`;
      });
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *TOTAL COMMANDE :* *${subtotal} MAD*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💬 *Merci pour votre confiance ! Nous finalisons l'expédition ensemble.*`;
    }

    const encodedMessage = encodeURIComponent(message);
    const targetUrl = `https://wa.me/212661443259?text=${encodedMessage}`;
    
    setWhatsappUrl(targetUrl);
    setOrderCompleted(true);
  };

  const handleFinishOrder = () => {
    // Open WhatsApp URL to complete the real-life communication
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClearCart();
    setCurrentPage('home');
  };

  const isRTL = currentLang === 'ar';

  if (orderCompleted) {
    return (
      <div className="bg-[#0F1B2E] text-white min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 py-10 bg-slate-900/60 rounded-2xl border border-[#C9A227]/30 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#C9A227] uppercase tracking-wider">
              {t.orderSuccess}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed font-sans">
              {t.orderSuccessDetails}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-[#C9A227]/10 text-xs text-left font-mono space-y-1">
            <p className="text-gray-500">Invoice total:</p>
            <p className="text-[#C9A227] font-bold text-lg">{subtotal} MAD</p>
            <p className="text-gray-500 pt-2">Deliver to:</p>
            <p className="text-gray-300 truncate">{fullName}</p>
          </div>

          <button
            onClick={handleFinishOrder}
            className="w-full bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.957 11.5.957c-5.442 0-9.866 4.372-9.87 9.802 0 1.905.525 3.76 1.517 5.372l-.993 3.626 3.74-.973zm11.398-7.384c-.312-.156-1.847-.91-2.128-1.012-.282-.102-.487-.153-.69.153-.205.307-.795.998-.973 1.201-.178.204-.357.228-.669.072-1.395-.7-2.34-1.258-3.262-2.845-.24-.413.24-.383.687-1.272.078-.156.039-.293-.02-.397-.059-.104-.487-1.173-.668-1.609-.176-.425-.37-.366-.508-.373-.13-.005-.28-.006-.43-.006-.15 0-.395.056-.603.282-.207.227-.792.774-.792 1.888s.81 2.19.922 2.344c.112.155 1.594 2.435 3.862 3.415 1.348.58 2.395.922 3.218 1.183.83.263 1.585.226 2.182.137.665-.1 1.847-.756 2.11-1.487.262-.731.262-1.356.184-1.488-.078-.13-.282-.207-.594-.363z"/>
            </svg>
            <span>Ouvrir WhatsApp</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white min-h-screen py-10 relative overflow-hidden">
      {/* Intricate gold Moroccan lattice background (Image 1 and 2) */}
      <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.08] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-xs text-[#C9A227] tracking-[0.25em] uppercase font-bold block">
            {t.shopName}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A227] uppercase tracking-wider">
            {t.checkoutTitle}
          </h1>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-2" />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/40 border border-[#C9A227]/10 rounded-2xl max-w-md mx-auto space-y-4">
            <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto" />
            <p className="text-gray-300">{t.emptyCart}</p>
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-[#C9A227] text-[#0F1B2E] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white transition-all"
            >
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Delivery Form Column */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 bg-[#0A1120]/60 backdrop-blur-sm border border-[#C9A227]/15 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-lg font-bold text-[#C9A227] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#C9A227]" />
                <span>{currentLang === 'ar' ? 'معلومات المشتري' : 'Informations de l\'Acheteur'}</span>
              </h3>

              <div className="space-y-4">
                
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={currentLang === 'ar' ? 'مثال: مصطفى العلوي' : 'Ex: Mustapha Alaoui'}
                    className="w-full bg-[#0F1B2E] border border-[#C9A227]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C9A227] transition-all"
                  />
                </div>

                <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/15 rounded-xl text-xs space-y-2 text-gray-300 leading-relaxed">
                  <p className="font-bold text-[#C9A227]">
                    {currentLang === 'ar' 
                      ? '💡 طريقة الشراء الوحيدة المعتمدة في متجرنا:' 
                      : '💡 Le seul moyen de commande autorisé sur notre boutique :'}
                  </p>
                  <p dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                    {currentLang === 'ar'
                      ? 'بعد إدخال اسمك، سيتم نقلك مباشرة إلى تطبيق واتساب لإرسال الطلبية والتواصل معنا لتأكيد تفاصيل الشحن والتوصيل بكل سهولة وأمان.'
                      : 'Après avoir saisi votre nom, vous serez directement redirigé(e) vers l\'application WhatsApp pour nous envoyer le récapitulatif de votre panier et finaliser l\'expédition avec nous.'}
                  </p>
                </div>

              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#C9A227]/10 text-center">
                <button
                  type="submit"
                  className="w-full h-12 bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold uppercase tracking-widest text-xs sm:text-sm rounded-xl shadow-lg transition-all duration-300 border border-[#C9A227] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.957 11.5.957c-5.442 0-9.866 4.372-9.87 9.802 0 1.905.525 3.76 1.517 5.372l-.993 3.626 3.74-.973zm11.398-7.384c-.312-.156-1.847-.91-2.128-1.012-.282-.102-.487-.153-.69.153-.205.307-.795.998-.973 1.201-.178.204-.357.228-.669.072-1.395-.7-2.34-1.258-3.262-2.845-.24-.413.24-.383.687-1.272.078-.156.039-.293-.02-.397-.059-.104-.487-1.173-.668-1.609-.176-.425-.37-.366-.508-.373-.13-.005-.28-.006-.43-.006-.15 0-.395.056-.603.282-.207.227-.792.774-.792 1.888s.81 2.19.922 2.344c.112.155 1.594 2.435 3.862 3.415 1.348.58 2.395.922 3.218 1.183.83.263 1.585.226 2.182.137.665-.1 1.847-.756 2.11-1.487.262-.731.262-1.356.184-1.488-.078-.13-.282-.207-.594-.363z"/>
                  </svg>
                  <span>{t.placeOrder}</span>
                </button>
              </div>

            </form>

            {/* Order Summary Column */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-[#0A1120]/60 backdrop-blur-sm border border-[#C9A227]/15 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-[#C9A227] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3 flex items-center justify-between">
                  <span>{t.orderSummary}</span>
                  <span className="text-xs text-gray-400">({cartItems.length} items)</span>
                </h3>

                {/* Items loop */}
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-800 space-y-3">
                  {cartItems.map((item) => {
                    const name = currentLang === 'fr' ? item.product.name_fr : currentLang === 'en' ? item.product.name_en : item.product.name_ar;
                    return (
                      <div key={item.product.id} className="flex gap-3 py-3 items-center">
                        <div className="w-12 h-12 rounded bg-slate-900 border border-gray-800 overflow-hidden shrink-0">
                          <img src={item.product.image} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className="font-serif font-bold text-white truncate">{name}</h4>
                          <span className="text-gray-500">Qty: {item.quantity}</span>
                        </div>
                        <span className="text-xs font-bold text-[#C9A227]">{item.product.price * item.quantity} MAD</span>
                      </div>
                    );
                  })}
                </div>

                {/* Summary calculation box */}
                <div className="border-t border-[#C9A227]/10 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>{t.subtotal}</span>
                    <span className="font-bold text-white">{subtotal} MAD</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{currentLang === 'fr' ? 'Livraison' : 'Shipping'}</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">{currentLang === 'fr' ? 'Gratuit' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gray-800">
                    <span className="text-gray-300 font-bold">Total</span>
                    <span className="text-base font-black text-[#C9A227]">{subtotal} MAD</span>
                  </div>
                </div>

              </div>

              {/* Safety Badges */}
              <div className="bg-slate-900/40 border border-[#C9A227]/10 rounded-2xl p-6 text-center space-y-4">
                <div className="flex justify-center gap-3 text-[#C9A227]">
                  <ShieldCheck className="w-8 h-8" />
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs space-y-1.5">
                  <h4 className="font-bold text-white uppercase tracking-wider">Achat 100% Sûr et Équitable</h4>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                    Nous travaillons directement avec de petits ateliers d'artisans. Votre achat fait vivre des familles de potiers et dinandiers au Maroc.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
