import Hero from '../components/home/Hero';
import InspirationGrid from '../components/home/InspirationGrid';
import ExperiencesSection from '../components/home/ExperiencesSection';
import ShopAirbnb from '../components/home/ShopAirbnb';
import SuperhostBanner from '../components/home/SuperhostBanner';
import FutureGetaways from '../components/home/FutureGetaways';

/**
 * The home page at `/`.
 *
 * Composes the six marketing sections in order. It fetches nothing itself
 * — every section is static content or links into the locations page — so
 * it needs no loading or error states.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <InspirationGrid />
      <ExperiencesSection />
      <ShopAirbnb />
      <SuperhostBanner />
      <FutureGetaways />
    </>
  );
}
