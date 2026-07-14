import { Product, Testimonial, CraftingImage } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name_fr: 'Assiette Royale Fassi en Zellige',
    name_en: 'Royal Blue Fassi Zellige Plate',
    name_ar: 'طبسيل فاسي ملكي بالزليج',
    category: 'ceramics',
    price: 380,
    image: '/src/assets/images/fassi_plate_1783861552280.jpg',
    gallery: [
      '/src/assets/images/fassi_plate_1783861552280.jpg',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590424753858-3c6a188a3068?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Une assiette en céramique de Fès peinte entièrement à la main, arborant de sublimes motifs géométriques inspirés du zellige traditionnel. Parfaite en décoration murale ou pour servir vos convives lors de grandes occasions.',
    description_en: 'A ceramic plate from Fez, entirely hand-painted, featuring sublime geometric motifs inspired by traditional Moroccan zellige. Perfect for wall decoration or serving guests on special occasions.',
    description_ar: 'طبسيل من الفخار الفاسي، مرسوم يدويا بالكامل بتموجات هندسية راقية مستوحاة من الزليج التقليدي العريق. مثالي لتزيين الجدران أو لتقديم الأطباق في المناسبات الخاصة.',
    isBestSeller: true,
    isNewArrival: false,
    material_fr: 'Argile naturelle de Fès, émail sans plomb',
    material_en: 'Natural Fez clay, lead-free glaze',
    material_ar: 'طين فاس الطبيعي، طلاء خال من الرصاص',
    dimensions: 'ø 35 cm',
    weight: '1.4 kg',
    rating: 4.9
  },
  {
    id: 'prod-2',
    name_fr: 'Lanterne Royale en Laiton Ciselé',
    name_en: 'Royal Chiseled Brass Lantern',
    name_ar: 'فانوس ملكي من النحاس المنقوش',
    category: 'lanterns',
    price: 850,
    image: '/src/assets/images/moroccan_lantern_1783861567909.jpg',
    gallery: [
      '/src/assets/images/moroccan_lantern_1783861567909.jpg',
      'https://images.unsplash.com/photo-1565538810844-1e1192116767?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Fabriquée à la main par les maîtres dinandiers, cette lanterne en laiton projette des ombres géométriques fascinantes rappelant les nuits étoilées du désert marocain. Chaque perforation est minutieusement ciselée au burin.',
    description_en: 'Handcrafted by master coppersmiths, this brass lantern projects mesmerizing geometric shadows reminiscent of starry Moroccan desert nights. Each perforation is meticulously hand-chiseled.',
    description_ar: 'فانوس مصنوع يدويا من النحاس الخالص من قبل حرفيين مهرة، يضفي ظلالا هندسية ساحرة تذكر بليالي الصحراء المغربية المرصعة بالنجوم. كل ثقب منقوش يدويا بدقة.',
    isBestSeller: true,
    isNewArrival: true,
    material_fr: '100% Laiton massif',
    material_en: '100% Solid brass',
    material_ar: 'نحاس أصفر خالص 100%',
    dimensions: '25 x 25 x 65 cm',
    weight: '2.8 kg',
    rating: 5.0
  },
  {
    id: 'prod-3',
    name_fr: 'Service de Thé de Fès avec Plateau Zellige',
    name_en: 'Fez Tea Set with Zellige Tray',
    name_ar: 'طقم شاي فاسي مع صينية زليج',
    category: 'tea',
    price: 1200,
    image: '/src/assets/images/tea_set_1783861582174.jpg',
    gallery: [
      '/src/assets/images/tea_set_1783861582174.jpg',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Un service à thé marocain impérial comprenant une théière en laiton argenté ciselé, 6 verres à thé colorés aux ornements dorés, et un magnifique plateau assorti décoré d\'incrustations de carreaux de zellige.',
    description_en: 'An imperial Moroccan tea set including a chiseled silver-plated brass teapot, 6 colorful tea glasses with gold ornaments, and a beautiful matching tray decorated with inlaid zellige tilework.',
    description_ar: 'طقم شاي مغربي ملكي يتضمن براد شاي من النحاس المطلي بالفضة والمنقوش، و 6 كؤوس شاي ملونة بزخارف ذهبية، وصينية رائعة مزينة بقطع من الزليج التقليدي.',
    isBestSeller: true,
    isNewArrival: false,
    material_fr: 'Laiton argenté, verre de Murano, zellige émaillé',
    material_en: 'Silver-plated brass, Murano glass, glazed zellige',
    material_ar: 'نحاس مطلي بالفضة، زجاج مورانو، زليج تقليدي',
    dimensions: 'Plateau ø 40 cm',
    weight: '3.5 kg',
    rating: 4.8
  },
  {
    id: 'prod-4',
    name_fr: 'Miroir Artisanal en Arche de Zellige',
    name_en: 'Handcrafted Zellige Arch Mirror',
    name_ar: 'مرآة تقليدية مقوسة بالزليج',
    category: 'mirrors',
    price: 950,
    image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Ce miroir majestueux arbore la forme typique des portes des palais marocains (arche en trou de serrure), orné d\'un cadre en véritable mosaïque de zellige de Fès de couleurs bleu cobalt, émeraude et ocre.',
    description_en: 'This majestic mirror features the typical shape of Moroccan palace doors (keyhole arch), decorated with a frame made of authentic Fez zellige mosaic tiles in cobalt blue, emerald, and ochre.',
    description_ar: 'مرآة مهيبة تأخذ شكل بوابات القصور المغربية العتيقة (القوس التقليدي)، مزينة بإطار من موزاييك زليج فاس الأصيل بألوان زرقاء ملكية، خضراء زمردية ونحاسية.',
    isBestSeller: false,
    isNewArrival: true,
    material_fr: 'Zellige en argile cuite, bois de cèdre, miroir cristal',
    material_en: 'Fired clay zellige, cedar wood, crystal mirror',
    material_ar: 'زليج الطين المشوي، خشب الأرز، مرآة كريستال',
    dimensions: '50 x 80 cm',
    weight: '4.5 kg',
    rating: 4.9
  },
  {
    id: 'prod-5',
    name_fr: 'Coffret à Bijoux en Bois de Thuya & Nacre',
    name_en: 'Thuya Wood & Mother-of-Pearl Jewelry Box',
    name_ar: 'صندوق مجوهرات من خشب العرعار والصدف',
    category: 'boxes',
    price: 450,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Coffret précieux en bois de thuya d\'Essaouira, poli à la main et incrusté de marqueterie de bois de citronnier et de nacre. Dégage une odeur boisée inimitable, typique des ateliers d\'artisans marocains.',
    description_en: 'Precious jewelry box made of thuya wood from Essaouira, hand-polished and inlaid with marqueterie of lemonwood and mother-of-pearl. It emits a unique, unmistakable woody scent, typical of Moroccan workshops.',
    description_ar: 'علبة مجوهرات ثمينة من خشب العرعار النادر من الصويرة، ملمعة يدويا ومطعمة بخشب الليمون والصدف الطبيعي. تتميز برائحتها العطرية الفريدة والذكية.',
    isBestSeller: false,
    isNewArrival: false,
    material_fr: 'Bois de Thuya sauvage, citronnier, nacre',
    material_en: 'Wild Thuya wood, lemonwood, mother-of-pearl',
    material_ar: 'خشب العرعار البري، خشب الليمون، صدف طبيعي',
    dimensions: '20 x 15 x 10 cm',
    weight: '0.8 kg',
    rating: 4.7
  },
  {
    id: 'prod-6',
    name_fr: 'Tagine de Décoration Émaillé Zellige',
    name_en: 'Decorated Zellige Glazed Tagine',
    name_ar: 'طاجين ديكور مزين بالزليج',
    category: 'ceramics',
    price: 290,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Mini tagine de présentation en terre cuite de Safi, émaillé à haute température avec un chapeau orné de micro-motifs peints à la main évoquant le zellige royal.',
    description_en: 'Mini presentation tagine made of baked clay from Safi, glazed at high temperatures with a lid decorated with hand-painted micro-patterns evoking royal zellige design.',
    description_ar: 'طاجين صغير للتقديم والديكور من الفخار المسموم من مدينة آسفي، مطلي حراريا ومزين بنقوش دقيقة مرسومة يدويا تحاكي هندسة الزليج المغربي.',
    isBestSeller: false,
    isNewArrival: true,
    material_fr: 'Argile cuite de Safi, pigments naturels',
    material_en: 'Baked Safi clay, natural pigments',
    material_ar: 'طين آسفي المشوي، ملونات طبيعية',
    dimensions: 'ø 20 cm, H 18 cm',
    weight: '0.9 kg',
    rating: 4.6
  },
  {
    id: 'prod-7',
    name_fr: 'Eau de Parfum Pur Argan & Fleur d\'Oranger',
    name_en: 'Pure Argan & Orange Blossom Scent',
    name_ar: 'عطر أركان خالص وزهر البرتقال',
    category: 'perfumes',
    price: 320,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Un élixir de parfum envoûtant alliant la douceur apaisante de l\'huile d\'argan cosmétique pure d\'Agadir à la fraîcheur divine de l\'essence de fleur d\'oranger marocaine.',
    description_en: 'An enchanting elixir perfume combining the soothing sweetness of pure cosmetic argan oil from Agadir with the divine freshness of Moroccan orange blossom essence.',
    description_ar: 'عطر ساحر يجمع بين النعومة الفائقة لزيت الأركان التجميلي الخالص من أكادير والانتعاش الفواح لزهر البرتقال المغربي الأصيل.',
    isBestSeller: false,
    isNewArrival: false,
    material_fr: 'Huile d\'argan certifiée bio, distillat de fleur d\'oranger',
    material_en: 'Certified organic argan oil, orange blossom distillate',
    material_ar: 'زيت أركان حيوي معتمد، مقطر زهر البرتقال',
    dimensions: '100 ml',
    weight: '0.3 kg',
    rating: 4.8
  },
  {
    id: 'prod-8',
    name_fr: 'Plateau à thé en Laiton ciselé et Zellige',
    name_en: 'Chiseled Brass & Zellige Tea Tray',
    name_ar: 'صينية شاي نحاسية بالزليج',
    category: 'tea',
    price: 780,
    image: 'https://images.unsplash.com/photo-1590424753858-3c6a188a3068?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590424753858-3c6a188a3068?auto=format&fit=crop&w=600&q=80'
    ],
    description_fr: 'Plateau d\'exception en laiton ciselé doré, avec un fond incrusté d\'un assemblage de carreaux de zellige marocains résistants à la chaleur. L\'accord parfait du métal noble et de la terre émaillée.',
    description_en: 'Exceptional chiseled golden brass tray, featuring a bottom inlaid with a collage of heat-resistant Moroccan zellige tiles. The perfect accord of noble metal and glazed earth.',
    description_ar: 'صينية شاي استثنائية من النحاس الأصفر المنقوش، بقاعدة مرصعة بقطع من الزليج المغربي المقاوم للحرارة. تجسيد حقيقي لتمازج النحاس والطين الأنيق.',
    isBestSeller: false,
    isNewArrival: false,
    material_fr: 'Laiton, carreaux de zellige',
    material_en: 'Brass, zellige tiles',
    material_ar: 'نحاس، قطع زليج',
    dimensions: 'ø 38 cm',
    weight: '2.2 kg',
    rating: 4.9
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Dumont',
    country: 'France',
    rating: 5,
    text_fr: 'Une boutique extraordinaire au cœur du Souk Lhad. Les assiettes en zellige sont d\'une finesse incroyable. J\'en ai acheté trois pour mon salon à Paris et tout le monde m\'en parle ! Service impeccable et emballage ultra-sécurisé pour l\'avion.',
    text_en: 'An extraordinary shop in the heart of Souk Lhad. The zellige plates are incredibly fine. I bought three for my living room in Paris and everyone asks about them! Impeccable service and ultra-secure packaging for the flight.',
    text_ar: 'محل رائع في قلب سوق الأحد. الصحون الفخارية المصنوعة بالزليج غاية في الدقة والجمال. اشتريت ثلاثة لصالوني في باريس والكل معجب بها! المعاملة ممتازة والتغليف آمن جداً ومحكم للسفر.',
    date: '14 Mars 2026'
  },
  {
    id: 't-2',
    name: 'John Miller',
    country: 'United Kingdom',
    rating: 5,
    text_fr: 'The brass lantern is a true piece of art. It creates a magical golden atmosphere in my bedroom. The owner, Mustapha, was incredibly kind and explained the whole artisanal process to us. Highly recommend visiting if you are in Agadir!',
    text_en: 'The brass lantern is a true piece of art. It creates a magical golden atmosphere in my bedroom. The owner, Mustapha, was incredibly kind and explained the whole artisanal process to us. Highly recommend visiting if you are in Agadir!',
    text_ar: 'الفانوس النحاسي تحفة فنية حقيقية. يضفي جوًا ذهبيًا سحريًا على غرفتي. صاحب المحل مصطفى كان لطيفًا للغاية وشرح لنا مراحل الصنع التقليدي بالتفصيل. أنصح بزيارته بشدة إذا كنتم في أكادير!',
    date: '28 Avril 2026'
  },
  {
    id: 't-3',
    name: 'Karim Alaoui',
    country: 'Maroc / Casablanca',
    rating: 5,
    text_fr: 'Qualité exceptionnelle. Rien à voir avec les babioles industrielles pour touristes. Ici, c\'est du vrai fait main marocain de haut niveau. Les motifs de zellige fassi sont tracés au millimètre près. Une fierté nationale.',
    text_en: 'Exceptional quality. Nothing to do with industrial trinkets. Here, it is real high-level handcrafted Moroccan art. The Fassi zellige motifs are drawn with millimeter precision. A national pride.',
    text_ar: 'جودة استثنائية تفوق التوقعات. ليس مثل السلع التجارية المصنعة، بل صناعة تقليدية مغربية راقية ومنقوشة يدويا بدقة عالية. زليج فاس مرسوم بالمليمتر. فخور بوجود محل كهذا بأكادير.',
    date: '02 Juin 2026'
  }
];

export const CRAFTING_GALLERY: CraftingImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
    title_fr: 'Le Modelage de l\'Argile de Fès',
    title_en: 'Fez Clay Molding',
    title_ar: 'تشكيل طين فاس الطبيعي',
    desc_fr: 'L\'argile grise est purifiée, pétrie au pied puis tournée à la main par le maître potier.',
    desc_en: 'The grey clay is purified, kneaded by foot, and then wheel-turned by hand by the master potter.',
    desc_ar: 'يتم تنقية الطين الرمادي، وعجنه بالأقدام ثم تشكيله يدويا على لولب الخرط الدوار.'
  },
  {
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    title_fr: 'Le Tracé des Motifs Géométriques',
    title_en: 'Tracing Geometric Motifs',
    title_ar: 'رسم النقوش الهندسية',
    desc_fr: 'Chaque ligne et étoile de zellige est tracée au pinceau avec des oxydes métalliques naturels.',
    desc_en: 'Each line and star of zellige is painted using a fine brush with natural metallic oxides.',
    desc_ar: 'تُرسم كل خطوط ونجمات الزليج يدويًا بفرشاة دقيقة باستخدام أكاسيد معدنية طبيعية.'
  },
  {
    url: 'https://images.unsplash.com/photo-1590424753858-3c6a188a3068?auto=format&fit=crop&w=600&q=80',
    title_fr: 'La Cuisson Traditionnelle au Four à Bois',
    title_en: 'Traditional Wood Fire Baking',
    title_ar: 'الطهي في فرن الخشب التقليدي',
    desc_fr: 'Les pièces subissent deux cuissons à plus de 1000°C pour vitrifier l\'émail et révéler la couleur.',
    desc_en: 'The pieces undergo two separate firings at over 1000°C to vitrify the glaze and reveal the color.',
    desc_ar: 'تخضع القطع لطهيين متعاقبين يفوقان 1000 درجة مئوية لتزجيج الطلاء وإبراز البريق.'
  }
];

export const INSTAGRAM_FEED = [
  {
    id: 'ig-1',
    image: '/src/assets/images/fassi_plate_1783861552280.jpg',
    likes: '1.2k',
    comments: '42'
  },
  {
    id: 'ig-2',
    image: '/src/assets/images/magashop_hero_1783861535659.jpg',
    likes: '950',
    comments: '29'
  },
  {
    id: 'ig-3',
    image: '/src/assets/images/moroccan_lantern_1783861567909.jpg',
    likes: '2.4k',
    comments: '88'
  },
  {
    id: 'ig-4',
    image: '/src/assets/images/tea_set_1783861582174.jpg',
    likes: '1.8k',
    comments: '56'
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    likes: '820',
    comments: '18'
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80',
    likes: '1.5k',
    comments: '34'
  }
];
