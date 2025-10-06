"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onListenLive: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onToggleContact: () => void;
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "schedule", label: "Schedule" },
  { id: "podcasts", label: "Podcast" },
  { id: "news", label: "News" },
];

const Navigation: React.FC<NavigationProps> = ({
  isDark,
  onToggleTheme,
  onListenLive,
  menuOpen,
  onToggleMenu,
  onToggleContact,
}) => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100; // Offset for fixed header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 64; // Account for fixed header height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    if (menuOpen) {
      onToggleMenu();
    }
  };

  return (
    <>
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Logo />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  <span className="text-emerald-500">GloriousTwins</span> Radio
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors duration-200 relative ${
                    activeSection === item.id
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

              <button
                type="button"
                onClick={onToggleContact}
                className="hidden cursor-pointer md:inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Contact
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={onToggleMenu}
                className="md:hidden p-2 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={menuOpen}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          onListenLive={onListenLive}
          activeSection={activeSection}
          onNavigate={scrollToSection}
          onToggleContact={onToggleContact}
        />
      </nav>
    </>
  );
};

export default Navigation;
