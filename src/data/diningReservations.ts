export interface DiningReservation {
  id: string
  restaurantId: string
  restaurantName: string
  restaurantFloor: string
  restaurantChef: string
  restaurantCuisine: string
  restaurantImage?: string
  guests: string
  date: string
  timeSlot: string
  dietary: string
  specialRequests?: string
  guestName: string
  memberTier: string
  tablePlacement: string
  reservationCode: string
  status: 'CONFIRMED' | 'SEATED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export const DEFAULT_RESERVATION: DiningReservation = {
  id: 'res-default-gor',
  restaurantId: 'lecrin-celeste',
  restaurantName: "L'Écrin Céleste",
  restaurantFloor: 'Level 03 · Terrace Skygardens Suite 310',
  restaurantChef: 'Chef Jean-Luc Laurent (3 Michelin Stars)',
  restaurantCuisine: 'Modern French Haute Gastronomy',
  restaurantImage: '/aurelia/dining.jpg',
  guests: '2 Guests',
  date: 'Today (Tonight)',
  timeSlot: '20:00',
  dietary: 'Grand Prestige Tasting with Rare Wine Pairing',
  specialRequests: 'Terrace Window overlooking Central Grand Atrium & Water Cascade',
  guestName: 'Gor Kishan',
  memberTier: 'AURELIA Black Member #8921',
  tablePlacement: 'Terrace Window overlooking Atrium',
  reservationCode: 'AUR-892104',
  status: 'CONFIRMED',
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T11:30:00.000Z',
}

const STORAGE_KEY = 'aurelia_dining_reservations_v2'

export function getStoredReservations(): DiningReservation[] {
  if (typeof window === 'undefined') return [DEFAULT_RESERVATION]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_RESERVATION]))
      return [DEFAULT_RESERVATION]
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return [DEFAULT_RESERVATION]
  } catch {
    return [DEFAULT_RESERVATION]
  }
}

export function saveOrUpdateReservation(reservation: DiningReservation): DiningReservation[] {
  if (typeof window === 'undefined') return [reservation]
  try {
    const current = getStoredReservations()
    const index = current.findIndex(
      (r) => r.id === reservation.id || r.restaurantId === reservation.restaurantId
    )
    let updated: DiningReservation[]
    if (index >= 0) {
      updated = [...current]
      updated[index] = {
        ...updated[index],
        ...reservation,
        updatedAt: new Date().toISOString(),
      }
    } else {
      updated = [
        {
          ...reservation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...current,
      ]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('aurelia_reservation_updated', { detail: updated }))
    return updated
  } catch {
    return [reservation]
  }
}

export function cancelStoredReservation(id: string): DiningReservation[] {
  if (typeof window === 'undefined') return []
  try {
    const current = getStoredReservations()
    const updated = current.map((r) =>
      r.id === id ? { ...r, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() } : r
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('aurelia_reservation_updated', { detail: updated }))
    return updated
  } catch {
    return []
  }
}
