import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, Lock, ArrowLeft, Sparkles, Tag, Layers, Check, X, FileText, Upload, Loader2 } from 'lucide-react';
import { Product, Language } from '../types';
import { auth, storage } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const compressAndResizeImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions (max 800px)
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress as jpeg starting with quality 0.7
        let quality = 0.7;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        
        // Iteratively reduce quality if Base64 string is larger than 100KB (approx 133,000 chars)
        while (base64.length > 130000 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        // If it's still > 100KB, resize canvas by 70% and try again
        if (base64.length > 130000) {
          const secondCanvas = document.createElement('canvas');
          secondCanvas.width = Math.round(width * 0.7);
          secondCanvas.height = Math.round(height * 0.7);
          const secondCtx = secondCanvas.getContext('2d');
          if (secondCtx) {
            secondCtx.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
            quality = 0.6;
            base64 = secondCanvas.toDataURL('image/jpeg', quality);
            while (base64.length > 130000 && quality > 0.1) {
              quality -= 0.1;
              base64 = secondCanvas.toDataURL('image/jpeg', quality);
            }
          }
        }

        resolve(base64);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reader failed'));
    reader.readAsDataURL(file);
  });
};

interface AdminPageProps {
  products: Product[];
  categories: string[];
  currentLang: Language;
  onAddProduct: (product: Product) => Promise<void> | void;
  onDeleteProduct: (productId: string) => Promise<void> | void;
  onUpdateProduct: (product: Product) => Promise<void> | void;
  onUpdateCategories: (categories: string[]) => Promise<void> | void;
  onDeleteCategory: (category: string) => Promise<void> | void;
  onBack: () => void;
  isFirestoreEmpty?: boolean;
  onSeedDatabase?: () => Promise<void>;
}

export default function AdminPage({
  products,
  categories,
  currentLang,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onUpdateCategories,
  onDeleteCategory,
  onBack,
  isFirestoreEmpty = false,
  onSeedDatabase,
}: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Custom feedback and confirm modal states
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSeed = async () => {
    if (!onSeedDatabase) return;
    setIsSeeding(true);
    try {
      await onSeedDatabase();
      showToast(isRTL ? 'تمت تهيئة قاعدة البيانات بنجاح بالمنتجات الافتراضية!' : 'Base de données initialisée avec succès !', 'success');
    } catch (err) {
      console.error("Seeding error:", err);
      showToast(isRTL ? 'حدث خطأ أثناء تهيئة قاعدة البيانات.' : 'Erreur lors de l\'initialisation.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Edit Mode state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'ceramics');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descEn, setDescEn] = useState('');
  
  // Specs
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [materialAr, setMaterialAr] = useState('');
  const [materialFr, setMaterialFr] = useState('');
  const [materialEn, setMaterialEn] = useState('');

  // Image source mode: upload file or paste URL
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = currentLang === 'ar';

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@magashop.com') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle Login using Firebase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    // Decrypt obfuscated pass key: "NjIwMkBAMzIx" represents reversed base64 of "123@@2026"
    const decryptPass = () => {
      try {
        const decoded = window.atob("NjIwMkBAMzIx");
        return decoded.split('').reverse().join('');
      } catch (err) {
        return '';
      }
    };

    const targetPassword = decryptPass();

    if (password !== targetPassword) {
      setLoginError(isRTL ? 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' : 'Mot de passe incorrect. Veuillez réessayer.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Try to login via Firebase auth
      await signInWithEmailAndPassword(auth, 'admin@magashop.com', password);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setLoginError(isRTL 
          ? '⚠️ طريقة تسجيل الدخول بالبريد الإلكتروني/كلمة المرور غير مفعّلة في Firebase. يرجى تفعيلها من لوحة تحكم Firebase Console: اذهب إلى Authentication -> Sign-in method -> أضف Email/Password ثم قم بتفعيله وحفظ التغييرات.'
          : '⚠️ La méthode de connexion Email/Mot de passe n\'est pas activée dans Firebase. Veuillez l\'activer dans votre Firebase Console: Authentication -> Sign-in method -> Ajouter Email/Password, activez-le et enregistrez.'
        );
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        // If not registered yet, register this admin user automatically with Firebase Auth
        try {
          await createUserWithEmailAndPassword(auth, 'admin@magashop.com', password);
        } catch (signupErr: any) {
          if (signupErr.code === 'auth/operation-not-allowed') {
            setLoginError(isRTL 
              ? '⚠️ طريقة تسجيل الدخول بالبريد الإلكتروني/كلمة المرور غير مفعّلة في Firebase. يرجى تفعيلها من لوحة تحكم Firebase Console: اذهب إلى Authentication -> Sign-in method -> أضف Email/Password ثم قم بتفعيله وحفظ التغييرات.'
              : '⚠️ La méthode de connexion Email/Mot de passe n\'est pas activée dans Firebase. Veuillez l\'activer dans votre Firebase Console: Authentication -> Sign-in method -> Ajouter Email/Password, activez-le et enregistrez.'
            );
          } else {
            setLoginError(isRTL ? 'فشل إعداد حساب المشرف في Firebase Authentication.' : 'Échec de configuration du compte Admin dans Firebase.');
          }
        }
      } else {
        setLoginError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Image File Selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCat = newCategoryInput.trim().toLowerCase();
    if (!cleanCat) return;
    if (categories.includes(cleanCat)) {
      showToast(isRTL ? 'هذه الفئة موجودة بالفعل!' : 'Cette catégorie existe déjà !', 'error');
      return;
    }
    onUpdateCategories([...categories, cleanCat]);
    setNewCategoryInput('');
    showToast(isRTL ? 'تمت إضافة الفئة بنجاح!' : 'Catégorie ajoutée avec succès !', 'success');
  };

  // Set form to edit mode
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNameAr(product.name_ar || '');
    setNameFr(product.name_fr || '');
    setNameEn(product.name_en || '');
    setPrice(product.price ? String(product.price) : '');
    setSelectedCategory(product.category || categories[0] || 'ceramics');
    setIsCustomCategory(false);
    setDescAr(product.description_ar || '');
    setDescFr(product.description_fr || '');
    setDescEn(product.description_en || '');
    setDimensions(product.dimensions || '');
    setWeight(product.weight || '');
    setMaterialAr(product.material_ar || '');
    setMaterialFr(product.material_fr || '');
    setMaterialEn(product.material_en || '');
    setImageSource('url');
    setImageUrl(product.image || '');
    setImageBase64('');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form / Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNameAr('');
    setNameFr('');
    setNameEn('');
    setPrice('');
    setCustomCategory('');
    setIsCustomCategory(false);
    setDescAr('');
    setDescFr('');
    setDescEn('');
    setDimensions('');
    setWeight('');
    setMaterialAr('');
    setMaterialFr('');
    setMaterialEn('');
    setImageBase64('');
    setImageUrl('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Submit (Create or Update Product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalCategory = isCustomCategory ? customCategory.trim().toLowerCase() : selectedCategory;
    
    if (!nameAr.trim() && !nameFr.trim() && !nameEn.trim()) {
      showToast(isRTL ? 'يرجى كتابة اسم المنتج بلغة واحدة على الأقل' : 'Veuillez saisir le nom du produit dans au moins une langue', 'error');
      setIsSubmitting(false);
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      showToast(isRTL ? 'يرجى كتابة ثمن صحيح ومناسب' : 'Veuillez saisir un prix valide', 'error');
      setIsSubmitting(false);
      return;
    }
    if (!finalCategory) {
      showToast(isRTL ? 'يرجى اختيار أو كتابة فئة المنتج' : 'Veuillez choisir ou saisir une catégorie', 'error');
      setIsSubmitting(false);
      return;
    }

    // Determine final image URL
    let finalImage = imageUrl.trim();
    if (imageSource === 'upload') {
      if (imageFile) {
        setUploadProgress(true);
        try {
          // Compress and resize the image first directly to small Base64 string (<100KB)
          finalImage = await compressAndResizeImage(imageFile);
        } catch (compressErr: any) {
          console.error("Image compression error:", compressErr);
          finalImage = imageBase64 || 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80';
        } finally {
          setUploadProgress(false);
        }
      } else if (editingProduct) {
        // Keep existing image if no new file is uploaded
        finalImage = editingProduct.image;
      } else if (imageBase64) {
        // Use existing base64
        finalImage = imageBase64;
      } else {
        showToast(isRTL ? 'يرجى تحميل صورة المنتج' : 'Veuillez charger une photo', 'error');
        setIsSubmitting(false);
        return;
      }
    } else if (!finalImage) {
      showToast(isRTL ? 'يرجى إدخال رابط الصورة' : 'Veuillez spécifier un lien d\'image', 'error');
      setIsSubmitting(false);
      return;
    }

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name_ar: nameAr.trim() || nameFr.trim() || nameEn.trim(),
      name_fr: nameFr.trim() || nameAr.trim() || nameEn.trim(),
      name_en: nameEn.trim() || nameFr.trim() || nameAr.trim(),
      category: finalCategory,
      price: Number(price),
      image: finalImage,
      gallery: [finalImage],
      description_ar: descAr.trim() || descFr.trim() || descEn.trim() || 'منتج مغربي تقليدي أصيل مصنوع يدوياً بدقة وعناية.',
      description_fr: descFr.trim() || descAr.trim() || descEn.trim() || 'Produit marocain artisanal authentique fait main.',
      description_en: descEn.trim() || descFr.trim() || descAr.trim() || 'Authentic handcrafted Moroccan artisanal product.',
      material_ar: materialAr.trim() || 'مواد طبيعية تقليدية',
      material_fr: materialFr.trim() || 'Matériaux naturels traditionnels',
      material_en: materialEn.trim() || materialFr.trim() || 'Traditional natural materials',
      dimensions: dimensions.trim() || 'قياسات قياسية',
      weight: weight.trim() || 'وزن قياسي',
      rating: editingProduct ? editingProduct.rating : 5.0,
      isNewArrival: editingProduct ? editingProduct.isNewArrival : true,
    };

    if (isCustomCategory && finalCategory && !categories.includes(finalCategory)) {
      onUpdateCategories([...categories, finalCategory]);
    }

    try {
      if (editingProduct) {
        // Update product in Firestore
        await onUpdateProduct(productPayload);
        showToast(isRTL ? 'تم تحديث المنتج بنجاح!' : 'Produit mis à jour avec succès !', 'success');
      } else {
        // Add new product in Firestore
        await onAddProduct(productPayload);
        showToast(isRTL ? 'تمت إضافة المنتج بنجاح!' : 'Produit ajouté avec succès !', 'success');
      }
      handleCancelEdit();
    } catch (err: any) {
      console.error("Error saving product:", err);
      const errorMsg = err?.message || String(err);
      const errorCode = err?.code || '';
      const displayError = errorCode ? `[${errorCode}] ${errorMsg}` : errorMsg;
      showToast(
        isRTL 
          ? `حدث خطأ أثناء حفظ المنتج في قاعدة البيانات: ${displayError}` 
          : `Erreur lors de l'enregistrement du produit: ${displayError}`, 
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C9A227] animate-spin" />
      </div>
    );
  }

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.08] pointer-events-none" />
        <div className="bg-[#0A1120]/90 backdrop-blur-md border border-[#C9A227]/30 max-w-md w-full p-8 rounded-2xl shadow-2xl relative space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center mx-auto text-[#C9A227]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#C9A227] tracking-wider">
              {isRTL ? 'لوحة تحكم المتجر' : 'Espace Administration'}
            </h2>
            <p className="text-xs text-gray-400">
              {isRTL ? 'الدخول محمي للمشرف ومؤمن عبر Firebase Authentication' : 'Accès réservé et sécurisé via Firebase Authentication'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                {isRTL ? 'رمز المرور أو الرقم السري' : 'Mot de Passe Admin'}
              </label>
              <input
                type="password"
                required
                placeholder={isRTL ? 'أدخل كلمة المرور السرية للمتجر' : 'Saisir mot de passe secret'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F1B2E]/70 border border-[#C9A227]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-all text-center"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-2.5 rounded-lg text-center font-medium">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C9A227] hover:bg-white text-[#0F1B2E] disabled:bg-[#C9A227]/50 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all duration-300 shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isRTL ? 'تسجيل الدخول' : 'Se Connecter'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-[11px] text-gray-500">
            <span>Passcode: <code className="text-[#C9A227]">••••••••</code></span>
            <button onClick={onBack} className="text-[#C9A227] hover:underline flex items-center gap-1">
              {isRTL ? 'الرجوع للمتجر' : 'Retour au site'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-moroccan-lattice-gold opacity-[0.06] pointer-events-none" />

      {/* Header and Logout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#0A1120]/80 p-5 rounded-2xl border border-[#C9A227]/20 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-[#0F1B2E] hover:bg-[#C9A227] text-[#C9A227] hover:text-[#0F1B2E] border border-[#C9A227]/30 rounded-xl transition-all active:scale-95 shrink-0"
            title={isRTL ? 'الرجوع للمتجر' : 'Retour au magasin'}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A227] animate-pulse" />
              <h1 className="font-serif text-xl sm:text-2xl font-black text-[#C9A227] uppercase tracking-wider">
                {isRTL ? 'لوحة إدارة المتجر' : 'Espace Administration'}
              </h1>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isRTL ? 'تحكم في منتجات المعرض وأضف تحفاً مغربية جديدة بسهولة' : 'Gérez les articles de votre boutique et ajoutez des merveilles en un clic'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all duration-300 active:scale-95"
        >
          {isRTL ? 'تسجيل الخروج' : 'Se Déconnecter'}
        </button>
      </div>

      {/* SEED DATABASE NOTICE */}
      {isFirestoreEmpty && (
        <div className="mb-8 p-6 bg-amber-950/20 border border-amber-500/30 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-start flex-col md:flex-row">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#C9A227]">
                {isRTL ? 'قاعدة البيانات السحابية فارغة' : 'La base de données cloud est vide'}
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                {isRTL 
                  ? 'يرجى تهيئة متجر التخزين السحابي بالتحف والمنتجات الافتراضية المضمنة في البرنامج لتفعيل قاعدة البيانات وبدء العرض فوراً.'
                  : 'Veuillez initialiser la base de données cloud avec les produits par défaut pour activer l\'affichage des articles.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full md:w-auto px-6 py-3 bg-[#C9A227] hover:bg-white text-[#0F1B2E] disabled:bg-[#C9A227]/40 disabled:text-[#0F1B2E]/60 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSeeding && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isRTL ? 'تهيئة المتجر الآن' : 'Initialiser le Magasin'}</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Add/Edit Product & Manage Categories (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A1120]/75 backdrop-blur-md rounded-2xl border border-[#C9A227]/25 p-5 sm:p-6 shadow-2xl space-y-6">
            <div className="border-b border-[#C9A227]/20 pb-3 flex items-center justify-between text-[#C9A227]">
              <div className="flex items-center gap-2">
                {editingProduct ? <Edit className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5" />}
                <h2 className="font-serif text-lg font-bold">
                  {editingProduct 
                    ? (isRTL ? 'تعديل منتج موجود' : 'Modifier le Produit') 
                    : (isRTL ? 'إضافة منتج جديد' : 'Ajouter un Produit')}
                </h2>
              </div>
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-red-400 hover:underline"
                >
                  {isRTL ? 'إلغاء التعديل' : 'Annuler'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title Fields (Multi-lang for high quality) */}
              <div className="space-y-3 p-3 bg-[#0F1B2E]/40 rounded-xl border border-[#C9A227]/10">
                <span className="text-[10px] text-[#C9A227] uppercase font-bold tracking-wider block">
                  {isRTL ? 'اسم المنتج (يكفي ملء لغة واحدة على الأقل)' : 'Nom du Produit (Remplir au moins une langue)'}
                </span>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">{isRTL ? 'العربية' : 'Arabe'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'مثال: فانوس ملكي من النحاس' : 'Ex: Lanterne Royale en Laiton'}
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">{isRTL ? 'الفرنسية' : 'Français'}</label>
                  <input
                    type="text"
                    placeholder="Ex: Lanterne Royale en Laiton Ciselé"
                    value={nameFr}
                    onChange={(e) => setNameFr(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">{isRTL ? 'الإنجليزية' : 'Anglais'}</label>
                  <input
                    type="text"
                    placeholder="Ex: Royal Chiseled Brass Lantern"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">
                  {isRTL ? 'ثمن المنتج بالدرهم (MAD) * دون مصاريف الشحن' : 'Prix du Produit en Dirhams (MAD) * Sans frais d\'envoi'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="250"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227] font-bold"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {isRTL ? 'فئة المنتج' : 'Catégorie'}
                </label>
                
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="catSource"
                      checked={!isCustomCategory}
                      onChange={() => setIsCustomCategory(false)}
                      className="accent-[#C9A227]"
                    />
                    <span>{isRTL ? 'فئة موجودة' : 'Existante'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="catSource"
                      checked={isCustomCategory}
                      onChange={() => setIsCustomCategory(true)}
                      className="accent-[#C9A227]"
                    />
                    <span>{isRTL ? 'فئة مخصصة جديدة' : 'Nouvelle catégorie'}</span>
                  </label>
                </div>

                {!isCustomCategory ? (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#0F1B2E]/75 border border-[#C9A227]/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227] uppercase font-bold tracking-wider"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white uppercase">
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'اكتب اسم الفئة الجديدة بالإنجليزية...' : 'Nom de la nouvelle catégorie...'}
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                )}
              </div>

              {/* Image Source Mode & Upload to Firebase Storage */}
              <div className="space-y-3 p-3 bg-[#0F1B2E]/40 rounded-xl border border-[#C9A227]/10">
                <span className="text-[10px] text-[#C9A227] uppercase font-bold tracking-wider block">
                  {isRTL ? 'صورة المنتج الرئيسي (ترفع وتخزن في Firebase Storage)' : 'Photo du Produit (Téléchargée vers Firebase Storage)'}
                </span>

                <div className="flex gap-4 text-xs mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="imgSource"
                      checked={imageSource === 'upload'}
                      onChange={() => setImageSource('upload')}
                      className="accent-[#C9A227]"
                    />
                    <span>{isRTL ? 'تحميل من هاتفك/جهازك' : 'Télécharger fichier'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="imgSource"
                      checked={imageSource === 'url'}
                      onChange={() => setImageSource('url')}
                      className="accent-[#C9A227]"
                    />
                    <span>{isRTL ? 'رابط ويب مباشر' : 'Lien Web (URL)'}</span>
                  </label>
                </div>

                {imageSource === 'upload' ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#C9A227]/25 hover:border-[#C9A227]/50 rounded-xl cursor-pointer bg-[#0F1B2E]/40 hover:bg-[#0F1B2E]/70 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                          <Upload className="w-8 h-8 text-[#C9A227] mb-2" />
                          <p className="text-xs text-gray-300 font-semibold">
                            {isRTL ? 'انقر أو اسحب ملف الصورة هنا' : 'Cliquez ou glissez une image ici'}
                          </p>
                          <p className="text-[9px] text-gray-500 mt-1">
                            PNG, JPG, JPEG (Max 10MB)
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {imageBase64 && (
                      <div className="mt-2 flex items-center gap-3 p-2 bg-slate-900/50 rounded-xl border border-[#C9A227]/10">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#C9A227]/20">
                          <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left min-w-0 flex-grow">
                          <span className="text-[10px] text-emerald-400 font-semibold block">✓ {isRTL ? 'جاهزة للرفع والتخزين' : 'Prête à stocker'}</span>
                          <span className="text-[9px] text-gray-500 truncate block">{imageFile?.name || 'Local File'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                    />
                    {imageUrl && (
                      <div className="mt-2 w-14 h-14 rounded-lg overflow-hidden border border-[#C9A227]/20">
                        <img src={imageUrl} alt="Web Preview" className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80'}} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description Fields */}
              <div className="space-y-3 p-3 bg-[#0F1B2E]/40 rounded-xl border border-[#C9A227]/10">
                <span className="text-[10px] text-[#C9A227] uppercase font-bold tracking-wider block">
                  {isRTL ? 'وصف المنتج بالتفصيل (اختياري - يكفي لغة واحدة)' : 'Description du Produit (Optionnel - Une langue suffit)'}
                </span>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">{isRTL ? 'بالعربية' : 'Arabe'}</label>
                  <textarea
                    placeholder={isRTL ? 'تفاصيل عن صنع المنتج ومميزاته الجمالية' : 'Description en Arabe'}
                    rows={2}
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">{isRTL ? 'بالفرنسية' : 'Français'}</label>
                  <textarea
                    placeholder="Description en Français"
                    rows={2}
                    value={descFr}
                    onChange={(e) => setDescFr(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">{isRTL ? 'بالإنجليزية' : 'Anglais'}</label>
                  <textarea
                    placeholder="Description en Anglais"
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227] resize-none"
                  />
                </div>
              </div>

              {/* Advanced Specs */}
              <div className="space-y-2 p-3 bg-[#0F1B2E]/40 rounded-xl border border-[#C9A227]/10">
                <span className="text-[10px] text-[#C9A227] uppercase font-bold tracking-wider block">
                  {isRTL ? 'تفاصيل إضافية (اختياري)' : 'Spécifications (Optionnel)'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-gray-500 mb-0.5">{isRTL ? 'القياسات' : 'Dimensions'}</label>
                    <input
                      type="text"
                      placeholder="ø 30 cm, 20x20x15"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 mb-0.5">{isRTL ? 'الوزن' : 'Poids'}</label>
                    <input
                      type="text"
                      placeholder="1.5 kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 mb-0.5">{isRTL ? 'المواد (العربية)' : 'Matériau (Arabe)'}</label>
                  <input
                    type="text"
                    placeholder={isRTL ? 'نحاس أصفر خالص' : 'Matériau'}
                    value={materialAr}
                    onChange={(e) => setMaterialAr(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 mb-0.5">{isRTL ? 'المواد (الفرنسية)' : 'Matériau (Français)'}</label>
                  <input
                    type="text"
                    placeholder="Laiton, Céramique, Bois"
                    value={materialFr}
                    onChange={(e) => setMaterialFr(e.target.value)}
                    className="w-full bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploadProgress}
                className="w-full bg-[#C9A227] hover:bg-white text-[#0F1B2E] disabled:bg-[#C9A227]/50 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all duration-300 shadow-xl hover:scale-101 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {(isSubmitting || uploadProgress) && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {editingProduct 
                    ? (isRTL ? 'حفظ تعديلات المنتج' : 'Enregistrer les modifications') 
                    : (isRTL ? 'تأكيد وإضافة المنتج' : 'Valider et Ajouter')}
                </span>
              </button>
            </form>
          </div>

          {/* CATEGORY MANAGEMENT SECTION */}
          <div className="bg-[#0A1120]/75 backdrop-blur-md rounded-2xl border border-[#C9A227]/25 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="border-b border-[#C9A227]/20 pb-3 flex items-center justify-between text-[#C9A227]">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <h2 className="font-serif text-lg font-bold">
                  {isRTL ? 'إدارة فئات المنتجات' : 'Gestion des Catégories'}
                </h2>
              </div>
              <span className="bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                {categories.length}
              </span>
            </div>

            {/* List of existing categories */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 bg-[#0F1B2E]/50 border border-[#C9A227]/10 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rotate-45 bg-[#C9A227]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {cat}
                      </span>
                      <span className="text-[10px] text-gray-400 bg-[#C9A227]/5 border border-[#C9A227]/10 px-1.5 py-0.2 rounded-full">
                        {count} {isRTL ? 'منتجات' : 'produits'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCategoryToDelete(cat);
                      }}
                      className="p-1.5 bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg transition-all active:scale-95"
                      title={isRTL ? 'حذف هذه الفئة' : 'Supprimer cette catégorie'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Form to add a brand new category */}
            <form onSubmit={handleAddNewCategory} className="pt-2 border-t border-[#C9A227]/10 space-y-2">
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {isRTL ? 'إضافة فئة جديدة' : 'Ajouter une nouvelle catégorie'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={isRTL ? ' carpets, pottery ...' : 'Ex: tapis, cuir, bijoux...'}
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="flex-grow bg-[#0F1B2E]/60 border border-[#C9A227]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                />
                <button
                  type="submit"
                  className="bg-[#C9A227] hover:bg-white text-[#0F1B2E] font-bold p-2 rounded-xl transition-all active:scale-95 flex items-center justify-center shrink-0"
                  title={isRTL ? 'إضافة الفئة' : 'Ajouter la catégorie'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Products List with Deletion and Editing (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0A1120]/75 backdrop-blur-md rounded-2xl border border-[#C9A227]/25 p-5 sm:p-6 shadow-2xl space-y-6">
          <div className="border-b border-[#C9A227]/20 pb-3 flex items-center justify-between text-[#C9A227]">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <h2 className="font-serif text-lg font-bold">
                {isRTL ? 'المنتجات المعروضة حالياً' : 'Produits en Stock'}
              </h2>
            </div>
            <span className="bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {products.length} {isRTL ? 'منتج' : 'Articles'}
            </span>
          </div>

          <div className="max-h-[110vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {products.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#C9A227]/10 rounded-xl">
                <p className="text-sm text-gray-500">
                  {isRTL ? 'لا توجد منتجات معروضة حالياً. أضف منتجك الأول!' : 'Aucun produit en stock. Ajoutez votre premier article !'}
                </p>
              </div>
            ) : (
              products.map((p) => {
                const pName = currentLang === 'fr' ? p.name_fr : currentLang === 'en' ? p.name_en : p.name_ar;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 p-3 bg-[#0F1B2E]/50 border border-[#C9A227]/15 rounded-xl hover:border-[#C9A227]/30 transition-all shadow-md group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5EFE0] border border-[#C9A227]/20 shrink-0">
                        <img src={p.image} alt={pName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 text-right">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-xs text-start">
                          {pName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/25 px-1.5 py-0.2 rounded uppercase font-medium">
                            {p.category}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {p.price} MAD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 bg-amber-950/20 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 hover:border-amber-500 rounded-lg transition-all active:scale-95"
                        title={isRTL ? 'تعديل المنتج' : 'Modifier l\'article'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setProductToDelete(p);
                        }}
                        className="p-2 bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg transition-all active:scale-95"
                        title={isRTL ? 'حذف المنتج' : 'Supprimer l\'article'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 sm:right-10 z-50 animate-bounce">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
            toast.type === 'error' 
              ? 'bg-red-950/90 text-red-200 border-red-500/30' 
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
          }`}>
            {toast.type === 'error' ? <X className="w-4 h-4 shrink-0 text-red-400" /> : <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* PRODUCT DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0A1120] border border-[#C9A227]/30 max-w-md w-full p-6 rounded-2xl shadow-2xl relative space-y-6 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                {isRTL ? 'تأكيد حذف المنتج' : 'Confirmer la suppression'}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isRTL 
                  ? `هل أنت متأكد من حذف المنتج: "${productToDelete.name_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                  : `Voulez-vous vraiment supprimer le produit : "${currentLang === 'fr' ? productToDelete.name_fr : productToDelete.name_en}" ? Cette action est irréversible.`}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                  showToast(isRTL ? 'تم حذف المنتج بنجاح!' : 'Produit supprimé avec succès !', 'success');
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95"
              >
                {isRTL ? 'نعم، احذف' : 'Oui, Supprimer'}
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 px-4 rounded-xl text-xs border border-gray-700 transition-all active:scale-95"
              >
                {isRTL ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY DELETE CONFIRMATION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0A1120] border border-[#C9A227]/30 max-w-md w-full p-6 rounded-2xl shadow-2xl relative space-y-6 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Layers className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                {isRTL ? 'تأكيد حذف الفئة' : 'Confirmer la suppression de la catégorie'}
              </h3>
              <p className="text-xs text-red-400 font-semibold leading-relaxed">
                {isRTL 
                  ? `تنبيه هام جداً: حذف فئة "${categoryToDelete.toUpperCase()}" سيؤدي لحذف الفئة وجميع المنتجات المرتبطة بها كلياً وبشكل نهائي!`
                  : `ATTENTION : Supprimer la catégorie "${categoryToDelete.toUpperCase()}" supprimera définitivement cette catégorie ainsi que TOUS les produits associés !`}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  onDeleteCategory(categoryToDelete);
                  setCategoryToDelete(null);
                  showToast(isRTL ? 'تم حذف الفئة وجميع منتجاتها!' : 'Catégorie et tous ses produits supprimés !', 'success');
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95"
              >
                {isRTL ? 'نعم، احذف كل شيء' : 'Oui, Tout Supprimer'}
              </button>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 px-4 rounded-xl text-xs border border-gray-700 transition-all active:scale-95"
              >
                {isRTL ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
