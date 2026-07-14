import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentLang: Language;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  currentLang,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-[#0F1B2E] border-l border-[#C9A227]/30 shadow-2xl flex flex-col h-full text-white">
          
          {/* Header */}
          <div className="p-6 border-b border-[#C9A227]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
              <h2 className="font-serif text-lg font-bold tracking-wider text-[#C9A227] uppercase">
                {t.cartTitle}
              </h2>
              <span className="bg-[#C9A227]/20 text-[#C9A227] text-xs px-2 py-0.5 rounded-full font-bold">
                {cartItems.length}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-[#C9A227]/20 flex items-center justify-center text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t.emptyCart}</p>
                  <button 
                    onClick={onClose}
                    className="text-[#C9A227] text-xs font-semibold hover:underline mt-2 inline-block uppercase tracking-widest"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              </div>
            ) : (
              cartItems.map((item) => {
                const productName = currentLang === 'fr' 
                  ? item.product.name_fr 
                  : currentLang === 'en' 
                  ? item.product.name_en 
                  : item.product.name_ar;

                return (
                  <div 
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-slate-900/60 rounded-xl border border-[#C9A227]/10 items-center hover:border-[#C9A227]/30 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-[#C9A227]/10">
                      <img 
                        src={item.product.image} 
                        alt={productName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-bold text-white line-clamp-2 hover:text-[#C9A227] transition-colors">
                        {productName}
                      </h4>
                      <p className="text-xs text-[#C9A227] font-semibold mt-1">
                        {item.product.price} MAD
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer calculation & checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#C9A227]/20 bg-[#0A1120] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{t.subtotal}</span>
                <span className="text-lg font-bold text-[#C9A227]">{subtotal} MAD</span>
              </div>
              <div className="text-[11px] text-gray-500 leading-tight">
                {currentLang === 'fr' 
                  ? '*Les commandes sont finalisées via WhatsApp. Pas d\'obligation de paiement immédiat en ligne.' 
                  : currentLang === 'en'
                  ? '*Orders are finalized via WhatsApp. No immediate online payment required.'
                  : '*يتم تأكيد الطلبيات عبر تطبيق الواتساب. لا يتطلب الدفع الفوري عبر الإنترنت.'}
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-widest text-xs border border-[#C9A227]"
              >
                {t.checkout}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
