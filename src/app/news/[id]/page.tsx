"use client";

import newsService from "@/services/newsService";
import { News } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const NewsDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchNewsDetail(id);
    }
  }, [id]);

  const fetchNewsDetail = async (newsId: string) => {
    try {
      setLoading(true);
      setError(null);

      const newsDetail = await newsService.getNewsById(newsId);
      setNews(newsDetail);

      // Increment view count
      await newsService.incrementViewCount(newsDetail);

      // Fetch related news (same category)
      if (newsDetail.category) {
        const related = await newsService.getNewsByCategory(
          newsDetail.category,
          4
        );
        const filteredRelated = related.news.filter((n) => n.id !== newsId);
        setRelatedNews(filteredRelated.slice(0, 3));
      }
    } catch (err) {
      setError("Failed to load news article. Please try again.");
      console.error("Error fetching news detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = news?.title || "";

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Article Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>

        {/* Main Article Card */}
        <article className="bg-white dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden mb-8">
          {/* Featured Image */}
          {news.imageUrl && (
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 md:p-12">
            {/* Category & Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {news.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {news.category}
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-500 text-sm">
                {estimateReadTime(news.content)}
              </span>
              <span className="text-gray-500 dark:text-gray-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
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
                {news.views.toLocaleString()} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {news.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {news.description}
            </p>

            {/* Author & Date */}
            <div className="flex items-center gap-6 pb-6 mb-8 border-b border-gray-200 dark:border-gray-700">
              {news.author && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                    {news.author[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {news.author}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(news.publishDate)}
                    </p>
                  </div>
                </div>
              )}
              {!news.author && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Published on {formatDate(news.publishDate)}
                </p>
              )}
            </div>

            {/* Article Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>

            {/* Share Buttons */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Share this article
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => shareArticle("twitter")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                  Twitter
                </button>
                <button
                  onClick={() => shareArticle("facebook")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={() => shareArticle("linkedin")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </button>
                <button
                  onClick={() => shareArticle("whatsapp")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.id}`}
                  className="group bg-white dark:bg-gray-900/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {related.imageUrl ? (
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white/50"
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
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetailPage;
