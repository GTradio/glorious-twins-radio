"use client";

import { useMedia } from "@/context/MediaContext";
import { useEffect, useState } from "react";

const UnifiedPlayer: React.FC = () => {
  const {
    currentMedia,
    isPlaying,
    isLoading,
    volume,
    currentTime,
    duration,
    togglePlayPause,
    setVolume: setMediaVolume,
    stop,
  } = useMedia();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show player when media is loaded
  useEffect(() => {
    if (currentMedia) {
      setIsVisible(true);
    }
  }, [currentMedia]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setMediaVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setMediaVolume(0);
    } else {
      setMediaVolume(0.8);
    }
  };

  const closePlayer = () => {
    setIsVisible(false);
    stop();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Don't render if not visible or no media
  if (!isVisible || !currentMedia) return null;

  // Icon Components
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-5 md:h-5">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-5 md:h-5">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
    </svg>
  );

  const LoadingIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 md:w-5 md:h-5 animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="20"
        fill="none"
      />
    </svg>
  );

  const VolumeIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.653 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.653l3.73-3.814a1 1 0 011.617.814zM14.657 7.757a1 1 0 011.414 0A9.972 9.972 0 0118 12a9.972 9.972 0 01-1.929 4.243 1 1 0 01-1.414-1.414A7.971 7.971 0 0016 12c0-1.751-.563-3.37-1.514-4.686a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const MuteIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.653 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.653l3.73-3.814a1 1 0 011.617.814zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const getMediaIcon = () => {
    if (currentMedia.type === "live") {
      return (
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    );
  };

  const getMediaLabel = () => {
    if (currentMedia.type === "live") return "LIVE";
    if (currentMedia.episodeNumber) {
      return `EP ${currentMedia.episodeNumber}`;
    }
    return "PODCAST";
  };

  return (
    <>
      {/* Mobile Player - Full Width Bottom */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg transition-all duration-300 ease-in-out">
        {/* Collapsed State */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Media Indicator & Info */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
            onClick={toggleExpanded}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              {getMediaIcon()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentMedia.type === "live"
                  ? "Now Playing"
                  : "Playing Podcast"}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentMedia.title}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingIcon />
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            <button
              title="Expand"
              type="button"
              onClick={toggleExpanded}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </button>

            <button
              title="Close"
              type="button"
              onClick={closePlayer}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Expanded State */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 animate-in slide-in-from-bottom duration-300">
            {/* Progress Bar for Podcasts */}
            {currentMedia.type === "podcast" && duration > 0 && (
              <div className="flex items-center gap-2 py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                    style={{
                      width: `${(currentTime / duration) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-3 py-3">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                {volume === 0 ? <MuteIcon /> : <VolumeIcon />}
              </button>

              <input
                title="Volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />

              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-medium">
                {getMediaLabel()}
              </span>
              {currentMedia.duration && currentMedia.type === "podcast" && (
                <span>{currentMedia.duration}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Player - Bottom Right */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out">
          {/* Minimized State */}
          {!isExpanded ? (
            <div
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors min-w-[200px]"
              onClick={toggleExpanded}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                    {getMediaIcon()}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {currentMedia.type === "live" ? "GT Radio" : "Podcast"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-3 h-3 animate-spin"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="60"
                          strokeDashoffset="20"
                          fill="none"
                        />
                      </svg>
                    ) : isPlaying ? (
                      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                        <path
                          d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                        <path d="M8 5v14l11-7z" fill="currentColor" />
                      </svg>
                    )}
                  </button>

                  <button
                    title="Close"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closePlayer();
                    }}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Expanded State */
            <div className="w-80">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                      {getMediaIcon()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {currentMedia.type === "live"
                        ? "GT Radio"
                        : currentMedia.title}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      {getMediaLabel()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      title="Minimize"
                      type="button"
                      onClick={toggleExpanded}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                    >
                      <ChevronDownIcon />
                    </button>
                    <button
                      title="Close"
                      type="button"
                      onClick={closePlayer}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-4">
                {/* Now Playing */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {currentMedia.type === "live"
                      ? "Now Playing"
                      : "Playing Podcast"}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentMedia.title}
                  </div>
                </div>

                {/* Progress Bar for Podcasts */}
                {currentMedia.type === "podcast" && duration > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {formatTime(currentTime)}
                      </span>
                      <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                          style={{
                            width: `${(currentTime / duration) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayPause}
                      disabled={isLoading}
                      className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <LoadingIcon />
                      ) : isPlaying ? (
                        <PauseIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                    >
                      {volume === 0 ? <MuteIcon /> : <VolumeIcon />}
                    </button>

                    <input
                      title="Volume"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              {currentMedia.duration && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Duration: {currentMedia.duration}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1f2937;
          cursor: pointer;
          border: 2px solid #9ca3af;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        .dark .slider::-webkit-slider-thumb {
          background: white;
          border-color: #374151;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #374151;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .dark .slider::-webkit-slider-thumb:hover {
          background: #f3f4f6;
        }
      `}</style>
    </>
  );
};

export default UnifiedPlayer;
