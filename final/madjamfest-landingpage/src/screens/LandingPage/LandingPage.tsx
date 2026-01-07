import { useState } from "react";
import { ScrollButton } from "../../components/ScrollButton/ScrollButton";
import { Header } from "./sections/Header/Header";
import { MainHeroSection } from "./sections/MainHeroSection/MainHeroSection";
import { NavigationLinksSection } from "./sections/NavigationLinksSection/NavigationLinksSection";
import { EventDaysSection } from "./sections/EventDaysSection/EventDaysSection";
import { AnnouncementMarqueeSection } from "./sections/AnnouncementMarqueeSection/AnnouncementMarqueeSection";
import { VideoSection } from "./sections/VideoSection/VideoSection";
import { Footer } from "./sections/Footer/Footer";
import { PartnersSection } from "./sections/PartnersSection/PartnersSection";
import { ImageSection } from "./sections/ImageSection/ImageSection";

export const LandingPage = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-black overflow-x-hidden w-full min-w-screen-xl relative">
      <Header onMenuClick={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />
      <MainHeroSection />
      <VideoSection />
      <NavigationLinksSection />
      <EventDaysSection />
      <ImageSection />
      <AnnouncementMarqueeSection />
      <PartnersSection />
      <Footer />
      <ScrollButton />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[999999999999999999] bg-[url('/grain.png')]"
      />
    </div>
  );
};