export * from './types'
export * from './products'
export * from './stores'
export * from './restaurants'
export * from './cinema'
export * from './entertainment'
export * from './services'
export * from './offers'

import { allProducts } from './products'
import { allStores } from './stores'
import { allRestaurants } from './restaurants'
import { allMovies } from './cinema'
import { allEntertainment } from './entertainment'
import { allServices } from './services'

export function searchMallData(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return { products: [], stores: [], restaurants: [], movies: [], entertainment: [], services: [] }

  return {
    products: allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.store.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ),
    stores: allStores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.floor.toLowerCase().includes(q)
    ),
    restaurants: allRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.chef.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    ),
    movies: allMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.language.toLowerCase().includes(q)
    ),
    entertainment: allEntertainment.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    ),
    services: allServices.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q)
    ),
  }
}
