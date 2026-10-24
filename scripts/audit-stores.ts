import { allStores } from '../src/data/stores'
import { allRestaurants } from '../src/data/restaurants'
import { allEntertainment } from '../src/data/entertainment'
import { allServices } from '../src/data/services'
import fs from 'fs'

const summary = {
  stores: allStores.map(s => ({ id: s.id, name: s.name, floor: s.mapLocation?.floor || s.floor, wing: s.mapLocation?.wing, shopNumber: s.mapLocation?.shopNumber })),
  restaurants: allRestaurants.map(r => ({ id: r.id, name: r.name, floor: r.mapLocation?.floor || r.floor, wing: r.mapLocation?.wing, shopNumber: r.mapLocation?.shopNumber })),
  entertainment: allEntertainment.map(e => ({ id: e.id, name: e.name, floor: e.mapLocation?.floor || e.floor, wing: e.mapLocation?.wing, shopNumber: e.mapLocation?.shopNumber })),
  services: allServices.map(s => ({ id: s.id, name: s.name, floor: s.mapLocation?.floor || s.floor, wing: s.mapLocation?.wing, shopNumber: s.mapLocation?.shopNumber }))
}

fs.writeFileSync('scripts/mall-summary.json', JSON.stringify(summary, null, 2))
console.log('Summary saved. Total stores:', summary.stores.length, 'restaurants:', summary.restaurants.length, 'entertainment:', summary.entertainment.length, 'services:', summary.services.length)
