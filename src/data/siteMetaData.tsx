// https://www.favicon-generator.org/

import {
  Icon,
  Icons,
  IconURL,
} from "next/dist/lib/metadata/types/metadata-types";

const icons: IconURL | Icon[] | Icons | null | undefined = [
  {
    url: "/icons/apple-touch-icon.png",
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icons/apple-touch-icon.png",
  },
  {
    url: "/icons/favicon-16x16.png",
    href: "/icons/favicon-16x16.png",
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
  },
  {
    url: "/icons/favicon-32x32.png",
    href: "/icons/favicon-32x32.png",
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "mask-icon",
    url: "/icons/safari-pinned-tab.svg",
    href: "/icons/safari-pinned-tab.svg",
    color: "#059669",
  },
  {
    rel: "apple-touch-icon",
    sizes: "57x57",
    url: "/icons/apple-icon-57x57.png",
    href: "/icons/apple-icon-57x57.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "60x60",
    href: "/icons/apple-icon-60x60.png",
    url: "/icons/apple-icon-60x60.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "72x72",
    href: "/icons/apple-icon-72x72.png",
    url: "/icons/apple-icon-72x72.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "76x76",
    href: "/icons/apple-icon-76x76.png",
    url: "/icons/apple-icon-76x76.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "114x114",
    href: "/icons/apple-icon-114x114.png",
    url: "/icons/apple-icon-114x114.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "120x120",
    href: "/icons/apple-icon-120x120.png",
    url: "/icons/apple-icon-120x120.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "144x144",
    href: "/icons/apple-icon-144x144.png",
    url: "/icons/apple-icon-144x144.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "152x152",
    href: "/icons/apple-icon-152x152.png",
    url: "/icons/apple-icon-152x152.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icons/apple-icon-180x180.png",
    url: "/icons/apple-icon-180x180.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/icons/android-icon-192x192.png",
    url: "/icons/android-icon-192x192.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "96x96",
    href: "/icons/favicon-96x96.png",
    url: "/icons/favicon-96x96.png",
  },
  {
    rel: "msapplication-TileColor",
    url: "/icons/ms-icon-144x144.png",
    color: "#059669",
  },
  {
    rel: "msapplication-TileImage",
    href: "/icons/ms-icon-144x144.png",
    url: "/icons/ms-icon-144x144.png",
  },
];

const siteMetadata = {
  title: "GloriousTwins Radio — Live from Ibadan",
  description:
    "GloriousTwins Radio: Your ultimate source for uplifting music, inspiring voices, and unforgettable moments. Streaming live from Ibadan, Nigeria with the best entertainment, gospel music, and community programming.",
  headerTitle: "GloriousTwins Radio",
  stationName: "GloriousTwins Radio",
  frequency: "000.0FM",
  location: "Ibadan, Oyo State, Nigeria",
  theme: "#059669",
  siteUrl: "https://glorioustwinsradio.com", // Replace with actual URL
  siteLogo: "/presenters/logo.jpg",
  socialBanner: "/presenters/logo.jpg",
  streamUrl: "https://stream.zeno.fm/hnuqg3vbh41tv",

  // Contact Information
  email: "glorioustwinsmediahub@gmail.com",
  phone: "+234 803 460 1101",
  phoneSecondary: "+234 915 987 9319",
  address:
    "Block B, Shop 19, Bashorun Islamic Ultra-Modern Complex, Ibadan, Oyo State, Nigeria",

  // Operating Hours
  operatingHours: "5:00 AM - 12:00 AM daily",

  // Social Media
  twitter: "https://twitter.com/glorioustwinsradio", // Replace with actual handles
  facebook: "https://facebook.com/glorioustwinsradio",
  instagram: "https://instagram.com/glorioustwinsradio",
  youtube: "https://youtube.com/@glorioustwinsradio",
  tiktok: "https://tiktok.com/@glorioustwinsradio",

  language: "en-us",
  locale: "en-NG", // Nigerian English
  icons,

  keywords: [
    // Location-specific
    "Ibadan radio station",
    "Oyo State radio",
    "Nigeria radio online",
    "Ibadan FM radio",
    "Southwest Nigeria radio",
    "Yoruba radio station",

    // Content-specific
    "gospel radio station",
    "Christian radio Nigeria",
    "inspirational music radio",
    "Nigerian music radio",
    "live radio streaming",
    "online radio Nigeria",

    // Community-focused
    "Ibadan community radio",
    "local radio station",
    "African radio online",
    "Nigerian entertainment radio",
    "faith-based radio",
    "uplifting music radio",

    // Technical
    "live streaming radio",
    "online radio player",
    "radio app Nigeria",
    "FM radio online",
    "internet radio station",

    // Show-specific
    "morning radio show",
    "midday radio program",
    "afternoon radio show",
    "radio presenters Ibadan",
    "Nigerian radio hosts",

    // Brand-specific
    "GloriousTwins Radio",
    "GloriousTwins FM",
    "Glorious Twins Media Hub",
    "GT Radio",
    "GTR Ibadan",
  ],

  // Station Programming
  shows: [
    "Morning Vibes",
    "Midday Mix",
    "Afternoon Delight",
    "Gospel Hour",
    "Community Spotlight",
  ],

  // Team Members (for SEO)
  presenters: [
    "Olalere Taiwo",
    "Temitope Raifu (LONGSTORY)",
    "M Crown (Owofade Mayowa Mary)",
    "Oloyode Abolaji Faruq (AWIYE EDE)",
  ],
};

export default siteMetadata;
