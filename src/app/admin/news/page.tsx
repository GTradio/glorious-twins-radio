"use client";

import ImageUpload from "@/components/ImageUpload";
import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/axios";
import { deleteImage } from "@/lib/supabase/storage";
import { formatDate, truncateText } from "@/lib/utils";
import newsService from "@/services/newsService";
import { CreateNewsDTO, News, NewsResponse, UpdateNewsDTO } from "@/types";
import {
  Calendar,
  Edit,
  Eye,
  Newspaper,
  Plus,
  Save,
  Search,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const categories = [
  "Breaking",
  "Politics",
  "Sports",
  "Business",
  "Technology",
  "Entertainment",
  "Health",
  "Science",
];

interface NewsFormData {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  featured: boolean;
  published: boolean;
  publishDate: string;
}

const initialFormData: NewsFormData = {
  title: "",
  description: "",
  content: "",
  imageUrl: "",
  category: "",
  author: "",
  featured: false,
  published: true,
  publishDate: new Date().toISOString().split("T")[0],
};

const AdminNewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 12;

  const fetchNews = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response: NewsResponse = await newsService.getNews({
        limit: ITEMS_PER_PAGE,
        offset,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });

      setNews(response.news);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory]);

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        description: newsItem.description,
        content: newsItem.content,
        imageUrl: newsItem.imageUrl,
        category: newsItem.category || "",
        author: newsItem.author || "",
        featured: newsItem.featured,
        published: newsItem.published,
        publishDate: newsItem.publishDate
          ? new Date(newsItem.publishDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setEditingNews(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingNews) {
        const updateData: UpdateNewsDTO = {
          id: editingNews.id,
          ...formData,
        };
        await newsService.updateNews(updateData);
      } else {
        await newsService.createNews(formData as CreateNewsDTO);
      }

      await fetchNews(currentPage);
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
      const itemToDelete = news.find((n) => n.id === id);
      await newsService.deleteNews(id);

      if (itemToDelete?.imageUrl?.includes("supabase.co")) {
        await deleteImage(itemToDelete.imageUrl);
      }

      await fetchNews(currentPage);
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
        <p className="text-gray-600 mt-2">Manage news articles and updates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{news.length}</p>
            </div>
            <Newspaper className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter((n) => n.published).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter((n) => n.featured).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {news
                  .reduce((sum, n) => sum + (n.views || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
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
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <select
              title="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Article
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                        <Newspaper className="w-16 h-16 text-white/50" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {item.category && (
                        <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">
                          {item.category}
                        </span>
                      )}
                      {item.featured && (
                        <span className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                      {!item.published && (
                        <span className="px-2 py-1 bg-gray-800 text-white rounded text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Views */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white rounded text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views || 0}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {truncateText(item.description, 80)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.author || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.publishDate)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        title="Delete Article"
                        onClick={() => setDeleteConfirm(item.id)}
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
                  {editingNews ? "Edit Article" : "Add New Article"}
                </h2>
                <button
                  type="button"
                  title="Close Modal"
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
                    title="Article Title"
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
                    required
                    title="Article Description"
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
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Full article content..."
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    currentImage={formData.imageUrl}
                    onImageChange={(url) =>
                      setFormData({ ...formData, imageUrl: url })
                    }
                    folder="news"
                    label="Article Image"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    title="Select Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    title="Author Name"
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    title="Publish Date"
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
                  {saving ? "Saving..." : editingNews ? "Update" : "Create"}
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
              Are you sure you want to delete this news article? This action
              cannot be undone.
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

export default AdminNewsPage;
