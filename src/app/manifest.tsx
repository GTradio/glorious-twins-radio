import siteMetadata from "@/data/siteMetaData";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.stationName,
    short_name: "GT Radio",
    description: siteMetadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: siteMetadata.theme,
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",

    categories: ["music", "entertainment", "news", "lifestyle"],

    icons: [
      {
        src: "/icons/android-icon-36x36.png",
        sizes: "36x36",
        type: "image/png",
      },
      {
        src: "/icons/android-icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/android-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icons/android-icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/android-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    // PWA capabilities for radio streaming
    display_override: ["window-controls-overlay", "standalone"],

    // Radio-specific shortcuts
    shortcuts: [
      {
        name: "Listen Live",
        short_name: "Live",
        description: "Start listening to GloriousTwins Radio live stream",
        url: "/?action=listen",
        icons: [
          {
            src: "/icons/play-icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Schedule",
        short_name: "Schedule",
        description: "View today's programming schedule",
        url: "/schedule",
        icons: [
          {
            src: "/icons/schedule-icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],

    // Media session capabilities
    protocol_handlers: [
      {
        protocol: "web+radio",
        url: "/?stream=%s",
      },
    ],
  };
}
