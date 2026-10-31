import manifest from '@/data/images.json';

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: { author: string; license: string; page: string };
};

type ManifestEntry = { src: string; width: number; height: number; title: string; author: string; license: string; page: string };
const entries = manifest as Record<string, ManifestEntry>;

// Descriptive, keyword-rich alt text per asset (E9-4 requires alt on every image).
const ALT: Record<string, string> = {
  phiphi: 'Aerial view of turquoise bays at the Phi Phi Islands, Thailand',
  bali: 'Green rice terraces in Bali, Indonesia',
  halong: 'Traditional junk boat sailing through the limestone karsts of Ha Long Bay, Vietnam',
  fuji: 'Chureito Pagoda with Mount Fuji behind it, Japan',
  maldives: 'Overwater villas above a turquoise lagoon in the Maldives',
  dubai: 'Dubai skyline with the Burj Khalifa at dusk, UAE',
  r_sea: 'Sunrise over Angkor Wat temple, Siem Reap, Cambodia',
  r_south: 'Sunrise lighting the Himalaya peaks',
  r_east: 'Kiyomizu-dera temple gate in Kyoto, Japan',
  r_central: 'Registan square madrasas in Samarkand, Uzbekistan',
  r_west: 'Hot air balloons over Cappadocia at sunrise, Turkey',
  r_north: 'Ice cave on Olkhon Island, Lake Baikal, Siberia',
  singapore: 'Singapore Central Business District skyline at dusk',
  srilanka: 'Nine Arch Bridge in the tea hills near Ella, Sri Lanka',
  bhutan: "Paro Taktsang (Tiger's Nest) monastery on a cliff, Bhutan",
  georgia: 'Old town rooftops of Tbilisi, Georgia',
  seoul: 'Gyeonghoeru pavilion at Gyeongbokgung Palace, Seoul, South Korea',
  kashmir: 'Shikara boat on Dal Lake, Srinagar, Kashmir',
  kerala: 'Houseboats on the Kerala backwaters, India',
  nepal: 'Boudhanath Stupa in Kathmandu, Nepal',
  hoian: 'Silk lanterns glowing in Hoi An old town, Vietnam',
  act_gardens: 'Supertree Grove at Gardens by the Bay, Singapore',
  act_desert: 'Desert safari over the dunes outside Dubai',
  act_inari: 'Path of red torii gates at Fushimi Inari Taisha, Kyoto',
  act_nusa: 'Kelingking Beach cliffs on Nusa Penida, Bali',
  act_bangkok: 'Golden rooftops of the Grand Palace, Bangkok, at sunrise',
  act_seoul: 'Seoul city skyline, South Korea',
  jordan: 'Al-Khazneh, the Treasury, at Petra, Jordan',
  krabi: 'Longtail boats at Maya Bay, Ko Phi Phi, Krabi province, Thailand',
  plan: 'Blue waters of Pangong Lake in Ladakh, India',
  uzbek: 'Historic old town of Bukhara, Uzbekistan',
  hero_japan: 'Red autumn maple leaves framing Mount Fuji above Lake Kawaguchi, Japan',
  hero_taj: 'The Taj Mahal and its minarets seen across the reflecting pool, Agra, India',
  hero_vietnam: 'Boats on green water below the limestone cliffs of Lan Ha Bay, Vietnam',
  hero_maldives: 'Palm-lined white sand beach curving around a clear turquoise lagoon, Maldives',
  hero_dubai: 'Dubai skyline and the Burj Khalifa reflected in still water at blue hour, UAE',
  hero_singapore: 'Marina Bay Sands, the ArtScience Museum and the lit Helix Bridge above Marina Bay at blue hour, Singapore',
};

export function photo(key: string): Photo {
  const e = entries[key];
  if (!e) throw new Error(`Unknown photo key: ${key}`);
  return {
    src: e.src.split('?')[0]!, // drop Commons tracking params
    width: e.width,
    height: e.height,
    alt: ALT[key] ?? e.title,
    credit: { author: e.author || 'Unknown', license: e.license, page: e.page },
  };
}

export function allPhotos(): Array<Photo & { key: string; title: string }> {
  return Object.entries(entries).map(([key, e]) => ({ key, title: e.title, ...photo(key) }));
}
