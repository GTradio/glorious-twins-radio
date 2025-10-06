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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">Loading dashboard data...</p>
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
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 mb-2">Failed to load dashboard data</p>
        <button
          onClick={fetchDashboardData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, Admin</p>

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
          icon={<Mail className="text-green-500" />}
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
  <div className="bg-white border rounded-lg p-5 flex justify-between items-center shadow-sm">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
    <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
  </div>
);

const LiveStatus = ({
  currentProgram,
  upcomingPrograms,
}: {
  currentProgram: Program | null;
  upcomingPrograms: Program[];
}) => (
  <div className="bg-white rounded-lg border shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Live Status</h2>
    {currentProgram ? (
      <div className="p-4 bg-green-50 rounded-lg mb-4">
        <p className="text-sm font-semibold text-green-600 mb-1">ON AIR</p>
        <h3 className="text-lg font-bold text-gray-900">
          {currentProgram.name}
        </h3>
        <p className="text-gray-600">with {currentProgram.host}</p>
      </div>
    ) : (
      <p className="text-gray-500 mb-4">No live program currently</p>
    )}

    <h3 className="font-semibold text-gray-900 mb-2">Upcoming Programs</h3>
    <div className="space-y-2">
      {upcomingPrograms.length > 0 ? (
        upcomingPrograms.map((p) => (
          <div
            key={p.id}
            className="p-3 bg-gray-50 rounded-md flex justify-between"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                {p.startTime} - {p.endTime}
              </p>
            </div>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {p.host}
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No upcoming programs today</p>
      )}
    </div>
  </div>
);

const RecentActivityList = ({
  recentActivity,
}: {
  recentActivity: RecentActivity[];
}) => (
  <div className="bg-white rounded-lg border shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
    <div className="space-y-3">
      {recentActivity.length > 0 ? (
        recentActivity.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                a.type === "contact"
                  ? "bg-blue-100"
                  : a.type === "news"
                  ? "bg-orange-100"
                  : "bg-purple-100"
              }`}
            >
              {a.type === "contact" && (
                <MessageSquare className="w-4 h-4 text-blue-600" />
              )}
              {a.type === "news" && (
                <Newspaper className="w-4 h-4 text-orange-600" />
              )}
              {a.type === "podcast" && (
                <Headphones className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{a.title}</p>
              <p className="text-xs text-gray-500">{a.time}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center">No recent activity</p>
      )}
    </div>
  </div>
);

const UnreadMessagesList = ({
  unreadMessages,
}: {
  unreadMessages: ContactMessage[];
}) => (
  <div className="bg-white rounded-lg border shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Unread Messages</h2>
    {unreadMessages.length > 0 ? (
      <div className="space-y-3">
        {unreadMessages.map((m) => (
          <div key={m.id} className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-gray-900">{m.name}</p>
            <p className="text-sm text-gray-600">{m.subject}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 text-center">No unread messages</p>
    )}
  </div>
);

export default AdminDashboard;
