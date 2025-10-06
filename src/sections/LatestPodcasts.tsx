import { useMedia } from "@/context/MediaContext";
import podcastService from "@/services/podcastService";
import { Podcast } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LatestPodcastsProps {
  limit?: number;
}

const LatestPodcasts: React.FC<LatestPodcastsProps> = ({ limit = 6 }) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 6;

  const { play: playMedia, currentMedia, isPlaying } = useMedia();

  const fetchPodcasts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * itemsPerPage;
      const response = await podcastService.getPodcasts({
        limit: itemsPerPage,
        offset,
        published: true,
      });

      setPodcasts(response.podcasts);
      setTotalCount(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError("Failed to load podcasts. Please try again.");
      console.error("Error fetching podcasts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePlayPodcast = async (podcast: Podcast) => {
    if (!podcast.audioUrl) {
      console.log("No audio URL available for this podcast");
      return;
    }

    try {
      await podcastService.incrementPlayCount(podcast.id);

      playMedia({
        type: "podcast",
        title: podcast.title,
        url: podcast.audioUrl,
        imageUrl: podcast.imageUrl,
        duration: podcast.duration,
        episodeNumber: podcast.episodeNumber,
        season: podcast.season,
        podcastId: podcast.id,
      });
    } catch (err) {
      console.error("Error playing podcast:", err);
    }
  };

  const isPodcastPlaying = (podcast: Podcast) => {
    return (
      currentMedia?.type === "podcast" &&
      currentMedia?.podcastId === podcast.id &&
      isPlaying
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Latest Podcasts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-600/30 rounded-2xl animate-pulse"
              >
                <div className="aspect-video bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Latest Podcasts
          </h2>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600/30 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Load Podcasts
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => fetchPodcasts(currentPage)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Latest Podcasts
          </h2>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600/30 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Podcasts Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new episodes
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Latest Podcasts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="group bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-600/30 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden relative">
                {podcast.imageUrl ? (
                  <Image
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white/50"
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
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {podcast.duration && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {podcast.duration}
                  </div>
                )}

                {podcast.featured && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Featured
                  </div>
                )}

                {podcast.episodeNumber && (
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {podcast.season ? `S${podcast.season}` : ""} EP{" "}
                    {podcast.episodeNumber}
                  </div>
                )}

                {isPodcastPlaying(podcast) && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-emerald-500 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {podcast.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {podcast.description}
                </p>

                <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">
                  {formatDate(podcast.publishDate)}
                </p>

                <button
                  onClick={() => handlePlayPodcast(podcast)}
                  disabled={!podcast.audioUrl}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPodcastPlaying(podcast) ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      Now Playing
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {podcast.audioUrl ? "Play Episode" : "Coming Soon"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                        currentPage === page
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )
              ) : (
                <>
                  {[1, 2].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                        currentPage === page
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage > 3 && (
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      ...
                    </span>
                  )}
                  {currentPage > 2 && currentPage < totalPages - 1 && (
                    <button
                      onClick={() => setCurrentPage(currentPage)}
                      className="w-8 h-8 rounded-lg bg-emerald-500 text-white"
                    >
                      {currentPage}
                    </button>
                  )}
                  {currentPage < totalPages - 2 && (
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      ...
                    </span>
                  )}
                  {[totalPages - 1, totalPages].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                        currentPage === page
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPodcasts;
