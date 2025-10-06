import { useMemo } from "react";

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

interface FooterProps {
  onToggleContact?: () => void;
}

// Footer Component
const Footer: React.FC<FooterProps> = ({ onToggleContact }) => {
  const year = useMemo(() => new Date().getFullYear(), []);

  // Default social links if none provided
  const defaultSocialLinks: SocialLink[] = [
    { name: "Facebook", href: "#", icon: "📘" },
    { name: "Twitter", href: "#", icon: "🐦" },
    { name: "Instagram", href: "#", icon: "📷" },
    { name: "YouTube", href: "#", icon: "📺" },
  ];

  const displaySocialLinks = defaultSocialLinks;

  const quickLinks = [
    { label: "About Us", action: "scroll", target: "about" },
    { label: "Privacy Policy", action: "navigate", target: "/privacy" },
    { label: "Team of Professionals", action: "scroll", target: "team" },
    { label: "Contact", action: "modal", target: "" },
    { label: "Download our APP", action: "scroll", target: "home" },
  ];

  const handleQuickLinkClick = (
    action: string,
    target: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();

    if (action === "navigate") {
      window.location.href = target;
    } else if (action === "modal") {
      onToggleContact?.();
    } else if (action === "scroll") {
      const section = document.getElementById(target);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="">
      {/* Quote Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>
            </div>

            <blockquote className="text-lg md:text-xl text-gray-300 italic leading-relaxed mb-6">
              "At GloriousTwin FM, we go beyond just radio — we are a voice for
              the people, a hub for inspiration, and a celebration of culture,
              faith, and creativity. From heartwarming music to powerful
              conversations, we connect our community with purpose, passion, and
              excellence."
            </blockquote>

            <div className="w-16 h-0.5 bg-emerald-500 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-gray-800 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-emerald-400">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                {displaySocialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-gray-800/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-500/80 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                    aria-label={social.name}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">📞</span>
                  <span>+234 803 460 1101</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✉️</span>
                  <span>glorioustwinsmediahub@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-emerald-400">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={(e) =>
                        handleQuickLinkClick(item.action, item.target, e)
                      }
                      className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 cursor-pointer flex items-center group w-full text-left"
                    >
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-emerald-400">
                Visit Our Studio
              </h3>
              <div className="space-y-4 text-gray-300 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">📍</span>
                  <p>
                    Block B, Shop 19, Bashorun Islamic Ultra-Modern Complex,
                    <br />
                    Ibadan, Oyo State, Nigeria
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">⏰</span>
                  <p>Station operations: 5AM - 12AM daily</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">📻</span>
                  <p>Frequency: 000.0FM • Ibadan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {year} GloriousTwins Radio | All Rights Reserved
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <a
                href="/privacy"
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
