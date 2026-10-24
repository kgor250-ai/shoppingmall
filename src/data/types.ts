export interface MallLocation {
  floor: 'G' | '1' | '2' | '3' | 'P1' | 'P2';
  wing: string;
  shopNumber: string;
  x: number;
  y: number;
  walkTime?: string;
  distance?: string;
  routeSteps?: string[];
}

export interface Product {
  id: string
  name: string
  brand: string
  category: 'FASHION' | 'ELECTRONICS' | 'BEAUTY' | 'JEWELLERY' | 'GROCERY' | 'SPORTS' | 'KIDS' | 'ENTERTAINMENT' | 'DINING' | string
  subCategory: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  availability: string
  store: string
  storeId: string
  floor: string
  image: string
  badge?: string
  description: string
  tags: string[]
  featured: boolean
  isNew: boolean
  isTrending: boolean
  isBestSeller: boolean
  offers?: string
  couponCode?: string
  offerValidity?: string
}

export interface Store {
  id: string
  name: string
  tagline: string
  category: string
  floor: string
  hours: string
  image: string
  badge?: string
  description: string
  rating: number
  reviewCount: number
  currentOffers: string[]
  similarBrands: string[]
  featuredCollection?: { title: string; price: string; image: string; id?: string }[]
  mapLocation?: MallLocation
}

export interface Restaurant {
  id: string
  name: string
  tagline: string
  cuisine: string
  price: string
  rating: number
  reviewCount: number
  floor: string
  hours: string
  image: string
  chef: string
  ambience: string
  vegetarianFriendly: boolean
  description: string
  signatureDishes: { name: string; desc: string; price: string }[]
  offers?: string[]
  featured?: boolean
  mapLocation?: MallLocation
}

export interface Movie {
  id: string
  title: string
  poster: string
  genre: string
  language: string
  duration: string
  rating: number
  screen: string
  showtimes: string[]
  availableSeats: number
  bookingStatus: 'Selling Fast' | 'Available' | 'Almost Full' | 'Housefull'
  offers: string
  certificate?: string
  mapLocation?: MallLocation
}

export interface Entertainment {
  id: string
  name: string
  category: string
  image: string
  description: string
  rating: number
  price: string
  location: string
  floor: string
  timing: string
  availability: string
  bookingStatus: string
  mapLocation?: MallLocation
}

export interface Service {
  id: string
  name: string
  category: string
  provider: string
  description: string
  rating: number
  price: string
  floor: string
  openingHours: string
  image: string
  mapLocation?: MallLocation
}

export interface Offer {
  id: string
  campaign: string
  maison: string
  tagline: string
  validity: string
  image: string
  code: string
  details: string
  privilege: string
  discountPercentage?: number
  category?: string
}
