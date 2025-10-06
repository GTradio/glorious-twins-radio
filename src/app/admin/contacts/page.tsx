"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import contactService from "@/services/contactService";
import { ContactMessage } from "@/types";
import {
	AlertCircle,
	CheckCircle,
	Clock,
	Download,
	Eye,
	Mail,
	MessageSquare,
	Search,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const AdminContactsPage = () => {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
		null
	);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [stats, setStats] = useState({
		total: 0,
		unread: 0,
		read: 0,
		responded: 0,
	});

	const fetchMessages = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await contactService.getMessages();
			setMessages(data);
			calculateStats(data);
		} catch (err) {
			const errorMessage = handleApiError(err);
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const calculateStats = (data: ContactMessage[]) => {
		setStats({
			total: data.length,
			unread: data.filter((m) => m.status === "unread").length,
			read: data.filter((m) => m.status === "read").length,
			responded: data.filter((m) => m.status === "responded").length,
		});
	};

	useEffect(() => {
		fetchMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleMarkAsRead = async (message: ContactMessage) => {
		try {
			await contactService.markAsRead(message.id);
			await fetchMessages();
			if (selectedMessage?.id === message.id) {
				setSelectedMessage({ ...message, status: "read" });
			}
		} catch (err) {
			const errorMessage = handleApiError(err);
			setError(errorMessage);
		}
	};

	const handleMarkAsResponded = async (message: ContactMessage) => {
		try {
			await contactService.markAsResponded(message.id);
			await fetchMessages();
			if (selectedMessage?.id === message.id) {
				setSelectedMessage({ ...message, status: "responded" });
			}
		} catch (err) {
			const errorMessage = handleApiError(err);
			setError(errorMessage);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await contactService.deleteMessage(id);
			await fetchMessages();
			setDeleteConfirm(null);
			if (selectedMessage?.id === id) {
				setSelectedMessage(null);
			}
		} catch (err) {
			const errorMessage = handleApiError(err);
			setError(errorMessage);
		}
	};

	const filteredMessages = messages.filter((message) => {
		const matchesSearch =
			message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.message.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || message.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "unread":
				return (
					<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
						<Clock className="w-3 h-3" />
						Unread
					</span>
				);
			case "read":
				return (
					<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
						<Eye className="w-3 h-3" />
						Read
					</span>
				);
			case "responded":
				return (
					<span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
						<CheckCircle className="w-3 h-3" />
						Responded
					</span>
				);
			default:
				return null;
		}
	};

	const exportToCSV = () => {
		const headers = [
			"Date",
			"Name",
			"Email",
			"Phone",
			"Subject",
			"Message",
			"Status",
		];
		const rows = filteredMessages.map((m) => [
			formatDate(m.createdAt),
			m.name,
			m.email,
			m.phone,
			m.subject,
			m.message.replace(/,/g, ";"), // Replace commas in message
			m.status,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `contact-messages-${
			new Date().toISOString().split("T")[0]
		}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const handleViewMessage = (message: ContactMessage) => {
		setSelectedMessage(message);
		if (message.status === "unread") {
			handleMarkAsRead(message);
		}
	};

	return (
		<div>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
				<p className="text-gray-600 mt-2">
					Manage and respond to contact form submissions
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Total Messages</p>
							<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
						</div>
						<MessageSquare className="w-8 h-8 text-gray-400" />
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Unread</p>
							<p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
						</div>
						<Mail className="w-8 h-8 text-blue-500" />
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Read</p>
							<p className="text-2xl font-bold text-gray-600">{stats.read}</p>
						</div>
						<Eye className="w-8 h-8 text-gray-500" />
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Responded</p>
							<p className="text-2xl font-bold text-green-600">
								{stats.responded}
							</p>
						</div>
						<CheckCircle className="w-8 h-8 text-green-500" />
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
								placeholder="Search messages..."
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
							<option value="all">All Status</option>
							<option value="unread">Unread</option>
							<option value="read">Read</option>
							<option value="responded">Responded</option>
						</select>
					</div>

					{/* Export Button */}
					<button
						type="button"
						onClick={exportToCSV}
						className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
					>
						<Download className="w-5 h-5" />
						Export CSV
					</button>
				</div>
			</div>

			{/* Messages Table */}
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
				) : filteredMessages.length === 0 ? (
					<div className="p-12 text-center">
						<Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">No messages found</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50 border-b">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
									Date
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
									From
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
									Subject
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
									Message
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
							{filteredMessages.map((message) => (
								<tr
									key={message.id}
									className={`border-b transition-colors ${
										message.status === "unread"
											? "bg-blue-50 hover:bg-blue-100"
											: "hover:bg-gray-50"
									}`}
								>
									<td className="px-6 py-4 text-sm text-gray-600">
										{formatDate(message.createdAt)}
									</td>
									<td className="px-6 py-4">
										<div>
											<div className="font-medium text-gray-900">
												{message.name}
											</div>
											<div className="text-sm text-gray-500">
												{message.email}
											</div>
											<div className="text-xs text-gray-400">
												{message.phone}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="font-medium text-gray-900 max-w-xs truncate">
											{message.subject}
										</div>
									</td>
									<td className="px-6 py-4">
										<p className="text-sm text-gray-600 max-w-md truncate">
											{message.message}
										</p>
									</td>
									<td className="px-6 py-4 text-center">
										{getStatusBadge(message.status)}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center gap-2">
											<button
												type="button"
												title="View Message"
												onClick={() => handleViewMessage(message)}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											>
												<Eye className="w-4 h-4" />
											</button>
											<button
												type="button"
												title="Delete Message"
												onClick={() => setDeleteConfirm(message.id)}
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

			{/* Message Details Modal */}
			{selectedMessage && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold">Message Details</h2>
								<button
									type="button"
									onClick={() => setSelectedMessage(null)}
									className="text-gray-500 hover:text-gray-700"
								>
									✕
								</button>
							</div>
						</div>

						<div className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-500">From</p>
									<p className="font-medium">{selectedMessage.name}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Email</p>
									<p className="font-medium">{selectedMessage.email}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Phone</p>
									<p className="font-medium">{selectedMessage.phone}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Date Received</p>
									<p className="font-medium">
										{formatDate(selectedMessage.createdAt)}
									</p>
								</div>
								<div className="col-span-2">
									<p className="text-sm text-gray-500">Subject</p>
									<p className="font-medium">{selectedMessage.subject}</p>
								</div>
								<div className="col-span-2">
									<p className="text-sm text-gray-500">Status</p>
									<div className="mt-1">
										{getStatusBadge(selectedMessage.status)}
									</div>
								</div>
							</div>

							<div>
								<p className="text-sm text-gray-500 mb-2">Message</p>
								<div className="bg-gray-50 p-4 rounded-lg">
									<p className="whitespace-pre-wrap text-gray-700">
										{selectedMessage.message}
									</p>
								</div>
							</div>

							{selectedMessage.metadata && (
								<div>
									<p className="text-sm text-gray-500 mb-2">Metadata</p>
									<pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
										{JSON.stringify(selectedMessage.metadata, null, 2)}
									</pre>
								</div>
							)}

							<div className="flex justify-between pt-4 border-t">
								<div className="flex gap-2">
									{selectedMessage.status === "unread" && (
										<button
											onClick={() => handleMarkAsRead(selectedMessage)}
											className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
										>
											Mark as Read
										</button>
									)}
									{selectedMessage.status !== "responded" && (
										<button
											onClick={() => handleMarkAsResponded(selectedMessage)}
											className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
										>
											Mark as Responded
										</button>
									)}
								</div>
								<button
									onClick={() => setSelectedMessage(null)}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation */}
			{deleteConfirm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 max-w-md w-full">
						<h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
						<p className="text-gray-600 mb-6">
							Are you sure you want to delete this message? This action cannot
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

export default AdminContactsPage;
