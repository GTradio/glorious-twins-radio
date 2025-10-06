"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface MediaItem {
  type: "live" | "podcast";
  title: string;
  url: string;
  imageUrl?: string;
  duration?: string;
  episodeNumber?: number;
  season?: number;
  podcastId?: string;
}

interface MediaContextType {
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  play: (media: MediaItem) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  togglePlayPause: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volume;
    audioRef.current = audio;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const play = useCallback(
    (media: MediaItem) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Stop current playback if switching media
      if (currentMedia && currentMedia.url !== media.url) {
        audio.pause();
        audio.currentTime = 0;
      }

      setCurrentMedia(media);
      audio.src = media.url;
      audio.load();

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsLoading(false);
      });
    },
    [currentMedia]
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentMedia) return;

    audio.play().catch((error) => {
      console.error("Error resuming audio:", error);
    });
  }, [currentMedia]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentMedia(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    audio.volume = clampedVolume;
  }, []);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio || !currentMedia) return;

      audio.currentTime = time;
      setCurrentTime(time);
    },
    [currentMedia]
  );

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (currentMedia) {
      resume();
    }
  }, [isPlaying, currentMedia, pause, resume]);

  const value: MediaContextType = {
    currentMedia,
    isPlaying,
    isLoading,
    volume,
    currentTime,
    duration,
    play,
    pause,
    resume,
    stop,
    setVolume,
    seek,
    togglePlayPause,
  };

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
