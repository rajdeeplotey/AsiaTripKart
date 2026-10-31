import type { DestinationSuggestion } from './search-types';

// MOCK DATA for the search API routes, until the real backend is connected.
export const mockDestinations: (DestinationSuggestion & { minPrice: number; listingQuery: string })[] = [
  { id: 'thailand', name: 'Thailand', type: 'country', packageCount: 34, minPrice: 29999, imageUrl: '/images/phi-phi-islands-aerial-thailand.jpg', listingQuery: 'q=Thailand' },
  { id: 'bali', name: 'Bali', type: 'region', packageCount: 28, minPrice: 42999, imageUrl: '/images/bali-rice-terraces-indonesia.jpg', listingQuery: 'q=Bali' },
  { id: 'maldives', name: 'Maldives', type: 'country', packageCount: 19, minPrice: 89999, imageUrl: '/images/maldives-overwater-villas.jpg', listingQuery: 'q=Maldives' },
  { id: 'vietnam', name: 'Vietnam', type: 'country', packageCount: 22, minPrice: 44999, imageUrl: '/images/ha-long-bay-junk-boat-vietnam.jpg', listingQuery: 'q=Vietnam' },
  { id: 'japan', name: 'Japan', type: 'country', packageCount: 15, minPrice: 119999, imageUrl: '/images/chureito-pagoda-mount-fuji-japan.jpg', listingQuery: 'q=Japan' },
  { id: 'phi-phi-islands', name: 'Phi Phi Islands, Thailand', type: 'region', packageCount: 9, minPrice: 34999, imageUrl: '/images/playa-maya-ko-phi-phi-tailandia-2013-08-19-dd-13.jpg', listingQuery: 'q=Thailand' },
  { id: 'thailand-honeymoon', name: 'Thailand honeymoon', type: 'trip-style', packageCount: 12, minPrice: 54999, listingQuery: 'q=Thailand&theme=honeymoon' },
];

// Phi Phi and Thailand honeymoon are subsets of Thailand, so they don't add to the total.
export const mockCatalogue = mockDestinations.filter((d) => d.type !== 'trip-style' && d.id !== 'phi-phi-islands');
