"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import contactService from "@/services/contactService";
import newsService from "@/services/newsService";
import podcastService from "@/services/podcastService";
import programService from "@/services/programService";
import { ContactMessage, News, Podcast, Program } from "@/types";
import {
  AlertCircle,
  Calendar,
  Eye,
  Headphones,
  Mail,
  MessageSquare,
  Newspaper,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  programs: {
    total: number;
    active: number;
    featured: number;
  };
  podcasts: {
    total: number;
    published: number;
    featured: number;
  };
  news: {
    total: number;
    published: number;
    featured: number;
    totalViews: number;
  };
  contacts: {
    total: number;
    unread: number;
    todayCount: number;
  };
}

interface RecentActivity {
  type: "news" | "podcast" | "program" | "contact";
  title: string;
  time: string;
  status: string;
  id: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    programs: { total: 0, active: 0, featured: 0 },
    podcasts: { total: 0, published: 0, featured: 0 },
    news: { total: 0, published: 0, featured: 0, totalViews: 0 },
    contacts: { total: 0, unread: 0, todayCount: 0 },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [upcomingPrograms, setUpcomingPrograms] = useState<Program[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [newsResponse, podcastsResponse, programsData, contactsData] =
        await Promise.all([
          newsService.getNews({ limit: 50 }),
          podcastService.getPodcasts({ limit: 50 }),
          programService.getPrograms(),
          contactService.getMessages(),
        ]);

      // Contact stats
      const today = new Date().toDateString();
      const todaysMessages = contactsData.filter(
        (m) => new Date(m.createdAt).toDateString() === today
      );
      const contactStats = {
        total: contactsData.length,
        unread: contactsData.filter((m) => m.status === "unread").length,
        todayCount: todaysMessages.length,
      };

      // News, Podcast, Program stats
      const newsStats = {
        total: newsResponse.total,
        published: newsResponse.news.filter((n) => n.published).length,
        featured: newsResponse.news.filter((n) => n.featured).length,
        totalViews: newsResponse.news.reduce(
          (sum, n) => sum + (n.views || 0),
          0
        ),
      };

      const podcastStats = {
        total: podcastsResponse.total,
        published: podcastsResponse.podcasts.filter((p) => p.published).length,
        featured: podcastsResponse.podcasts.filter((p) => p.featured).length,
      };

      const programStats = {
        total: programsData.length,
        active: programsData.filter((p) => p.active).length,
        featured: programsData.filter((p) => p.featured).length,
      };

      setStats({
        programs: programStats,
        podcasts: podcastStats,
        news: newsStats,
        contacts: contactStats,
      });

      // Unread messages
      setUnreadMessages(
        contactsData.filter((m) => m.status === "unread").slice(0, 5)
      );

      // Recent activity
      const activities: RecentActivity[] = [
        ...contactsData.slice(0, 2).map((message: ContactMessage) => ({
          type: "contact" as const,
          title: `New message from ${message.name}`,
          time: formatRelativeTime(message.createdAt),
          status: message.status,
          id: message.id,
        })),
        ...newsResponse.news.slice(0, 2).map((news: News) => ({
          type: "news" as const,
          title: `"${news.title}" ${news.published ? "published" : "drafted"}`,
          time: formatRelativeTime(news.publishDate || news.createdAt),
          status: news.published ? "published" : "draft",
          id: news.id,
        })),
        ...podcastsResponse.podcasts.slice(0, 2).map((podcast: Podcast) => ({
          type: "podcast" as const,
          title: `"${podcast.title}" ${
            podcast.published ? "uploaded" : "drafted"
          }`,
          time: formatRelativeTime(podcast.publishDate || podcast.createdAt),
          status: podcast.published ? "published" : "draft",
          id: podcast.id,
        })),
      ];

      setRecentActivity(activities.slice(0, 6));

      // Current and upcoming programs
      const now = new Date();
      const currentDay = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][now.getDay()];
      const currentTime = now.toTimeString().slice(0, 5);
      const todaysPrograms = programsData
        .filter((p) => p.day === currentDay && p.active)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      const current = todaysPrograms.find(
        (p) => currentTime >= p.startTime && currentTime <= p.endTime
      );
      setCurrentProgram(current || null);
      setUpcomingPrograms(
        todaysPrograms.filter((p) => currentTime < p.startTime).slice(0, 2)
      );
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return "Less than an hour ago";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Loading dashboard data...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load dashboard data
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
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
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Welcome back, Admin
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Programs"
          value={stats.programs.active}
          sub={`${stats.programs.featured} featured`}
          icon={<Calendar className="text-orange-500" />}
        />
        <StatCard
          title="Total Podcasts"
          value={stats.podcasts.total}
          sub={`${stats.podcasts.published} published`}
          icon={<Headphones className="text-purple-500" />}
        />
        <StatCard
          title="Total News Views"
          value={stats.news.totalViews.toLocaleString()}
          sub={`${stats.news.published} published`}
          icon={<Eye className="text-blue-500" />}
        />
        <StatCard
          title="Unread Messages"
          value={stats.contacts.unread}
          sub={`${stats.contacts.todayCount} new today`}
          icon={<Mail className="text-emerald-500" />}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveStatus
            currentProgram={currentProgram}
            upcomingPrograms={upcomingPrograms}
          />
        </div>

        <div className="space-y-6">
          <RecentActivityList recentActivity={recentActivity} />
          <UnreadMessagesList unreadMessages={unreadMessages} />
        </div>
      </div>
    </div>
  );
};

/* --- UI Helper Components --- */

const StatCard = ({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-600/30 rounded-2xl p-5 flex justify-between items-center shadow-2xl transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-500/50">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {sub && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
      )}
    </div>
    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-full">
      {icon}
    </div>
  </div>
);

const LiveStatus = ({
  currentProgram,
  upcomingPrograms,
}: {
  currentProgram: Program | null;
  upcomingPrograms: Program[];
}) => (
  <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-600/30 shadow-2xl p-6 transition-all duration-300">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      Live Status
    </h2>
    {currentProgram ? (
      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl mb-4">
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
          ON AIR
        </p>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {currentProgram.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          with {currentProgram.host}
        </p>
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        No live program currently
      </p>
    )}

    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
      Upcoming Programs
    </h3>
    <div className="space-y-2">
      {upcomingPrograms.length > 0 ? (
        upcomingPrograms.map((p) => (
          <div
            key={p.id}
            className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {p.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {p.startTime} - {p.endTime}
              </p>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded h-fit">
              {p.host}
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No upcoming programs today
        </p>
      )}
    </div>
  </div>
);

const RecentActivityList = ({
  recentActivity,
}: {
  recentActivity: RecentActivity[];
}) => (
  <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-600/30 shadow-2xl p-6 transition-all duration-300">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      Recent Activity
    </h2>
    <div className="space-y-3">
      {recentActivity.length > 0 ? (
        recentActivity.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                a.type === "contact"
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : a.type === "news"
                  ? "bg-orange-100 dark:bg-orange-900/30"
                  : "bg-purple-100 dark:bg-purple-900/30"
              }`}
            >
              {a.type === "contact" && (
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
              {a.type === "news" && (
                <Newspaper className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              )}
              {a.type === "podcast" && (
                <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {a.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {a.time}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No recent activity
        </p>
      )}
    </div>
  </div>
);

const UnreadMessagesList = ({
  unreadMessages,
}: {
  unreadMessages: ContactMessage[];
}) => (
  <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-600/30 shadow-2xl p-6 transition-all duration-300">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      Unread Messages
    </h2>
    {unreadMessages.length > 0 ? (
      <div className="space-y-3">
        {unreadMessages.map((m) => (
          <div
            key={m.id}
            className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <p className="font-medium text-gray-900 dark:text-white">
              {m.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {m.subject}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        No unread messages
      </p>
    )}
  </div>
);

export default AdminDashboard;
