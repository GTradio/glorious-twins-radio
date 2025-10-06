"use client";

import ImageUpload from "@/components/ImageUpload";
import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/axios";
import { deleteImage } from "@/lib/supabase/storage";
import programService from "@/services/programService";
import { CreateProgramDTO, Program, UpdateProgramDTO } from "@/types";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface ProgramFormData {
  name: string;
  host: string;
  day: string;
  startTime: string;
  endTime: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
}

const initialFormData: ProgramFormData = {
  name: "",
  host: "",
  day: "Monday",
  startTime: "",
  endTime: "",
  description: "",
  imageUrl: "",
  featured: false,
  active: true,
};

const AdminProgramsPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await programService.getPrograms();
      setPrograms(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name,
        host: program.host,
        day: program.day,
        startTime: program.startTime,
        endTime: program.endTime,
        description: program.description || "",
        imageUrl: program.imageUrl || "",
        featured: program.featured,
        active: program.active,
      });
    } else {
      setEditingProgram(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingProgram) {
        const updateData: UpdateProgramDTO = {
          id: editingProgram.id,
          ...formData,
        };
        await programService.updateProgram(updateData);
      } else {
        await programService.createProgram(formData as CreateProgramDTO);
      }

      await fetchPrograms();
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
      const itemToDelete = programs.find((n) => n.id === id);
      await programService.deleteProgram(id);

      if (itemToDelete?.imageUrl?.includes("supabase.co")) {
        await deleteImage(itemToDelete.imageUrl);
      }

      await fetchPrograms();
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.host.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === "all" || program.day === selectedDay;
    return matchesSearch && matchesDay;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Programs Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your radio programs and schedules
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">
                {programs.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900">
                {programs.filter((p) => p.active).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {programs.filter((p) => p.featured).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today&apos;s Shows</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  programs.filter(
                    (p) => p.day === days[new Date().getDay() - 1]
                  ).length
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
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
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Day Filter */}
            <select
              title="Filter by day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Days</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
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
            Add Program
          </button>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No programs found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Program
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Host
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Schedule
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((program) => (
                <tr
                  key={program.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {program.name}
                      </div>
                      {program.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {program.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{program.host}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {program.day}
                      </div>
                      <div className="text-gray-500">
                        {program.startTime} - {program.endTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {program.active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                      {program.featured && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="Edit Program"
                        onClick={() => handleOpenModal(program)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete Program"
                        onClick={() => setDeleteConfirm(program.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProgram ? "Edit Program" : "Add New Program"}
                </h2>
                <button
                  type="button"
                  title="Close"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Name *
                  </label>
                  <input
                    title="Program Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Host *
                  </label>
                  <input
                    title="Host Name"
                    type="text"
                    required
                    value={formData.host}
                    onChange={(e) =>
                      setFormData({ ...formData, host: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day *
                  </label>
                  <select
                    title="Select Day"
                    required
                    value={formData.day}
                    onChange={(e) =>
                      setFormData({ ...formData, day: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    title="Start Time"
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    title="End Time"
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <ImageUpload
                    currentImage={formData.imageUrl}
                    onImageChange={(url) =>
                      setFormData({ ...formData, imageUrl: url })
                    }
                    folder="programs"
                    label="Program Image"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  title="Program Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active
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
                  {saving ? "Saving..." : editingProgram ? "Update" : "Create"}
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
              Are you sure you want to delete this program? This action cannot
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

export default AdminProgramsPage;
