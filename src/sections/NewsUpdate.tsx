import newsService from "@/services/newsService";
import { News } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

interface NewsUpdateProps {
  limit?: number;
}

const NewsUpdate: React.FC<NewsUpdateProps> = ({ limit = 4 }) => {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 4;

  const fetchNews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * itemsPerPage;
      const response = await newsService.getNews({
        limit: itemsPerPage,
        offset,
        published: true,
      });

      setNewsItems(response.news);
      setTotalCount(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError("Failed to load news. Please try again.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleReadMore = (newsId: string) => {
    window.location.href = `/news/${newsId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            News Update
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 animate-pulse"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                  </div>
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
            News Update
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
              Unable to Load News
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => fetchNews(currentPage)}
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

  if (newsItems.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            News Update
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No News Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for the latest updates
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
          News Update
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="group bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600/50"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-xl relative">
                  {news.imageUrl ? (
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center text-gray-500 dark:text-gray-500 text-xs">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatDate(news.publishDate)}
                    </div>
                    {news.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        {news.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {news.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 line-clamp-2">
                    {news.description}
                  </p>

                  <div className="flex items-center gap-3 mb-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>{estimateReadTime(news.content)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {news.views.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleReadMore(news.id)}
                    className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-medium transition-colors duration-200 cursor-pointer"
                  >
                    Read More
                    <svg
                      className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
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

export default NewsUpdate;
