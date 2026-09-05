import type { Brand, ShopTab, Store } from '../types/shop';

export const shopTabs: ShopTab[] = [
  { key: 'top-brands', label: 'Top Brands' },
  { key: 'nearby-stores', label: 'Nearby Stores' },
  { key: 'marketplace', label: 'Marketplace' },
];

export const featuredBrands: Brand[] = [
  {
    id: 'air-india',
    name: 'Air India',
    offer: 'No-cost EMIs upto 18 months',
    initials: 'AI',
  },
  {
    id: 'apple-premium',
    name: 'Apple Premium Reseller',
    offer: 'No-cost EMIs upto 24 months',
    initials: 'AP',
  },
  {
    id: 'caratlane',
    name: 'CaratLane',
    offer: 'No-cost EMIs upto 6 months',
    initials: 'CL',
  },
];

export const nearbyStores: Store[] = [
  {
    id: 'atelier-forbidden',
    name: 'Atelier Forbidden Jou...',
    address: 'Sector 40, Gurugram, Haryana',
    initials: 'AF',
  },
  {
    id: 'tripbouquet',
    name: 'TripBouquet',
    address: '241, Tower B, Spazedge, Gurugram',
    initials: 'TB',
  },
  {
    id: 'charger-on-wheels',
    name: 'Charger On Wheels',
    address: 'Orchid Business Park, Sector 48',
    initials: 'CW',
  },
];
