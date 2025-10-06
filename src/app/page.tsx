"use client";

import ContactModal from "@/components/ContactModal";
import LivePlayer from "@/components/LivePlayer";
import Navigation from "@/components/Navigation";
import UnifiedPlayer from "@/components/UnifiedPlayer";
import { MediaProvider } from "@/context/MediaContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { useTheme } from "@/hooks/useTheme";
import AboutSection from "@/sections/AboutSection";
import Footer from "@/sections/Footer";
import HeroSection from "@/sections/HeroSection";
import LatestPodcasts from "@/sections/LatestPodcasts";
import NewsUpdate from "@/sections/NewsUpdate";
import ScheduleSection from "@/sections/ScheduleSection";
import TeamSection from "@/sections/TeamSection";
import { FC, useState } from "react";

const STREAM_URL = "https://stream.zeno.fm/hnuqg3vbh41tv";
const META_URL = "https://stream.zeno.fm/hnuqg3vbh41tv/metadata";

const HomeContent: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { nowPlaying, isLiveError } = useNowPlaying(META_URL);

  const onListenLive = () => {
    document
      .getElementById("live-player")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleContact = () => setContactOpen((v) => !v);

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black text-gray-900 dark:text-gray-100">
      <header id="header">
        <Navigation
          isDark={isDarkMode}
          onToggleTheme={toggleTheme}
          onListenLive={onListenLive}
          menuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          onToggleContact={toggleContact}
        />
      </header>

      <main id="main">
        <section id="home">
          <HeroSection onListenLive={onListenLive} />
          <LivePlayer
            nowPlaying={nowPlaying}
            isLiveError={isLiveError}
            streamUrl={STREAM_URL}
          />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="schedule">
          <ScheduleSection />
        </section>

        <section id="podcasts">
          <LatestPodcasts />
        </section>

        <section id="team">
          <TeamSection />
        </section>

        <section id="news">
          <NewsUpdate />
        </section>
      </main>

      <Footer onToggleContact={toggleContact} />

      <UnifiedPlayer />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
};

const Home: FC = () => {
  return (
    <MediaProvider>
      <HomeContent />
    </MediaProvider>
  );
};

export default Home;
