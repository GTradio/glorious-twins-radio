/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ImageUpload from "@/components/ImageUpload";
import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/axios";
import { deleteImage } from "@/lib/supabase/storage";
import { formatDate } from "@/lib/utils";
import teamService from "@/services/teamService";
import { CreateTeamMemberData, Team, UpdateTeamMemberData } from "@/types";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdminTeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<Team | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<Team | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
  });

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamService.getTeamMembers({ limit: 100 });
      setTeamMembers(response.teamMembers);
      calculateStats(response.teamMembers);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Team[]) => {
    setStats({
      total: data.length,
      active: data.filter((m) => m.active).length,
      inactive: data.filter((m) => !m.active).length,
      featured: data.filter((m) => m.featured).length,
    });
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleToggleFeatured = async (member: Team) => {
    try {
      await teamService.toggleFeaturedStatus(member.id);
      await fetchTeamMembers();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const itemToDelete = teamMembers.find((n) => n.id === id);
      await teamService.deleteTeamMember(id);

      if (itemToDelete?.imageUrl?.includes("supabase.co")) {
        await deleteImage(itemToDelete.imageUrl);
      }

      await fetchTeamMembers();
      setDeleteConfirm(null);
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const handleCreateMember = async (data: CreateTeamMemberData) => {
    try {
      await teamService.createTeamMember(data);
      await fetchTeamMembers();
      setShowCreateForm(false);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const handleUpdateMember = async (id: string, data: UpdateTeamMemberData) => {
    try {
      await teamService.updateTeamMember(id, data);
      await fetchTeamMembers();
      setShowEditForm(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email &&
        member.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.active) ||
      (statusFilter === "inactive" && !member.active) ||
      (statusFilter === "featured" && member.featured);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (member: Team) => (
    <div className="flex gap-1">
      {member.active ? (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Active
        </span>
      ) : (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Inactive
        </span>
      )}
      {member.featured && (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
          <Star className="w-3 h-3" />
          Featured
        </span>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage team members and their information
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </p>
            </div>
            <X className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Featured</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.featured}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
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
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Status Filter */}
            <select
              title="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Members</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Members Grid/Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No team members found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Display Order
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1500000000000?w=100&h=100&fit=crop&crop=face`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(member.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.role}
                      </div>
                      {member.roleYoruba && (
                        <div className="text-sm text-gray-500 italic">
                          {member.roleYoruba}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {member.email && (
                        <div className="text-gray-900">{member.email}</div>
                      )}
                      {member.phone && (
                        <div className="text-gray-500">{member.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(member)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium">
                      {member.displayOrder}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="View Details"
                        onClick={() => setSelectedMember(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Member"
                        onClick={() => setShowEditForm(member)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title={
                          member.featured
                            ? "Remove from featured"
                            : "Add to featured"
                        }
                        onClick={() => handleToggleFeatured(member)}
                        className={`p-2 rounded-lg transition-colors ${
                          member.featured
                            ? "text-yellow-600 hover:bg-yellow-50"
                            : "text-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        {member.featured ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        title="Delete Member"
                        onClick={() => setDeleteConfirm(member.id)}
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

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateEditMemberModal
          onSave={handleCreateMember}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <CreateEditMemberModal
          member={showEditForm}
          onSave={(data) => handleUpdateMember(showEditForm.id, data as any)}
          onClose={() => setShowEditForm(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this team member? This action
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

// Member Details Modal Component
const MemberDetailsModal = ({
  member,
  onClose,
}: {
  member: Team;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">Team Member Details</h2>
        <button
          title="Close"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Member Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {member.name}
              </h3>
              <div className="mt-1">
                <p className="text-lg text-orange-600 font-semibold">
                  {member.role}
                </p>
                {member.roleYoruba && (
                  <p className="text-orange-500 italic">{member.roleYoruba}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {member.active ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Inactive
                </span>
              )}
              {member.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium inline-flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Featured
                </span>
              )}
            </div>

            {/* Contact Info */}
            {(member.email || member.phone) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  Contact Information
                </h4>
                {member.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Email:</span>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Display Order */}
            <div>
              <span className="text-sm text-gray-500">Display Order:</span>
              <span className="ml-2 font-medium">{member.displayOrder}</span>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              <div>
                <span className="text-sm text-gray-500">Created:</span>
                <span className="ml-2 text-sm">
                  {formatDate(member.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Updated:</span>
                <span className="ml-2 text-sm">
                  {formatDate(member.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{member.description}</p>
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">Biography</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>
          </div>
        )}

        {/* Social Links */}
        {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
            <div className="space-y-2">
              {member.socialLinks.twitter && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Twitter:</span>
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {member.socialLinks.twitter}
                  </a>
                </div>
              )}
              {member.socialLinks.linkedin && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">LinkedIn:</span>
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {member.socialLinks.linkedin}
                  </a>
                </div>
              )}
              {member.socialLinks.instagram && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Instagram:</span>
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {member.socialLinks.instagram}
                  </a>
                </div>
              )}
              {member.socialLinks.facebook && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Facebook:</span>
                  <a
                    href={member.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {member.socialLinks.facebook}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Create/Edit Member Modal Component
const CreateEditMemberModal = ({
  member,
  onSave,
  onClose,
}: {
  member?: Team;
  onSave: (data: CreateTeamMemberData) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.role || "",
    roleYoruba: member?.roleYoruba || "",
    imageUrl: member?.imageUrl || "",
    description: member?.description || "",
    email: member?.email || "",
    phone: member?.phone || "",
    bio: member?.bio || "",
    featured: member?.featured || false,
    active: member?.active ?? true,
    displayOrder: member?.displayOrder || 0,
    socialLinks: {
      twitter: member?.socialLinks?.twitter || "",
      linkedin: member?.socialLinks?.linkedin || "",
      instagram: member?.socialLinks?.instagram || "",
      facebook: member?.socialLinks?.facebook || "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Clean up social links - remove empty ones
    const cleanSocialLinks = Object.fromEntries(
      Object.entries(formData.socialLinks).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value.trim() !== ""
      )
    );

    const submitData = {
      ...formData,
      socialLinks:
        Object.keys(cleanSocialLinks).length > 0 ? cleanSocialLinks : undefined,
      roleYoruba: formData.roleYoruba.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      bio: formData.bio.trim() || undefined,
    };

    onSave(submitData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {member ? "Edit Team Member" : "Add New Team Member"}
          </h2>
          <button
            onClick={onClose}
            title="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Station Manager"
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Role Yoruba */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role (Yoruba)
              </label>
              <input
                type="text"
                value={formData.roleYoruba}
                onChange={(e) => handleChange("roleYoruba", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Ọlùdarí"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="+234-xxx-xxx-xxxx"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  handleChange("displayOrder", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <ImageUpload
              currentImage={formData.imageUrl}
              onImageChange={(url) => handleChange("imageUrl", url)}
              folder="team"
              label="Team Member Photo"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Brief description for the card..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Detailed biography..."
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Media Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.socialLinks).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm text-gray-600 mb-1 capitalize">
                    {platform}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleSocialChange(platform, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder={`https://${platform}.com/username`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleChange("active", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              {member ? "Update Member" : "Create Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTeamPage;
