import constants from "@/data/constant";
import axiosInstance from "@/lib/axios";
import {
	CreateNewsDTO,
	FilterParams,
	News,
	NewsResponse,
	PaginationParams,
	UpdateNewsDTO,
} from "@/types";

class NewsService {
	private readonly endpoint = "/news";

	// Get paginated news with optional filters
	async getNews(
		params?: PaginationParams & FilterParams & { category?: string }
	): Promise<NewsResponse> {
		try {
			const response = await axiosInstance.get<NewsResponse>(this.endpoint, {
				params: {
					limit: params?.limit || 10,
					offset: params?.offset || 0,
					...params,
				},
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching news:", error);
			throw error;
		}
	}

	// Get a single news article by ID
	async getNewsById(id: string): Promise<News> {
		try {
			const response = await axiosInstance.get<News>(
				`${this.endpoint}?id=${id}`
			);
			return response.data;
		} catch (error) {
			console.error(`Error fetching news ${id}:`, error);
			throw error;
		}
	}

	// Get featured news
	async getFeaturedNews(limit: number = 3): Promise<NewsResponse> {
		try {
			const response = await axiosInstance.get<NewsResponse>(this.endpoint, {
				params: { featured: true, limit },
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching featured news:", error);
			throw error;
		}
	}

	// Get latest news
	async getLatestNews(limit: number = 6): Promise<NewsResponse> {
		try {
			const response = await axiosInstance.get<NewsResponse>(this.endpoint, {
				params: { limit, offset: 0 },
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching latest news:", error);
			throw error;
		}
	}

	// Get news by category
	async getNewsByCategory(
		category: string,
		limit: number = 10
	): Promise<NewsResponse> {
		try {
			const response = await axiosInstance.get<NewsResponse>(this.endpoint, {
				params: { category, limit },
			});
			return response.data;
		} catch (error) {
			console.error(`Error fetching news for category ${category}:`, error);
			throw error;
		}
	}

	// Get trending news (most viewed)
	async getTrendingNews(limit: number = 5): Promise<NewsResponse> {
		return this.getNewsByCategory("Trending", limit);

		// try {
		// 	const response = await axiosInstance.get<NewsResponse>(
		// 		`${this.endpoint}/trending`,
		// 		{
		// 			params: { limit },
		// 		}
		// 	);
		// 	return response.data;
		// } catch (error) {
		// 	console.error("Error fetching trending news:", error);
		// 	throw error;
		// }
	}

	// Create a new news article
	async createNews(data: CreateNewsDTO): Promise<News> {
		try {
			const response = await axiosInstance.post<News>(this.endpoint, data);
			return response.data;
		} catch (error) {
			console.error("Error creating news:", error);
			throw error;
		}
	}

	// Update an existing news article
	async updateNews(data: UpdateNewsDTO): Promise<News> {
		try {
			const { id, ...updateData } = data;
			const response = await axiosInstance.put<News>(this.endpoint, {
				id,
				...updateData,
			});
			return response.data;
		} catch (error) {
			console.error(`Error updating news ${data.id}:`, error);
			throw error;
		}
	}

	// Delete a news article
	async deleteNews(id: string): Promise<void> {
		try {
			await axiosInstance.delete(`${this.endpoint}?id=${id}`);
		} catch (error) {
			console.error(`Error deleting news ${id}:`, error);
			throw error;
		}
	}

	// Search news
	async searchNews(query: string): Promise<NewsResponse> {
		try {
			const response = await axiosInstance.get<NewsResponse>(
				`${this.endpoint}/search`,
				{
					params: { q: query },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error searching news:", error);
			throw error;
		}
	}

	// Get news categories
	async getCategories(): Promise<string[]> {
		return [...constants.CATEGORIES];

		// try {
		// 	const response = await axiosInstance.get<string[]>(
		// 		`${this.endpoint}/categories`
		// 	);
		// 	return response.data;
		// } catch (error) {
		// 	console.error("Error fetching news categories:", error);
		// 	throw error;
		// }
	}

	// Increment view count
	async incrementViewCount(newsDetail: News): Promise<void> {
		try {
			await axiosInstance.put(`${this.endpoint}`, {
				...newsDetail,
				views: newsDetail.views + 1,
			});
		} catch (error) {
			console.error(
				`Error incrementing view count for news ${newsDetail.id}:`,
				error
			);
			// Don't throw error for analytics
		}
	}
}

const newsService = new NewsService();
export default newsService;
