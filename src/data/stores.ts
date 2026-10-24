import { Store } from './types'
import { allProducts } from './products'

export const allStores: Store[] = [
  {
    id: 'zara-flagship',
    name: 'Zara',
    tagline: 'Contemporary European runway fashion, updated twice weekly.',
    category: 'FASHION',
    floor: 'Ground Floor · Central Promenade',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    description: 'Spanish fast-fashion vanguard presenting trendsetting womenswear, menswear, tailored suits, shoes, and modern minimalist outerwear.',
    rating: 4.7,
    reviewCount: 640,
    currentOffers: [
      'Mid-Season Private Sale: Up to 30% off selected styles',
      'Complimentary same-day in-store garment alterations for AURELIA members',
    ],
    similarBrands: ['Mango', 'Massimo Dutti', 'H&M'],
  
    mapLocation: {
      floor: 'G',
      wing: 'South Wing',
      shopNumber: 'G-121',
      x: 21,
      y: 27,
      walkTime: '2 min walk',
      distance: '221m',
      routeSteps: ['Depart Central Atrium', 'Walk South Wing', 'Arrive at G-121']
    }},
  {
    id: 'hm-flagship',
    name: 'H&M',
    tagline: 'Fashion and quality at the best price in a sustainable way.',
    category: 'FASHION',
    floor: 'Ground Floor · Suite 105',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    description: 'Two-story flagship featuring everyday essentials, contemporary trend collections, Divided casual wear, and organic kids clothing.',
    rating: 4.5,
    reviewCount: 520,
    currentOffers: [
      'Garment Recycling Incentive: Bring old clothes for 15% discount voucher',
      'H&M Member 10% bonus on orders above ₹2,999',
    ],
    similarBrands: ['Zara', 'Uniqlo', 'Westside'],
  
    mapLocation: {
      floor: 'G',
      wing: 'Central Atrium',
      shopNumber: 'G-104',
      x: 44,
      y: 68,
      walkTime: '5 min walk',
      distance: '204m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at G-104']
    }},
  {
    id: 'levis-store',
    name: "Levi's",
    tagline: 'Original denim pioneers since 1873.',
    category: 'FASHION',
    floor: 'Floor 02 · Suite 214',
    hours: '10:30 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    description: 'Home of the authentic 501® original and 511™ slim fit jeans. Features an on-site Levi’s Tailor Shop for custom patches, chain stitching, and distressing.',
    rating: 4.8,
    reviewCount: 410,
    currentOffers: [
      'Buy 2 Get 1 Free on all Red Tab graphic tees',
      'Complimentary custom denim monogramming with Tailor Shop master',
    ],
    similarBrands: ['Wrangler', 'Pepe Jeans', 'Lee'],
  
    mapLocation: {
      floor: '2',
      wing: 'Central Atrium',
      shopNumber: '2-149',
      x: 29,
      y: 23,
      walkTime: '5 min walk',
      distance: '249m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 2-149']
    }},
  {
    id: 'lifestyle-flagship',
    name: 'Lifestyle',
    tagline: 'Your one-stop department store for fashion, footwear, and beauty.',
    category: 'FASHION',
    floor: 'Floor 01 · Suite 120',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending',
    description: 'Multi-brand luxury department store hosting premier international and homegrown brands across apparel, footwear, watches, and beauty cosmetics.',
    rating: 4.6,
    reviewCount: 780,
    currentOffers: [
      'Flat 20% cashback on luxury watches and leather accessories',
      'VIP double loyalty points for AURELIA Black Tier patrons',
    ],
    similarBrands: ['Shoppers Stop', 'Westside', 'Pantaloons'],
  
    mapLocation: {
      floor: '2',
      wing: 'West Wing',
      shopNumber: '2-168',
      x: 28,
      y: 76,
      walkTime: '4 min walk',
      distance: '168m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 2-168']
    }},
  {
    id: 'westside-store',
    name: 'Westside',
    tagline: 'Distinctive Indian fashion, home styling, and footwear.',
    category: 'FASHION',
    floor: 'Floor 01 · Suite 130',
    hours: '10:30 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    description: 'Tata retail enterprise presenting in-house private labels including Nuon, Wardrobe, Weststreet, and StudioWest cosmetics.',
    rating: 4.65,
    reviewCount: 390,
    currentOffers: [
      'WestStyleClub Members: Instant ₹500 off on purchases above ₹3,500',
    ],
    similarBrands: ['Lifestyle', 'Pantaloons', 'Marks & Spencer'],
  
    mapLocation: {
      floor: '3',
      wing: 'Central Atrium',
      shopNumber: '3-174',
      x: 54,
      y: 78,
      walkTime: '5 min walk',
      distance: '174m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 3-174']
    }},
  {
    id: 'pantaloons-store',
    name: 'Pantaloons',
    tagline: 'Fresh fashion, vibrant living for the entire family.',
    category: 'FASHION',
    floor: 'Floor 02 · Suite 222',
    hours: '10:00 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
    description: 'Aditya Birla Fashion & Retail’s flagship experience housing contemporary ethnic wear, western formals, party wear, and accessories.',
    rating: 4.5,
    reviewCount: 330,
    currentOffers: [
      'Festive Wedding Season Offer: Up to 25% off on celebratory ethnic collections',
    ],
    similarBrands: ['Max Fashion', 'Westside', 'Reliance Trends'],
  
    mapLocation: {
      floor: '2',
      wing: 'Central Atrium',
      shopNumber: '2-189',
      x: 29,
      y: 23,
      walkTime: '5 min walk',
      distance: '189m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 2-189']
    }},
  {
    id: 'max-fashion',
    name: 'Max Fashion',
    tagline: 'Affordable trends and seasonal style for everyone.',
    category: 'FASHION',
    floor: 'Floor 01 · Suite 140',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=800&q=80',
    description: 'Family fashion destination showcasing thousands of wardrobe styles spanning casual tees, denim, fusion kurtis, and active footwear.',
    rating: 4.4,
    reviewCount: 450,
    currentOffers: [
      'Flat 30% off on second item across fusion kurti racks',
    ],
    similarBrands: ['Pantaloons', 'Reliance Trends', 'Zudio'],
  
    mapLocation: {
      floor: '1',
      wing: 'North Wing',
      shopNumber: '1-115',
      x: 55,
      y: 25,
      walkTime: '1 min walk',
      distance: '215m',
      routeSteps: ['Depart Central Atrium', 'Walk North Wing', 'Arrive at 1-115']
    }},
  {
    id: 'luxe-atelier',
    name: 'Luxe Atelier',
    tagline: 'Haute couture and bespoke eveningwear expressions.',
    category: 'FASHION',
    floor: 'Floor 02 · Suite 210',
    hours: '11:00 AM – 10:00 PM',
    image: '/aurelia/atelier.jpg',
    description: 'Luxe Atelier presents a world of uncompromising craftsmanship and haute couture aesthetics. Founded in Paris and redefined for modern connoisseurs.',
    rating: 4.95,
    reviewCount: 142,
    currentOffers: [
      'Private styling consultation with Head Couturier Laurent Bellier',
      'Complimentary bespoke garment monogramming on select eveningwear',
      'VIP double loyalty points for Black and Signature members',
    ],
    similarBrands: ['Saint Laurent', 'Bottega Veneta', 'Brunello Cucinelli'],
  },

  // ELECTRONICS STORES
  {
    id: 'apple-flagship',
    name: 'Apple Flagship',
    tagline: 'Think Different. Experience the complete Apple ecosystem.',
    category: 'ELECTRONICS',
    floor: 'Floor 01 · Tech Pavilion Suite 101',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    description: 'Flagship Apple Store with full architectural glass facade, Genius Bar technical support, and Today at Apple creative photo and coding masterclasses.',
    rating: 4.96,
    reviewCount: 1420,
    currentOffers: [
      'Trade-in program: Up to ₹55,000 credit for your current smartphone',
      'Complimentary 1-on-1 personal setup session with Apple Specialists',
    ],
    similarBrands: ['Samsung Experience', 'Sony Center', 'Bang & Olufsen'],
  
    mapLocation: {
      floor: '2',
      wing: 'West Wing',
      shopNumber: '2-133',
      x: 53,
      y: 71,
      walkTime: '4 min walk',
      distance: '133m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 2-133']
    }},
  {
    id: 'samsung-store',
    name: 'Samsung Experience Store',
    tagline: 'Galaxy AI is here. Unfold the next generation of mobile innovation.',
    category: 'ELECTRONICS',
    floor: 'Floor 01 · Suite 108',
    hours: '10:00 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    description: 'Interactive Samsung showcase featuring Galaxy S24 Ultra, Z Fold6, Neo QLED 8K televisions, bespoke smart refrigerators, and SmartThings smart home live demos.',
    rating: 4.8,
    reviewCount: 680,
    currentOffers: [
      'Free Galaxy Watch6 with Galaxy S24 Ultra purchase for VIP Black Tier',
      'Instant ₹10,000 upgrade bonus on old smartphone exchange',
    ],
    similarBrands: ['Apple Flagship', 'Croma', 'Reliance Digital'],
  
    mapLocation: {
      floor: '1',
      wing: 'West Wing',
      shopNumber: '1-168',
      x: 68,
      y: 56,
      walkTime: '4 min walk',
      distance: '268m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 1-168']
    }},
  {
    id: 'sony-center',
    name: 'Sony Center',
    tagline: 'Be Moved. World-class audio, imaging, and Bravia display.',
    category: 'ELECTRONICS',
    floor: 'Floor 01 · Suite 115',
    hours: '10:30 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: 'Official Sony showcase featuring Alpha mirrorless full-frame cameras, G Master lenses, PlayStation 5 gaming lounge, and Bravia XR OLED home theater room.',
    rating: 4.88,
    reviewCount: 510,
    currentOffers: [
      'Complimentary 1-year extended warranty on all Bravia XR OLED models',
      'Free camera sensor cleaning service every weekend',
    ],
    similarBrands: ['Apple Flagship', 'Bose', 'Bang & Olufsen'],
  
    mapLocation: {
      floor: '1',
      wing: 'West Wing',
      shopNumber: '1-143',
      x: 23,
      y: 41,
      walkTime: '4 min walk',
      distance: '243m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 1-143']
    }},
  {
    id: 'croma-megastore',
    name: 'Croma',
    tagline: 'Brighter every day with the latest gadgets and electronics.',
    category: 'ELECTRONICS',
    floor: 'Floor 02 · Suite 201',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    description: 'A Tata enterprise offering 500+ tech brands across gaming, laptops, home entertainment, smartphones, and kitchen appliances with expert advice.',
    rating: 4.7,
    reviewCount: 940,
    currentOffers: [
      'Flat ₹3,000 instant bank discount on laptops above ₹60,000',
      '0% interest EMI options on all major credit and debit cards',
    ],
    similarBrands: ['Reliance Digital', 'Vijay Sales'],
  
    mapLocation: {
      floor: '2',
      wing: 'East Wing',
      shopNumber: '2-142',
      x: 62,
      y: 74,
      walkTime: '3 min walk',
      distance: '242m',
      routeSteps: ['Depart Central Atrium', 'Walk East Wing', 'Arrive at 2-142']
    }},
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    tagline: 'Personalising Technology. Discover India’s largest electronics retailer.',
    category: 'ELECTRONICS',
    floor: 'Floor 02 · Suite 205',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    description: 'Huge multi-brand store featuring resQ expert repair service, smart home IoT experience zones, audio testing booths, and pro gaming rigs.',
    rating: 4.65,
    reviewCount: 820,
    currentOffers: [
      'Festival Tech Fest: Up to 40% off on gaming accessories and power banks',
    ],
    similarBrands: ['Croma', 'Vijay Sales'],
  
    mapLocation: {
      floor: '2',
      wing: 'Central Atrium',
      shopNumber: '2-114',
      x: 74,
      y: 38,
      walkTime: '5 min walk',
      distance: '114m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 2-114']
    }},
  {
    id: 'bang-olufsen',
    name: 'Bang & Olufsen',
    tagline: 'Acoustic perfection wrapped in sculptural Danish aluminum.',
    category: 'ELECTRONICS',
    floor: 'Floor 02 · Tech Atelier Suite 224',
    hours: '11:00 AM – 9:30 PM',
    image: '/aurelia/hero.jpg',
    description: 'Danish sound engineering meets high architectural design. Explore the immersive Beosound Theatre Dolby Atmos listening suite.',
    rating: 4.95,
    reviewCount: 64,
    currentOffers: [
      'Private acoustic home consultation with Senior Audio Architect',
      'Custom gold-tone anodizing option exclusive to AURELIA members',
    ],
    similarBrands: ['Devialet', 'Bose', 'McIntosh'],
  },

  // BEAUTY STORES
  {
    id: 'sephora-flagship',
    name: 'Sephora',
    tagline: 'Where beauty thrives. The ultimate international cosmetics wonderland.',
    category: 'BEAUTY',
    floor: 'Ground Floor · Parfumerie Row Suite 102',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    description: 'Global beauty retailer featuring iconic luxury makeup, skincare, and fragrance brands including Dior, Fenty Beauty, Huda Beauty, Dyson, and NARS.',
    rating: 4.9,
    reviewCount: 1120,
    currentOffers: [
      'Complimentary 15-minute customized flash makeover at the Sephora Beauty Studio',
      'Deluxe 3-piece skincare miniature coffret on purchases above ₹6,000',
    ],
    similarBrands: ['Nykaa Luxe', 'MAC Cosmetics', 'Kiehl’s'],
  
    mapLocation: {
      floor: '2',
      wing: 'East Wing',
      shopNumber: '2-117',
      x: 37,
      y: 79,
      walkTime: '3 min walk',
      distance: '117m',
      routeSteps: ['Depart Central Atrium', 'Walk East Wing', 'Arrive at 2-117']
    }},
  {
    id: 'nykaa-luxe',
    name: 'Nykaa Luxe',
    tagline: 'Your beauty destination for prestige international skincare and cosmetics.',
    category: 'BEAUTY',
    floor: 'Floor 01 · Suite 118',
    hours: '10:30 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    description: 'Curated prestige boutique housing Estée Lauder, Clinique, Bobbi Brown, Jo Malone London, and smashbox alongside expert shade-matching consultations.',
    rating: 4.75,
    reviewCount: 680,
    currentOffers: [
      'Nykaa Prive Members: 10% instant rebate on luxury fragrances',
    ],
    similarBrands: ['Sephora', 'Health & Glow', 'MAC'],
  
    mapLocation: {
      floor: '1',
      wing: 'West Wing',
      shopNumber: '1-123',
      x: 23,
      y: 41,
      walkTime: '4 min walk',
      distance: '123m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 1-123']
    }},
  {
    id: 'the-body-shop',
    name: 'The Body Shop',
    tagline: 'Change-making beauty. Cruelty-free skincare inspired by nature.',
    category: 'BEAUTY',
    floor: 'Floor 01 · Suite 112',
    hours: '10:00 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Pioneering ethical British skincare and bodycare retailer. Renowned for Community Fair Trade shea butter, British Rose, and Tea Tree clarifying treatments.',
    rating: 4.65,
    reviewCount: 490,
    currentOffers: [
      'Buy 2 Get 1 Free on all body yogurts and shower gels',
      'Refill Station: 20% off when refilling reusable aluminum bottles',
    ],
    similarBrands: ['L’Occitane', 'Bath & Body Works', 'Lush'],
  
    mapLocation: {
      floor: '2',
      wing: 'West Wing',
      shopNumber: '2-183',
      x: 43,
      y: 61,
      walkTime: '4 min walk',
      distance: '183m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 2-183']
    }},
  {
    id: 'forest-essentials',
    name: 'Forest Essentials',
    tagline: 'Luxurious Ayurveda. Pure cold-pressed oils and royal formulations.',
    category: 'BEAUTY',
    floor: 'Ground Floor · Suite 110',
    hours: '10:30 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Ayurvedic luxury beauty brand crafting cold-pressed organic botanical oils, saffron face treatments, and 24K gold soundarya creams.',
    rating: 4.95,
    reviewCount: 380,
    currentOffers: [
      'Complimentary travel-size Soundarya Radiance Serum with purchases above ₹8,000',
    ],
    similarBrands: ['Kama Ayurveda', 'Sephora', 'L’Occitane'],
  
    mapLocation: {
      floor: 'G',
      wing: 'East Wing',
      shopNumber: 'G-187',
      x: 67,
      y: 49,
      walkTime: '3 min walk',
      distance: '287m',
      routeSteps: ['Depart Central Atrium', 'Walk East Wing', 'Arrive at G-187']
    }},
  {
    id: 'health-glow',
    name: 'Health & Glow',
    tagline: 'Everyday wellness, skincare, and personal grooming essentials.',
    category: 'BEAUTY',
    floor: 'Floor 01 · Suite 125',
    hours: '9:30 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1608248597359-5985854b7c6b?auto=format&fit=crop&w=800&q=80',
    description: 'Trusted personal care and beauty pharmacy offering dermatological skincare, haircare treatments, oral health, and wellness supplements.',
    rating: 4.5,
    reviewCount: 520,
    currentOffers: [
      'Flat 15% off on all Korean skincare and SPF sunscreens',
    ],
    similarBrands: ['Nykaa', 'Watsons', 'Guardian'],
  
    mapLocation: {
      floor: '2',
      wing: 'South Wing',
      shopNumber: '2-116',
      x: 56,
      y: 32,
      walkTime: '2 min walk',
      distance: '216m',
      routeSteps: ['Depart Central Atrium', 'Walk South Wing', 'Arrive at 2-116']
    }},
  {
    id: 'maison-francis',
    name: 'Maison Francis Kurkdjian',
    tagline: 'Perfume as a work of art and liquid emotion.',
    category: 'BEAUTY',
    floor: 'Ground Floor · Parfumerie Row',
    hours: '11:00 AM – 10:00 PM',
    image: '/aurelia/dining.jpg',
    description: 'Enter an olfactory sanctuary conceived by master perfumer Francis Kurkdjian. Experience Baccarat Rouge 540, Grand Soir, and bespoke gold leaf flacon engraving.',
    rating: 4.9,
    reviewCount: 215,
    currentOffers: [
      'Bespoke gold leaf calligraphy on every purchase above ₹50,000',
      'Complimentary miniature coffret discovery gift',
    ],
    similarBrands: ['Byredo', 'Kilian Paris', 'Creed'],
  },

  // JEWELLERY STORES
  {
    id: 'tanishq-store',
    name: 'Tanishq',
    tagline: 'India’s most trusted fine jewellery brand from the house of Tata.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Salon 102',
    hours: '10:30 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Showcasing BIS Hallmarked 22 Karat gold, Rivaah wedding suites, Mia contemporary workwear jewellery, and certified natural diamond solitaire rings.',
    rating: 4.9,
    reviewCount: 880,
    currentOffers: [
      'Gold Exchange Festival: 100% exchange value on old 22KT gold jewellery',
      'Up to 20% off on diamond making charges',
    ],
    similarBrands: ['CaratLane', 'Malabar Gold', 'Kalyan Jewellers'],
  
    mapLocation: {
      floor: 'G',
      wing: 'Central Atrium',
      shopNumber: 'G-134',
      x: 74,
      y: 38,
      walkTime: '5 min walk',
      distance: '134m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at G-134']
    }},
  {
    id: 'kalyan-jewellers',
    name: 'Kalyan Jewellers',
    tagline: 'Trust is everything. Timeless handcrafted gold and bridal heritage.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Suite 109',
    hours: '10:00 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    description: 'Home of the Muhurat bridal collection, Mudhra handcrafted antique gold, and Sankalp traditional temple jewellery certified with 4-Level Quality Assurance.',
    rating: 4.8,
    reviewCount: 650,
    currentOffers: [
      'Complimentary ₹1,000 gold coin voucher on gold purchases above ₹1,00,000',
    ],
    similarBrands: ['Tanishq', 'Malabar Gold', 'Joyalukkas'],
  
    mapLocation: {
      floor: '1',
      wing: 'West Wing',
      shopNumber: '1-158',
      x: 58,
      y: 46,
      walkTime: '4 min walk',
      distance: '158m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 1-158']
    }},
  {
    id: 'malabar-gold',
    name: 'Malabar Gold & Diamonds',
    tagline: 'Celebrate the beauty of life with pure gold and certified diamonds.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Suite 106',
    hours: '10:30 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'Global jewellery retailer presenting Mine certified diamond jewellery, Era uncut diamond sets, and 10 Malabar Promises including transparent pricing and life maintenance.',
    rating: 4.88,
    reviewCount: 710,
    currentOffers: [
      'Zero deduction on gold exchange against Mine certified diamond jewellery',
    ],
    similarBrands: ['Tanishq', 'Kalyan Jewellers', 'Joyalukkas'],
  
    mapLocation: {
      floor: '1',
      wing: 'East Wing',
      shopNumber: '1-187',
      x: 67,
      y: 49,
      walkTime: '3 min walk',
      distance: '287m',
      routeSteps: ['Depart Central Atrium', 'Walk East Wing', 'Arrive at 1-187']
    }},
  {
    id: 'caratlane-store',
    name: 'CaratLane',
    tagline: 'A Tanishq Partnership. Everyday modern diamond jewellery.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Suite 114',
    hours: '10:30 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary lightweight fine diamond jewellery designed for everyday wear. Features interactive 3D virtual try-on and solitaire consultation lounge.',
    rating: 4.85,
    reviewCount: 560,
    currentOffers: [
      'Flat 20% off on diamond value on all solitaire rings and tennis bracelets',
    ],
    similarBrands: ['Tanishq', 'BlueStone', 'Giva'],
  
    mapLocation: {
      floor: '1',
      wing: 'South Wing',
      shopNumber: '1-141',
      x: 61,
      y: 67,
      walkTime: '2 min walk',
      distance: '241m',
      routeSteps: ['Depart Central Atrium', 'Walk South Wing', 'Arrive at 1-141']
    }},
  {
    id: 'senco-gold',
    name: 'Senco Gold & Diamonds',
    tagline: 'Sensational Bengal craftsmanship, pure Kolkata karigari since 1938.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Suite 116',
    hours: '10:30 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    description: 'Renowned for exquisite Kolkata filigree craftsmanship, antique polki choker sets, and Aha everyday silver and diamond collections.',
    rating: 4.75,
    reviewCount: 390,
    currentOffers: [
      'Up to 25% discount on gold jewellery making charges for festive patrons',
    ],
    similarBrands: ['Tanishq', 'Malabar Gold'],
  
    mapLocation: {
      floor: '1',
      wing: 'West Wing',
      shopNumber: '1-103',
      x: 63,
      y: 21,
      walkTime: '4 min walk',
      distance: '103m',
      routeSteps: ['Depart Central Atrium', 'Walk West Wing', 'Arrive at 1-103']
    }},
  {
    id: 'boucheron-salon',
    name: 'Boucheron Paris',
    tagline: 'High jewellery inspired by freedom and emotion since 1858.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Salon 104',
    hours: '11:00 AM – 10:00 PM',
    image: '/aurelia/jewelry.jpg',
    description: 'The first jeweller of Place Vendôme, Boucheron embodies audacity, creative liberty, and visionary gem-setting. Discover Quatre and Serpent Bohème in our VIP salon.',
    rating: 5.0,
    reviewCount: 98,
    currentOffers: [
      'Private viewings of the Carte Blanche High Jewellery archives',
      'Complimentary gemological appraisal & ultrasonic cleansing suite',
    ],
    similarBrands: ['Cartier', 'Van Cleef & Arpels', 'Bulgari'],
  
    mapLocation: {
      floor: '1',
      wing: 'South Wing',
      shopNumber: '1-151',
      x: 71,
      y: 77,
      walkTime: '2 min walk',
      distance: '251m',
      routeSteps: ['Depart Central Atrium', 'Walk South Wing', 'Arrive at 1-151']
    }},
  {
    id: 'audemars-piguet',
    name: 'Audemars Piguet',
    tagline: 'To break the rules, you must first master them.',
    category: 'JEWELLERY',
    floor: 'Floor 01 · Horlogerie Wing',
    hours: '11:00 AM – 9:30 PM',
    image: '/aurelia/hero.jpg',
    description: 'From Le Brassus in the Vallée de Joux, Audemars Piguet continues to redefine haute horlogerie with Royal Oak openworked tourbillons and minute repeaters.',
    rating: 4.98,
    reviewCount: 86,
    currentOffers: [
      'Exclusive allocation access for AURELIA Black & Signature tiers',
      'Private watchmaker masterclass with Master Horologist',
    ],
    similarBrands: ['Patek Philippe', 'Vacheron Constantin', 'F.P. Journe'],
  },

  // GROCERY STORE
  {
    id: 'fresh-mart-grocery',
    name: 'Fresh Mart Grocery',
    tagline: 'Organic produce, artisanal bakery, gourmet deli, and daily staples.',
    category: 'GROCERY',
    floor: 'Basement · Hypermarket Level B1',
    hours: '8:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    description: '30,000 sq ft gourmet hypermarket offering farm-to-table organic fruits and veggies, international cheeses, fresh sourdough bakery, and daily home essentials.',
    rating: 4.85,
    reviewCount: 1680,
    currentOffers: [
      'Wednesday Super Saver: Flat 15% off on fresh organic fruits & greens',
      'Free home delivery to your residence within 2 hours for orders over ₹999',
    ],
    similarBrands: ["Nature's Basket", 'Foodhall', 'Star Bazaar'],
  },

  // SPORTS STORES
  {
    id: 'nike-flagship',
    name: 'Nike Flagship',
    tagline: 'Just Do It. Premium athletic performance and streetwear.',
    category: 'SPORTS',
    floor: 'Floor 01 · Suite 122',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: 'Dynamic sports pavilion showcasing Pegasus running tech, Jordan basketball sneakers, Dri-FIT apparel, and live treadmill gait analysis.',
    rating: 4.9,
    reviewCount: 1140,
    currentOffers: [
      'Nike Run Club Members: Free personalized gait analysis & shoe fitting',
      'Buy 2 performance training apparel items, get 15% off',
    ],
    similarBrands: ['Adidas Originals', 'Puma', 'Under Armour'],
  
    mapLocation: {
      floor: '1',
      wing: 'Central Atrium',
      shopNumber: '1-149',
      x: 69,
      y: 63,
      walkTime: '5 min walk',
      distance: '249m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 1-149']
    }},
  {
    id: 'decathlon-sports',
    name: 'Decathlon Sports',
    tagline: 'All sports under one roof. Innovative equipment for beginners and pros.',
    category: 'SPORTS',
    floor: 'Floor 02 · Suite 230',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    description: 'Sprawling mega-sporting store covering 70+ sports: cricket, football, hiking, badminton, swimming, cycling, yoga, and camping with test zones.',
    rating: 4.85,
    reviewCount: 1480,
    currentOffers: [
      'End of Season Sports Carnival: Up to 30% off on camping tents & cardio gear',
      'Free lifetime cycle tune-up service for Decathlon bicycle buyers',
    ],
    similarBrands: ['Nike', 'Adidas', 'Under Armour'],
  
    mapLocation: {
      floor: '2',
      wing: 'Central Atrium',
      shopNumber: '2-174',
      x: 74,
      y: 38,
      walkTime: '5 min walk',
      distance: '174m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 2-174']
    }},
  {
    id: 'under-armour',
    name: 'Under Armour',
    tagline: 'Protect This House. Hard-core athletic training and compression wear.',
    category: 'SPORTS',
    floor: 'Floor 02 · Suite 228',
    hours: '10:30 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    description: 'Engineered for athletes: Project Rock training collection, HeatGear cooling baselayers, HOVR running footwear, and high-support athletic wear.',
    rating: 4.8,
    reviewCount: 520,
    currentOffers: [
      'Flat 20% off on Project Rock workout duffels and training gloves',
    ],
    similarBrands: ['Nike Flagship', 'Puma', 'Adidas Originals'],
  },

  // KIDS STORES
  {
    id: 'hamleys-store',
    name: 'Hamleys',
    tagline: 'The finest toy shop in the world. Where imagination comes alive.',
    category: 'KIDS',
    floor: 'Floor 03 · Family & Kids World Suite 301',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80',
    description: 'Enchanting experiential toy kingdom with live magic demonstrations, giant LEGO build stations, remote control test tracks, and mascot parades.',
    rating: 4.92,
    reviewCount: 1350,
    currentOffers: [
      'Free Hamleys Bear plush toy on purchases above ₹5,000',
      'Weekend LEGO master builder workshop free for kids',
    ],
    similarBrands: ['Lego Store', 'Mothercare'],
  
    mapLocation: {
      floor: '2',
      wing: 'Central Atrium',
      shopNumber: '2-149',
      x: 69,
      y: 63,
      walkTime: '5 min walk',
      distance: '149m',
      routeSteps: ['Depart Central Atrium', 'Walk Central Atrium', 'Arrive at 2-149']
    }},
  {
    id: 'mothercare-store',
    name: 'Mothercare',
    tagline: 'Caring for parents and babies every step of the journey.',
    category: 'KIDS',
    floor: 'Floor 03 · Suite 308',
    hours: '10:30 AM – 9:30 PM',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
    description: 'Specialist British retailer of organic maternity apparel, newborn clothing, safe pushchairs, ergonomic car seats, and baby nursery furniture.',
    rating: 4.75,
    reviewCount: 460,
    currentOffers: [
      'Newborn Essentials Bundle: Save 20% on multi-pack organic rompers',
    ],
    similarBrands: ['Chicco', 'Hamleys', 'H&M Kids'],
  },
  {
    id: 'kids-play-zone',
    name: 'Kids Play Zone',
    tagline: 'Interactive soft play, trampolines, ball pits & joyful creative fun.',
    category: 'KIDS',
    floor: 'Floor 03 · Family & Kids World Suite 310',
    hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80',
    description: 'Padded multi-level indoor jungle gym and experiential entertainment zone for children. Spiral tunnel slides, foam ball battle pits, rock climbing walls, toddler sensory zones, AR interactive games, and supervised birthday parties.',
    rating: 4.9,
    reviewCount: 780,
    currentOffers: [
      '2-hour play pass with complimentary grip socks at ₹799',
      'VIP Birthday Party Celebration Package: 18% off advance bookings',
    ],
    similarBrands: ['Hamleys', 'Funky Monkey', 'Smaaash'],
    mapLocation: {
      floor: '3',
      wing: 'East Wing',
      shopNumber: '3-402',
      x: 72,
      y: 24,
      walkTime: '3 min walk',
      distance: '172m',
      routeSteps: ['Depart Central Atrium', 'Walk East Wing', 'Arrive at 3-402']
    }
  },
]

// Dynamically attach products belonging to each store as their featuredCollection
allStores.forEach((store) => {
  const matchingProducts = allProducts.filter((p) => p.storeId === store.id || p.store.toLowerCase().includes(store.name.toLowerCase()))
  if (matchingProducts.length > 0) {
    store.featuredCollection = matchingProducts.map((p) => ({
      title: p.name,
      price: `₹${p.price.toLocaleString('en-IN')}`,
      image: p.image,
      id: p.id,
    }))
  } else {
    store.featuredCollection = [
      {
        title: `${store.name} Signature Collection`,
        price: 'Explore In Store',
        image: store.image,
      },
    ]
  }
})
