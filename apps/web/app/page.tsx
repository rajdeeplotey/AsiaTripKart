import { Hero } from '@/components/home/Hero';
import { Newsletter } from '@/components/home/Newsletter';
import { PlanMyTrip } from '@/components/home/PlanMyTrip';
import {
  BestSellers,
  DealsBanner,
  Partners,
  RegionTiles,
  Reviews,
  SeasonalPicks,
  Stories,
  ThemeChips,
  ThingsToDo,
  TrendingDestinations,
  WhyUs,
} from '@/components/home/Sections';

// The 14 home blocks in their default order. In production this order (and visibility) comes from GET /v1/pages/home.
export default function HomePage() {
  return (
    <>
      <Hero />
      <RegionTiles />
      <TrendingDestinations />
      <BestSellers />
      <ThemeChips />
      <DealsBanner />
      <ThingsToDo />
      <WhyUs />
      <PlanMyTrip />
      <SeasonalPicks />
      <Reviews />
      <Stories />
      <Partners />
      <Newsletter />
    </>
  );
}
