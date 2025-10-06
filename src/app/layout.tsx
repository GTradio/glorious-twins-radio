import { ThemeProvider } from "@/context/ThemeContext";
import siteMetadata from "@/data/siteMetaData";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteMetadata.theme },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.stationName}`,
  },
  description: siteMetadata.description,

  // Canonical URL
  alternates: {
    canonical: siteMetadata.siteUrl,
  },

  // Open Graph for social media sharing
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.stationName,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1200,
        height: 630,
        alt: `${siteMetadata.stationName} - Live from ${siteMetadata.location}`,
      },
    ],
    locale: siteMetadata.locale,
    type: "website",
  },

  // Enhanced robots configuration for radio station
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Twitter/X Cards optimized for radio content
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [
      {
        url: siteMetadata.socialBanner,
        alt: `${siteMetadata.stationName} - ${siteMetadata.frequency}`,
      },
    ],
  },

  // Enhanced metadata for radio station
  authors: [{ name: siteMetadata.stationName, url: siteMetadata.siteUrl }],
  creator: siteMetadata.stationName,
  publisher: siteMetadata.stationName,

  // Business/Organization schema
  applicationName: siteMetadata.stationName,
  referrer: "origin-when-cross-origin",

  // Additional radio-specific metadata
  other: {
    "format-detection": "telephone=yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteMetadata.stationName,
    "msapplication-TileColor": siteMetadata.theme,
    "msapplication-config": "/icons/browserconfig.xml",
    "theme-color": siteMetadata.theme,

    // Radio station specific
    "station-frequency": siteMetadata.frequency,
    "station-location": siteMetadata.location,
    "operating-hours": siteMetadata.operatingHours,
  },

  icons: siteMetadata.icons,
  keywords: siteMetadata.keywords,
  manifest: "/manifest.json",

  // Verification (add your actual verification codes)
  verification: {
    google: "", // Add Google Search Console verification
    // bing: "", // Add Bing verification if needed
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        {/* Enhanced meta tags for radio station */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        {/* Preconnect to critical external domains */}
        <link rel="preconnect" href="https://stream.zeno.fm" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for social media and streaming */}
        <link rel="dns-prefetch" href="//stream.zeno.fm" />
        <link rel="dns-prefetch" href="//facebook.com" />
        <link rel="dns-prefetch" href="//instagram.com" />
        <link rel="dns-prefetch" href="//twitter.com" />
        <link rel="dns-prefetch" href="//youtube.com" />
        <link rel="dns-prefetch" href="//tiktok.com" />

        {/* Structured data for radio station */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RadioStation",
              name: siteMetadata.stationName,
              url: siteMetadata.siteUrl,
              logo: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
              image: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
              description: siteMetadata.description,
              broadcastFrequency: siteMetadata.frequency,
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "Block B, Shop 19, Bashorun Islamic Ultra-Modern Complex",
                addressLocality: "Ibadan",
                addressRegion: "Oyo State",
                addressCountry: "NG",
              },
              telephone: siteMetadata.phone,
              email: siteMetadata.email,
              sameAs: [
                siteMetadata.facebook,
                siteMetadata.twitter,
                siteMetadata.instagram,
                siteMetadata.youtube,
                siteMetadata.tiktok,
              ],
              openingHours: "Mo-Su 05:00-24:00",
              potentialAction: {
                "@type": "ListenAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: siteMetadata.streamUrl,
                  actionPlatform: [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform",
                  ],
                },
              },
            }),
          }}
        />
      </head>

      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
