"use client";

import ImageUpload from "@/components/ImageUpload";
import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/axios";
import { deleteImage } from "@/lib/supabase/storage";
import { formatDate } from "@/lib/utils";
import podcastService from "@/services/podcastService";
import {
  CreatePodcastDTO,
  Podcast,
  PodcastsResponse,
  UpdatePodcastDTO,
} from "@/types";
import {
  Edit,
  Eye,
  EyeOff,
  Headphones,
  Play,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PodcastFormData {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  audioUrl: string;
  duration: string;
  episodeNumber: number | undefined;
  season: number | undefined;
  featured: boolean;
  published: boolean;
  publishDate: string;
}

const initialFormData: PodcastFormData = {
  title: "",
  description: "",
  content: "",
  imageUrl: "",
  audioUrl: "",
  duration: "",
  episodeNumber: undefined,
  season: undefined,
  featured: false,
  published: true,
  publishDate: new Date().toISOString().split("T")[0],
};

const AdminPodcastsPage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [formData, setFormData] = useState<PodcastFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterPublished, setFilterPublished] = useState<
    "all" | "published" | "draft"
  >("all");

  const ITEMS_PER_PAGE = 10;

  const fetchPodcasts = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response: PodcastsResponse = await podcastService.getPodcasts({
        limit: ITEMS_PER_PAGE,
        offset,
      });

      setPodcasts(response.podcasts);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts(currentPage);
  }, [currentPage]);

  const handleOpenModal = (podcast?: Podcast) => {
    if (podcast) {
      setEditingPodcast(podcast);
      setFormData({
        title: podcast.title,
        description: podcast.description,
        content: podcast.content || "",
        imageUrl: podcast.imageUrl,
        audioUrl: podcast.audioUrl || "",
        duration: podcast.duration || "",
        episodeNumber: podcast.episodeNumber,
        season: podcast.season,
        featured: podcast.featured,
        published: podcast.published,
        publishDate: podcast.publishDate
          ? new Date(podcast.publishDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setEditingPodcast(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPodcast(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const podcastData = {
        ...formData,
        episodeNumber: formData.episodeNumber
          ? Number(formData.episodeNumber)
          : undefined,
        season: formData.season ? Number(formData.season) : undefined,
      };

      if (editingPodcast) {
        const updateData: UpdatePodcastDTO = {
          id: editingPodcast.id,
          ...podcastData,
        };
        await podcastService.updatePodcast(updateData);
      } else {
        await podcastService.createPodcast(podcastData as CreatePodcastDTO);
      }

      await fetchPodcasts(currentPage);
      handleCloseModal();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const itemToDelete = podcasts.find((n) => n.id === id);
      await podcastService.deletePodcast(id);

      if (itemToDelete?.imageUrl?.includes("supabase.co")) {
        await deleteImage(itemToDelete.imageUrl);
      }

      await fetchPodcasts(currentPage);
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterPublished === "all" ||
      (filterPublished === "published" && podcast.published) ||
      (filterPublished === "draft" && !podcast.published);
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Podcasts Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your podcast episodes and audio content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Episodes</p>
              <p className="text-2xl font-bold text-gray-900">
                {podcasts.length}
              </p>
            </div>
            <Headphones className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {podcasts.filter((p) => p.published).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {podcasts.filter((p) => !p.published).length}
              </p>
            </div>
            <EyeOff className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {podcasts.filter((p) => p.featured).length}
              </p>
            </div>
            <Play className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filter */}
            <select
              title="Filter podcasts by publication status"
              value={filterPublished}
              onChange={(e) =>
                setFilterPublished(
                  e.target.value as "all" | "published" | "draft"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Podcast
          </button>
        </div>
      </div>

      {/* Podcasts Grid */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            <Headphones className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : filteredPodcasts.length === 0 ? (
          <div className="p-12 text-center">
            <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No podcasts found</p>
          </div>
        ) : (
          <>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    {podcast.imageUrl ? (
                      <Image
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700">
                        <Headphones className="w-16 h-16 text-white/50" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {podcast.featured && (
                        <span className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                      {!podcast.published && (
                        <span className="px-2 py-1 bg-gray-800 text-white rounded text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>

                    {podcast.episodeNumber && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white rounded text-xs">
                        Ep. {podcast.episodeNumber}
                      </span>
                    )}

                    {podcast.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white rounded text-xs">
                        {podcast.duration}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {podcast.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {podcast.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatDate(podcast.publishDate)}</span>
                      {podcast.season && <span>Season {podcast.season}</span>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(podcast)}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        title="Delete podcast"
                        type="button"
                        onClick={() => setDeleteConfirm(podcast.id)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-green-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {totalPages > 5 && <span className="px-2">...</span>}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingPodcast ? "Edit Podcast" : "Add New Podcast"}
                </h2>
                <button
                  type="button"
                  title="Close modal"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    title="Podcast title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    title="Podcast description"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Full episode description or show notes..."
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    currentImage={formData.imageUrl}
                    onImageChange={(url) =>
                      setFormData({ ...formData, imageUrl: url })
                    }
                    folder="podcasts"
                    label="Podcast Cover"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio URL
                  </label>
                  <input
                    title="URL of the podcast audio file"
                    type="url"
                    value={formData.audioUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, audioUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 45:30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Episode Number
                  </label>
                  <input
                    title="Episode number"
                    type="number"
                    value={formData.episodeNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        episodeNumber: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season
                  </label>
                  <input
                    title="Season number"
                    type="number"
                    value={formData.season || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        season: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    title="Publish date"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, publishDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Published
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : editingPodcast ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this podcast? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPodcastsPage;
