import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import AboutPage from './components/AboutPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import ContactPage from './components/ContactPage';
import CartDrawer from './components/CartDrawer';
import AdminPage from './components/AdminPage';
import { Product, CartItem, Language } from './types';
import { PRODUCTS } from './data';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import magashopHero from './assets/images/magashop_hero_1783861535659.jpg';
import { db } from './firebase';

export default function App() {
  const [currentLang, setLang] = useState<Language>(() => {
    const savedV2 = localStorage.getItem('magashop_lang_v2');
    if (!savedV2) {
      localStorage.setItem('magashop_lang_v2', 'true');
      localStorage.setItem('magashop_lang', 'ar');
      return 'ar';
    }
    const saved = localStorage.getItem('magashop_lang');
    return (saved as Language) || 'ar';
  });

  const [currentPage, setCurrentPage] = useState<string>(() => {
    const saved = localStorage.getItem('magashop_page');
    return saved || 'home';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('magashop_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState<string[]>(['ceramics', 'lanterns', 'tea', 'mirrors', 'boxes', 'perfumes']);
  const [isFirestoreEmpty, setIsFirestoreEmpty] = useState(false);

  // Synchronize Products with Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setIsFirestoreEmpty(true);
        setProducts([]); // Do not fallback to mock/demo data when empty
      } else {
        setIsFirestoreEmpty(false);
        const prods: Product[] = [];
        snapshot.forEach((docSnap) => {
          prods.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        setProducts(prods);
      }
    }, (error) => {
      console.error("Firestore read error for products:", error);
      setProducts([]); // Do not fallback to mock/demo data on error
    });

    return () => unsubscribe();
  }, []);

  // Synchronize Categories with Firestore
  useEffect(() => {
    const docRef = doc(db, 'config', 'categories');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCategories(docSnap.data().list || []);
      } else {
        setCategories(['ceramics', 'lanterns', 'tea', 'mirrors', 'boxes', 'perfumes']);
      }
    }, (error) => {
      console.error("Firestore read error for categories:", error);
    });

    return () => unsubscribe();
  }, []);

  // Synchronize and clean up deleted products from Cart
  useEffect(() => {
    if (products.length > 0) {
      const activeIds = new Set(products.map((p) => p.id));
      const filteredCart = cart.filter((item) => activeIds.has(item.product.id));
      if (filteredCart.length !== cart.length) {
        setCart(filteredCart);
      }
    } else if (isFirestoreEmpty && cart.length > 0) {
      setCart([]);
    }
  }, [products, isFirestoreEmpty, cart]);

  const handleSeedDatabase = async () => {
    try {
      const batch = writeBatch(db);
      PRODUCTS.forEach((prod, index) => {
        const docRef = doc(collection(db, 'products'), prod.id);
        batch.set(docRef, {
          ...prod,
          createdAt: Date.now() - (index * 1000)
        });
      });
      await batch.commit();

      // Seed categories doc
      await setDoc(doc(db, 'config', 'categories'), {
        list: ['ceramics', 'lanterns', 'tea', 'mirrors', 'boxes', 'perfumes']
      });
    } catch (err) {
      console.error("Error seeding database:", err);
      throw err;
    }
  };

  const handleAddProduct = async (newProd: Product) => {
    try {
      await setDoc(doc(db, 'products', newProd.id), {
        ...newProd,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error("Error adding product to Firestore:", err);
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
    } catch (err) {
      console.error("Error deleting product from Firestore:", err);
      throw err;
    }
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    try {
      await setDoc(doc(db, 'products', updatedProd.id), {
        ...updatedProd,
        createdAt: updatedProd.createdAt || Date.now()
      });
    } catch (err) {
      console.error("Error updating product in Firestore:", err);
      throw err;
    }
  };

  const handleUpdateCategories = async (newCats: string[]) => {
    try {
      await setDoc(doc(db, 'config', 'categories'), { list: newCats });
    } catch (err) {
      console.error("Error updating categories in Firestore:", err);
      throw err;
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    try {
      // Delete from config categories list
      const updatedCats = categories.filter(c => c !== catName);
      await setDoc(doc(db, 'config', 'categories'), { list: updatedCats });

      // Delete associated products in Firestore
      const batch = writeBatch(db);
      products.forEach((p) => {
        if (p.category === catName) {
          batch.delete(doc(db, 'products', p.id));
        }
      });
      await batch.commit();

      // Clear from cart locally
      setCart((prevCart) => prevCart.filter((item) => item.product.category !== catName));
    } catch (err) {
      console.error("Error deleting category in Firestore:", err);
      throw err;
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const saved = localStorage.getItem('magashop_selected_product');
    return saved ? JSON.parse(saved) : null;
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Synchronize Language and Page state with localStorage & handle HTML direction
  useEffect(() => {
    localStorage.setItem('magashop_lang', currentLang);
    const html = document.documentElement;
    html.lang = currentLang;
    if (currentLang === 'ar') {
      html.dir = 'rtl';
    } else {
      html.dir = 'ltr';
    }
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('magashop_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedProduct) {
      localStorage.setItem('magashop_selected_product', JSON.stringify(selectedProduct));
    } else {
      localStorage.removeItem('magashop_selected_product');
    }
  }, [selectedProduct]);

  useEffect(() => {
    localStorage.setItem('magashop_cart', JSON.stringify(cart));
  }, [cart]);

  // Monitor scroll height to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    setCartOpen(true);
  };

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product, 1);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutRedirect = () => {
    setCartOpen(false);
    setSelectedProduct(null);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isRTL = currentLang === 'ar';

  return (
    <div 
      className="flex flex-col min-h-screen font-sans antialiased text-gray-200 relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* GPU Accelerated Fixed Background Layer to prevent scroll lag */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 27, 46, 0.55), rgba(15, 27, 46, 0.65)), url(${magashopHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* GLOBAL HEADER */}
      <Header
        currentLang={currentLang}
        setLang={setLang}
        cartCount={cartCount}
        onCartToggle={() => setCartOpen(!cartOpen)}
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setSelectedProduct(null);
          setCurrentPage(page);
        }}
      />

      {/* CORE ROUTED PAGES */}
      <main className="flex-grow">
        {selectedProduct && currentPage === 'product-detail' ? (
          <ProductDetailPage
            product={selectedProduct}
            products={products}
            currentLang={currentLang}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
            onBack={() => {
              setSelectedProduct(null);
              setCurrentPage('home');
            }}
            onViewProduct={handleViewProductDetails}
          />
        ) : currentPage === 'checkout' ? (
          <CheckoutPage
            currentLang={currentLang}
            cartItems={cart}
            onClearCart={() => setCart([])}
            setCurrentPage={setCurrentPage}
          />
        ) : currentPage === 'contact' ? (
          <ContactPage currentLang={currentLang} />
        ) : currentPage === 'story' ? (
          <AboutPage currentLang={currentLang} />
        ) : currentPage === 'admin' ? (
          <AdminPage
            products={products}
            categories={categories}
            currentLang={currentLang}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            onUpdateCategories={handleUpdateCategories}
            onDeleteCategory={handleDeleteCategory}
            onBack={() => setCurrentPage('home')}
            isFirestoreEmpty={isFirestoreEmpty}
            onSeedDatabase={handleSeedDatabase}
          />
        ) : (
          <Homepage
            currentLang={currentLang}
            products={products}
            categories={categories}
            onAddToCart={handleQuickAddToCart}
            onViewDetails={handleViewProductDetails}
            setCurrentPage={setCurrentPage}
            onSelectCategory={handleSelectCategory}
          />
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer
        currentLang={currentLang}
        setCurrentPage={setCurrentPage}
        onSelectCategory={handleSelectCategory}
      />

      {/* SLIDE-IN CART DRAWER OVERLAY */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        currentLang={currentLang}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutRedirect}
      />

      {/* FLOATING WHATSAPP BUTTON (with notification pulsing badge) */}
      <a
        href="https://wa.me/212661443259"
        target="_blank"
        rel="noreferrer"
        className={`fixed bottom-6 ${
          isRTL ? 'left-6' : 'right-6'
        } z-40 bg-[#C9A227] hover:bg-white text-[#0F1B2E] hover:text-[#C9A227] p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 flex items-center justify-center group ring-4 ring-[#C9A227]/20`}
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.957 11.5.957c-5.442 0-9.866 4.372-9.87 9.802 0 1.905.525 3.76 1.517 5.372l-.993 3.626 3.74-.973zm11.398-7.384c-.312-.156-1.847-.91-2.128-1.012-.282-.102-.487-.153-.69.153-.205.307-.795.998-.973 1.201-.178.204-.357.228-.669.072-1.395-.7-2.34-1.258-3.262-2.845-.24-.413.24-.383.687-1.272.078-.156.039-.293-.02-.397-.059-.104-.487-1.173-.668-1.609-.176-.425-.37-.366-.508-.373-.13-.005-.28-.006-.43-.006-.15 0-.395.056-.603.282-.207.227-.792.774-.792 1.888s.81 2.19.922 2.344c.112.155 1.594 2.435 3.862 3.415 1.348.58 2.395.922 3.218 1.183.83.263 1.585.226 2.182.137.665-.1 1.847-.756 2.11-1.487.262-.731.262-1.356.184-1.488-.078-.13-.282-.207-.594-.363z"/>
        </svg>
        
        {/* Help tooltip */}
        <span className={`absolute ${isRTL ? 'right-full mr-3' : 'left-full ml-3'} hidden group-hover:block bg-[#0A1120] border border-[#C9A227]/30 text-[#C9A227] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl transition-all duration-300`}>
          {currentLang === 'fr' ? 'Besoin d\'aide ? Contactez-nous' : currentLang === 'en' ? 'Need help? Contact us' : 'بحاجة للمساعدة؟ اتصل بنا'}
        </span>
        
        {/* Pulsing indicator ring */}
        <span className="absolute inset-0 rounded-full bg-[#C9A227] animate-ping opacity-25 -z-10" />
      </a>

      {/* BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className={`fixed bottom-24 ${
            isRTL ? 'left-6' : 'right-6'
          } z-40 bg-[#0A1120]/80 backdrop-blur-sm border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0F1B2E] p-2.5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
