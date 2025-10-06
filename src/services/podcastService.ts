import axiosInstance from "@/lib/axios";
import {
	CreatePodcastDTO,
	FilterParams,
	PaginationParams,
	Podcast,
	PodcastsResponse,
	UpdatePodcastDTO,
} from "@/types";

class PodcastService {
	private readonly endpoint = "/podcasts";

	// Get paginated podcasts with optional filters
	async getPodcasts(
		params?: PaginationParams & FilterParams
	): Promise<PodcastsResponse> {
		try {
			const response = await axiosInstance.get<PodcastsResponse>(
				this.endpoint,
				{
					params: {
						limit: params?.limit || 10,
						offset: params?.offset || 0,
						...params,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching podcasts:", error);
			throw error;
		}
	}

	// Get a single podcast by ID
	async getPodcastById(id: string): Promise<Podcast> {
		try {
			const response = await axiosInstance.get<Podcast>(
				`${this.endpoint}/${id}`
			);
			return response.data;
		} catch (error) {
			console.error(`Error fetching podcast ${id}:`, error);
			throw error;
		}
	}

	// Get featured podcasts
	async getFeaturedPodcasts(limit: number = 3): Promise<PodcastsResponse> {
		try {
			const response = await axiosInstance.get<PodcastsResponse>(
				this.endpoint,
				{
					params: { featured: true, limit },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching featured podcasts:", error);
			throw error;
		}
	}

	// Get latest podcasts
	async getLatestPodcasts(limit: number = 6): Promise<PodcastsResponse> {
		try {
			const response = await axiosInstance.get<PodcastsResponse>(
				this.endpoint,
				{
					params: { limit, offset: 0 },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching latest podcasts:", error);
			throw error;
		}
	}

	// Create a new podcast
	async createPodcast(data: CreatePodcastDTO): Promise<Podcast> {
		try {
			const response = await axiosInstance.post<Podcast>(this.endpoint, data);
			return response.data;
		} catch (error) {
			console.error("Error creating podcast:", error);
			throw error;
		}
	}

	// Update an existing podcast
	async updatePodcast(data: UpdatePodcastDTO): Promise<Podcast> {
		try {
			const { id, ...updateData } = data;
			const response = await axiosInstance.put<Podcast>(this.endpoint, {
				id,
				...updateData,
			});
			return response.data;
		} catch (error) {
			console.error(`Error updating podcast ${data.id}:`, error);
			throw error;
		}
	}

	// Delete a podcast
	async deletePodcast(id: string): Promise<void> {
		try {
			await axiosInstance.delete(`${this.endpoint}?id=${id}`);
		} catch (error) {
			console.error(`Error deleting podcast ${id}:`, error);
			throw error;
		}
	}

	// Search podcasts
	async searchPodcasts(query: string): Promise<PodcastsResponse> {
		try {
			const response = await axiosInstance.get<PodcastsResponse>(
				`${this.endpoint}/search`,
				{
					params: { q: query },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error searching podcasts:", error);
			throw error;
		}
	}

	// Get podcasts by season
	async getPodcastsBySeason(season: number): Promise<PodcastsResponse> {
		try {
			const response = await axiosInstance.get<PodcastsResponse>(
				this.endpoint,
				{
					params: { season },
				}
			);
			return response.data;
		} catch (error) {
			console.error(`Error fetching podcasts for season ${season}:`, error);
			throw error;
		}
	}

	// Increment play count (if you want to track plays)
	async incrementPlayCount(id: string): Promise<void> {
		console.log("Increment play count for podcast:", id);
	}
}

const podcastService = new PodcastService();
export default podcastService;
