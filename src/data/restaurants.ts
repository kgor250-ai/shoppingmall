import { Restaurant } from './types'

export const allRestaurants: Restaurant[] = [
  {
    id: 'lecrin-celeste',
    
    name: "L'Écrin Céleste",
    tagline: 'Modern French Haute Gastronomie overlooking the illuminated glass skybridge.',
    cuisine: 'French Haute',
    price: '₹₹₹₹₹',
    rating: 4.96,
    reviewCount: 320,
    floor: 'Level 03 · Terrace Skygardens Suite 310',
    hours: '18:30 – 23:30',
    image: '/aurelia/dining.jpg',
    chef: 'Chef Jean-Luc Laurent (3 Michelin Stars)',
    ambience: 'Intimate Candlelight & Skyline Panorama',
    vegetarianFriendly: true,
    description: 'Perched atop AURELIA with panoramic views of the water cascade, L’Écrin Céleste delivers precision French cuisine elevated by rare seasonal truffles, hand-harvested Breton langoustines, and a private 2,400-bottle Grand Cru cellar.',
    signatureDishes: [
      {
        name: 'Oscietra Caviar Tartlet',
        desc: 'Crème crue, smoked dashi jelly, 24k gold leaf',
        price: '₹4,800',
      
    },
      {
        name: 'Brittany Blue Lobster',
        desc: 'Vin jaune emulsion, winter chanterelles, glazed salsify',
        price: '₹8,200',
      },
      {
        name: 'Black Périgord Truffle Soufflé',
        desc: 'Single origin Madagascar vanilla foam',
        price: '₹3,400',
      },
    ],
    offers: ['Complimentary Sommelier pairing on 8-course tasting degustation for Black Tier'],
    featured: true,
  },
  {
    id: 'matsue-omakase',
    
    name: 'Matsue Ginza Omakase',
    tagline: 'Authentic 18-course Edomae sushi counter flown daily from Toyosu Market Tokyo.',
    cuisine: 'Japanese Omakase',
    price: '₹₹₹₹₹',
    rating: 4.98,
    reviewCount: 210,
    floor: 'Level 03 · Hinoki Pavilion Suite 312',
    hours: '19:00 & 21:30 Seating',
    image: '/aurelia/atelier.jpg',
    chef: 'Master Shigeo Matsue',
    ambience: '300-Year Hinoki Wood Counter, Zen Minimalist',
    vegetarianFriendly: false,
    description: 'An exclusive 10-seat counter crafted from sacred 300-year-old Japanese Hinoki cypress. Every course is prepared in front of guests with wild-caught fish aged according to Edo-period techniques.',
    signatureDishes: [
      {
        name: 'Otoro Nigiri Smoked with Cherrywood',
        desc: 'Wild Bluefin tuna belly, 15-year nikiri shoyu',
        price: 'Omakase Course',
      
    },
      {
        name: 'Hokkaido Bafun Uni & Caviar Gunkan',
        desc: 'Sea urchin from Rishiri Island, crispy nori',
        price: 'Omakase Course',
      },
    ],
    featured: true,
  },
  {
    id: 'saffron-conservatory',
    
    name: 'The Saffron Conservatory',
    tagline: 'Royal Awadhi and Kashmiri heirloom recipes served in an opulent botanical greenhouse.',
    cuisine: 'Indian',
    price: '₹₹₹₹',
    rating: 4.92,
    reviewCount: 450,
    floor: 'Level 02 · Grand Botanical Palm Court',
    hours: '12:30 – 15:30 & 19:00 – 23:00',
    image: '/aurelia/hero.jpg',
    chef: 'Ustad Mehmood Qureshi',
    ambience: 'Verdant Glasshouse, Live Sitar, Rosewater Mist',
    vegetarianFriendly: true,
    description: 'Reinventing royal Nawabi banquets with Kashmiri saffron infusions, slow charcoal dum pukht cooking in sealed silver deghs, and artisanal breads baked over pink Himalayan salt stones.',
    signatureDishes: [
      {
        name: 'Dal Dum Pukht 36-Hour Simmer',
        desc: 'Smoked with white charcoal and clarified cow butter',
        price: '₹2,200',
      
    },
      {
        name: 'Saffron Nadru & Morels Dum Biryani',
        desc: 'Wild Himalayan morels, aged Basmati, 24k gold varq',
        price: '₹3,600',
      },
    ],
    offers: ['15% dining privilege on private cabana reservations'],
    featured: true,
  },
  {
    id: 'the-green-table',
    
    name: 'The Green Table',
    tagline: '100% Organic Pure Vegetarian Gourmet & Plant-Forward Haute Dining.',
    cuisine: 'Vegetarian',
    price: '₹₹',
    rating: 4.75,
    reviewCount: 580,
    floor: 'Floor 03 · Terrace Court Suite 305',
    hours: '11:30 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    chef: 'Chef Ananya Sen',
    ambience: 'Living Green Moss Walls, Sunlight Skylights, Earthy Ceramics',
    vegetarianFriendly: true,
    description: 'Farm-to-fork plant gastronomy sourcing all ingredients from regenerative bio-dynamic farms. Pure vegetarian menu with extensive vegan and Jain options.',
    signatureDishes: [
      {
        name: 'Truffled Wild Forest Morel Risotto',
        desc: 'Acquerello carnaroli rice, cashew parmesan emulsion',
        price: '₹1,450',
      
    },
      {
        name: 'Charred Avocado & Burrata Carpaccio',
        desc: 'Heirloom tomato water reduction, micro basil',
        price: '₹950',
      },
    ],
    offers: ['10% healthy dining discount with Digital Wallet Pass'],
    featured: true,
  },
  {
    id: 'trattoria-bella-vista',
    
    name: 'Trattoria Bella Vista',
    tagline: 'Artisanal Neapolitan wood-fired pizza and handmade fresh pasta.',
    cuisine: 'Italian',
    price: '₹₹₹',
    rating: 4.8,
    reviewCount: 420,
    floor: 'Floor 03 · Piazza Promenade Suite 302',
    hours: '12:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    chef: 'Chef Matteo Rossi',
    ambience: 'Rustic Tuscan Terracotta, Copper Hanging Pans, Warm Olive Wood',
    vegetarianFriendly: true,
    description: 'Baking sourdough pizzas at 480°C in a volcanic stone oven imported from Naples. Fresh pasta rolled by hand every morning using organic semolina.',
    signatureDishes: [
      {
        name: 'Pizza Tartufo e Burrata',
        desc: 'Fior di latte, black summer truffle paste, fresh burrata',
        price: '₹1,850',
      
    },
      {
        name: 'Hand-Cut Pappardelle al Funghi',
        desc: 'Porcini ragù, aged Parmigiano Reggiano 24-month',
        price: '₹1,400',
      },
    ],
    featured: false,
  },
  {
    id: 'mainland-dynasty',
    
    name: 'Mainland Dynasty',
    tagline: 'Imperial Peking Duck, Cantonese Dim Sum, and fiery Sichuan delicacies.',
    cuisine: 'Chinese',
    price: '₹₹₹',
    rating: 4.85,
    reviewCount: 390,
    floor: 'Floor 03 · Suite 315',
    hours: '12:30 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    chef: 'Master Chef Chen Wei',
    ambience: 'Crimson Velvet, Carved Teak Screens, Golden Dragon Accents',
    vegetarianFriendly: true,
    description: 'Specializing in authentic wood-roasted Peking Duck carved tableside, translucent crystal dumplings, and hand-pulled Dan Dan noodles.',
    signatureDishes: [
      {
        name: 'Imperial Wood-Fired Peking Duck',
        desc: 'Steamed lotus pancakes, hoisin reduction, cucumber batons',
        price: '₹3,200',
      
    },
      {
        name: 'Truffle Edamame Crystal Dumplings (4 Pcs)',
        desc: 'Hand-folded spinach starch skin, white truffle oil',
        price: '₹950',
      },
    ],
    featured: false,
  },
  {
    id: 'cafe-de-paris',
    
    name: 'Café de Paris & Boulangerie',
    tagline: 'Parisian sidewalk cafe culture, flaky butter croissants, and fine espresso.',
    cuisine: 'Cafe',
    price: '₹₹',
    rating: 4.7,
    reviewCount: 680,
    floor: 'Ground Floor · North Atrium Garden',
    hours: '8:30 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    chef: 'Chef Émilie Dupont',
    ambience: 'Rattan Bistro Chairs, Marble Round Tables, Fresh Flower Vases',
    vegetarianFriendly: true,
    description: 'Charming Parisian café serving single-origin French press coffee, layered Viennoiserie pastries, savory croque-monsieurs, and artisanal quiches.',
    signatureDishes: [
      {
        name: 'Almond & Pistachio Double-Baked Croissant',
        desc: 'Normandy butter puff pastry, frangipane cream',
        price: '₹420',
      
    },
      {
        name: 'Avocado Tartine with Poached Free-Range Eggs',
        desc: 'Toasted sourdough, za’atar, radish carpaccio',
        price: '₹750',
      },
    ],
    featured: false,
  },
  {
    id: 'smokehouse-grill',
    
    name: 'Smokehouse Social Grill',
    tagline: 'Smoky prime brisket, gourmet smashed burgers, and loaded thick-cut fries.',
    cuisine: 'Fast Food',
    price: '₹₹',
    rating: 4.65,
    reviewCount: 510,
    floor: 'Floor 03 · Food Lounge Suite 320',
    hours: '11:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    chef: 'Chef Ryan Miller',
    ambience: 'Industrial Brick, Neon Signs, Leather Booths, Rock Acoustics',
    vegetarianFriendly: true,
    description: 'American smokehouse serving 14-hour hickory-smoked ribs, double smashed wagyu beef and crispy paneer burgers, and decadent craft milkshakes.',
    signatureDishes: [
      {
        name: 'The Ultimate Truffle Melt Smash Burger',
        desc: 'Caramelized shallots, melted aged cheddar, brioche bun',
        price: '₹850',
      
    },
      {
        name: 'Smoked Jalapeño Mac & Cheese Skillet',
        desc: 'Crispy panko crust, 3-cheese molten sauce',
        price: '₹620',
      },
    ],
    featured: false,
  },
  {
    id: 'pierre-herme',
    
    name: 'Pierre Hermé Haute Pâtisserie',
    tagline: 'The Picasso of Pastry. Legendary Ispahan macarons and chocolates.',
    cuisine: 'Desserts',
    price: '₹₹₹',
    rating: 4.95,
    reviewCount: 390,
    floor: 'Ground Floor · Luxury Arcade Suite 104',
    hours: '10:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    chef: 'Master Pierre Hermé',
    ambience: 'Jewellery-Style Glass Cloches, Polished Brass, Velvet Cases',
    vegetarianFriendly: true,
    description: 'Haute confectionery salon showcasing world-famous Ispahan (rose, raspberry, lychee) macarons, single-origin chocolate bonbons, and layered entremets.',
    signatureDishes: [
      {
        name: 'Signature Ispahan Macaron Gift Coffret (Box of 8)',
        desc: 'Rose petal buttercream, fresh whole raspberries, lychee',
        price: '₹2,800',
      
    },
      {
        name: '24K Gold Leaf Dark Chocolate Mousse Dome',
        desc: '72% Venezuelan dark cacao, crunchy praline base',
        price: '₹950',
      },
    ],
    featured: true,
  },
  {
    id: 'blue-tokai-roastery',
    
    name: 'Blue Tokai Roastery & Brew Bar',
    tagline: 'Freshly roasted Indian specialty coffees and artisanal cold brews.',
    cuisine: 'Beverages',
    price: '₹₹',
    rating: 4.8,
    reviewCount: 720,
    floor: 'Floor 02 · Central Balcony Kiosk 202',
    hours: '9:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    chef: 'Head Barista Rahul Varma',
    ambience: 'Sunlit Timber Counter, Cold Drip Towers, Roasted Coffee Aroma',
    vegetarianFriendly: true,
    description: 'Farm-direct coffee experience offering manual pour-overs (V60, Aeropress, Chemex), nitrogen-infused cold brews, and iced matcha lattes.',
    signatureDishes: [
      {
        name: 'Nitro Cold Brew on Tap',
        desc: 'Velvety smooth cascara-infused draft cold coffee',
        price: '₹340',
      
    },
      {
        name: 'Iced Spanish Latte with Oat Milk',
        desc: 'Double espresso shot, condensed milk, cinnamon dust',
        price: '₹380',
      },
    ],
    featured: false,
  },
  {
    id: 'royal-punjab-tandoor',
    
    name: 'Royal Punjab Tandoor',
    tagline: 'Generous clay oven grills, velvety butter gravies, and garlic naans.',
    cuisine: 'Indian',
    price: '₹₹₹',
    rating: 4.78,
    reviewCount: 640,
    floor: 'Floor 03 · Suite 325',
    hours: '12:00 PM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    chef: 'Chef Gurpreet Singh',
    ambience: 'Copper Tableware, Brass Lanterns, Royal Haveli Arches',
    vegetarianFriendly: true,
    description: 'Hearty Amritsari tandoori grills, rich Dal Makhani simmered overnight over slow charcoal embers, and pillowy stuffed kulchas.',
    signatureDishes: [
      {
        name: 'Murgh Makhani 1950 Heritage Recipe',
        desc: 'Smoked chicken tikka in sun-dried tomato cream gravy',
        price: '₹890',
      
    },
      {
        name: 'Paneer Tikka Zaffrani',
        desc: 'Stuffed malai paneer cubes, saffron-cardamom marinade',
        price: '₹750',
      },
    ],
    featured: false,
  },
  {
    id: 'gelato-milano',
    
    name: 'Gelato Milano Artisanal Creamery',
    tagline: 'Silky authentic Italian gelato churned fresh hourly.',
    cuisine: 'Desserts',
    price: '₹₹',
    rating: 4.88,
    reviewCount: 480,
    floor: 'Floor 01 · Central Promenade Kiosk',
    hours: '11:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
    chef: 'Gelataio Marco Conti',
    ambience: 'Glossy Italian Terrazzo, Pastel Pink & Brass Accents',
    vegetarianFriendly: true,
    description: 'Authentic pozzetti gelato counter using fresh organic milk, Sicilian bronte pistachios, and fresh fruit sorbettos with 0% dairy.',
    signatureDishes: [
      {
        name: 'Pure Bronte Pistachio & Dark Chocolate Stracciatella Cone',
        desc: 'Handmade waffle cone dipped in warm melted chocolate',
        price: '₹380',
      },
    ],
    featured: false,
  },
]
