import axiosInstance from "@/lib/axios";
import { ContactMessage, CreateContactDTO, UpdateContactDTO } from "@/types";

class ContactService {
	private readonly endpoint = "/contact";

	// Send contact message
	async sendMessage(data: CreateContactDTO): Promise<ContactMessage> {
		try {
			const response = await axiosInstance.post<ContactMessage>(
				this.endpoint,
				data
			);
			return response.data;
		} catch (error) {
			console.error("Error sending contact message:", error);
			throw error;
		}
	}

	// Get all messages
	async getMessages(status?: string): Promise<ContactMessage[]> {
		try {
			const response = await axiosInstance.get<ContactMessage[]>(
				this.endpoint,
				{
					params: { status },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching messages:", error);
			throw error;
		}
	}

	// Get single message by ID
	async getMessageById(id: string): Promise<ContactMessage> {
		try {
			const response = await axiosInstance.get<ContactMessage>(
				`${this.endpoint}/${id}`
			);
			return response.data;
		} catch (error) {
			console.error(`Error fetching message ${id}:`, error);
			throw error;
		}
	}

	// Update message status
	async updateMessageStatus(data: UpdateContactDTO): Promise<ContactMessage> {
		try {
			const response = await axiosInstance.put<ContactMessage>(
				this.endpoint,
				data
			);
			return response.data;
		} catch (error) {
			console.error("Error updating message:", error);
			throw error;
		}
	}

	// Mark message as read
	async markAsRead(id: string): Promise<ContactMessage> {
		try {
			return await this.updateMessageStatus({
				id,
				status: "read",
			});
		} catch (error) {
			console.error(`Error marking message ${id} as read:`, error);
			throw error;
		}
	}

	// Mark message as responded
	async markAsResponded(id: string): Promise<ContactMessage> {
		try {
			return await this.updateMessageStatus({
				id,
				status: "responded",
			});
		} catch (error) {
			console.error(`Error marking message ${id} as responded:`, error);
			throw error;
		}
	}

	// Delete message
	async deleteMessage(id: string): Promise<void> {
		try {
			await axiosInstance.delete(`${this.endpoint}?id=${id}`);
		} catch (error) {
			console.error(`Error deleting message ${id}:`, error);
			throw error;
		}
	}

	// Get unread messages count
	async getUnreadCount(): Promise<number> {
		try {
			const messages = await this.getMessages("unread");
			return messages.length;
		} catch (error) {
			console.error("Error getting unread count:", error);
			throw error;
		}
	}

	// Get recent messages
	async getRecentMessages(limit: number = 10): Promise<ContactMessage[]> {
		try {
			const response = await axiosInstance.get<ContactMessage[]>(
				this.endpoint,
				{
					params: { limit },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching recent messages:", error);
			throw error;
		}
	}
}

const contactService = new ContactService();
export default contactService;
