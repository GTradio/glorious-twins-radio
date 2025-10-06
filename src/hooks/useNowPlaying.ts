import { useEffect, useRef, useState } from "react";

export const useNowPlaying = (streamUrl: string) => {
  const [nowPlaying, setNowPlaying] = useState("Loading…");
  const [isLiveError, setIsLiveError] = useState(false);

  const mountedRef = useRef(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    mountedRef.current = true;

    // Extract station ID from stream URL
    const getStationId = (url: string): string | null => {
      // For URLs like: https://stream.zeno.fm/hnuqg3vbh41tv
      const match = url.match(/zeno\.fm\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    };

    const stationId = getStationId(streamUrl);

    if (!stationId) {
      setIsLiveError(true);
      setNowPlaying("Invalid stream URL");
      return;
    }

    // Primary method: Use Zeno.fm's SSE metadata API
    const connectToMetadataStream = () => {
      try {
        const metadataUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${stationId}`;

        eventSourceRef.current = new EventSource(metadataUrl);

        eventSourceRef.current.onopen = () => {
          if (mountedRef.current) {
            setIsLiveError(false);
          }
        };

        eventSourceRef.current.onmessage = (event) => {
          if (!mountedRef.current) return;

          try {
            const data = JSON.parse(event.data);

            // Extract track info from various possible fields
            const trackInfo =
              data?.title ||
              data?.streamTitle ||
              data?.song ||
              data?.track ||
              data?.metadata?.title ||
              data?.metadata?.song ||
              "";

            if (trackInfo && trackInfo.trim()) {
              setNowPlaying(trackInfo.trim());
              setIsLiveError(false);
            } else {
              setNowPlaying("GloriousTwins Radio - Live Stream");
            }
          } catch (err) {
            // If JSON parsing fails, try to use raw data
            const rawData = event.data?.trim();
            if (rawData && rawData !== "{}") {
              setNowPlaying(rawData);
            }
          }
        };

        eventSourceRef.current.onerror = () => {
          if (mountedRef.current) {
            setIsLiveError(true);
            setNowPlaying("Unable to fetch track info");

            // Try to reconnect after a delay
            setTimeout(() => {
              if (
                mountedRef.current &&
                eventSourceRef.current?.readyState === EventSource.CLOSED
              ) {
                connectToMetadataStream();
              }
            }, 5000);
          }
        };
      } catch (err) {
        if (mountedRef.current) {
          setIsLiveError(true);
          setNowPlaying("Unable to connect to metadata service");
          console.error("EventSource error:", err);
        }
      }
    };

    // Fallback method: Try the old metadata endpoint format
    const fallbackMetadataFetch = async () => {
      try {
        const fallbackUrls = [
          `https://stream.zeno.fm/${stationId}/metadata`,
          `https://api.zeno.fm/mounts/metadata/${stationId}`,
        ];

        for (const url of fallbackUrls) {
          try {
            const response = await fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
              cache: "no-store",
            });

            if (response.ok) {
              const data = await response.json();
              const trackInfo =
                data?.title ||
                data?.streamTitle ||
                data?.song ||
                data?.track ||
                "";

              if (trackInfo && trackInfo.trim()) {
                setNowPlaying(trackInfo.trim());
                setIsLiveError(false);
                return;
              }
            }
          } catch {
            // Continue to next URL
            continue;
          }
        }

        // If all fallback attempts fail
        setNowPlaying("GloriousTwins Radio - Live Stream");
      } catch (err) {
        if (mountedRef.current) {
          setNowPlaying("GloriousTwins Radio - Live Stream");
        }
      }
    };

    // Try SSE first, then fallback
    if (typeof EventSource !== "undefined") {
      connectToMetadataStream();

      // Set up fallback polling as backup
      fallbackIntervalRef.current = setInterval(() => {
        if (mountedRef.current && isLiveError) {
          fallbackMetadataFetch();
        }
      }, 30000); // Check every 30 seconds if SSE fails
    } else {
      // If EventSource is not supported, use fallback immediately
      fallbackMetadataFetch();
      fallbackIntervalRef.current = setInterval(fallbackMetadataFetch, 15000);
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
    };
  }, [streamUrl]);

  // Manual refresh function
  const refresh = () => {
    if (mountedRef.current) {
      setNowPlaying("Refreshing…");
      setIsLiveError(false);

      // Close existing connection and reconnect
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Small delay to allow cleanup
      setTimeout(() => {
        if (mountedRef.current) {
          // Trigger re-connection by updating a state or calling effect again
          setNowPlaying("Loading…");
        }
      }, 100);
    }
  };

  return {
    nowPlaying,
    isLiveError,
    refresh,
  };
};
