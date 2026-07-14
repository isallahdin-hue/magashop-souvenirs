import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ProductCardProps {
  product: Product;
  currentLang: Language;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLang,
  onAddToCart,
  onViewDetails,
}) => {
  const t = TRANSLATIONS[currentLang];
  
  const productName = 
    currentLang === 'fr' ? product.name_fr : currentLang === 'en' ? product.name_en : product.name_ar;

  const isRTL = currentLang === 'ar';

  return (
    <div 
      className="bg-[#FBF9F4] text-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-[box-shadow,transform] duration-300 border border-[#C9A227]/20 flex flex-col group relative"
      id={`product-card-${product.id}`}
    >
      {/* Decorative corner dots on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-[#C9A227]" />
          ))}
        </div>
      </div>

      {/* Image Container with Zoom and Badge */}
      <div className="relative overflow-hidden aspect-square bg-[#F5EFE0] border-b border-[#C9A227]/10">
        <img
          src={product.image}
          alt={productName}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Navy/Gold Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-[#0F1B2E]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={() => onViewDetails(product)}
            className="w-10 h-10 rounded-full bg-[#C9A227] text-[#0F1B2E] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
            title="Détails"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => onAddToCart(product, e)}
            className="w-10 h-10 rounded-full bg-white text-[#0F1B2E] flex items-center justify-center hover:bg-[#C9A227] hover:text-[#0F1B2E] hover:scale-110 transition-all shadow-lg"
            title="Ajouter au Panier"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Traditional Moroccan Badge */}
        <span className="absolute top-3 left-3 bg-[#0F1B2E] text-[#C9A227] border border-[#C9A227]/40 text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded shadow-md">
          {t.badgeHandmade}
        </span>

        {/* Rating overlay bottom left */}
        <div className="absolute bottom-2 left-2 bg-[#0F1B2E]/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 border border-[#C9A227]/20">
          <Star className="w-3 h-3 text-[#C9A227] fill-[#C9A227]" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Subtitle category */}
          <span className="text-[10px] uppercase text-[#C9A227] font-semibold tracking-wider block mb-1">
            {product.category}
          </span>
          
          <h4 
            onClick={() => onViewDetails(product)}
            className={`font-serif text-sm sm:text-base font-bold text-[#0F1B2E] hover:text-[#C9A227] cursor-pointer transition-colors line-clamp-2 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            {productName}
          </h4>
        </div>

        <div className="mt-4 pt-3 border-t border-[#C9A227]/10 flex items-center justify-between">
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-xs text-gray-500 block leading-none">Prix</span>
            <span className="text-base sm:text-lg font-bold text-[#0F1B2E] tracking-tight">
              {product.price} <span className="text-xs">MAD</span>
            </span>
          </div>

          <button
            onClick={(e) => onAddToCart(product, e)}
            className="flex items-center gap-1.5 bg-[#0F1B2E] hover:bg-[#C9A227] text-white hover:text-[#0F1B2E] text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-[background-color,color,transform,box-shadow] duration-200 border border-[#C9A227]/30 shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
