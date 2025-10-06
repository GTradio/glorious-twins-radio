import axiosInstance from "@/lib/axios";
import { CreateTeamMemberData, Team, UpdateTeamMemberData } from "@/types";

export interface GetTeamMembersParams {
	search?: string;
	featured?: boolean;
	active?: boolean;
	limit?: number;
	offset?: number;
}

export interface TeamResponse {
	teamMembers: Team[];
	total: number;
	hasMore: boolean;
}

class TeamService {
	private readonly baseUrl = "/team";

	async getTeamMembers(params?: GetTeamMembersParams): Promise<TeamResponse> {
		const searchParams = new URLSearchParams();

		if (params?.search) searchParams.append("search", params.search);
		if (params?.featured !== undefined)
			searchParams.append("featured", params.featured.toString());
		if (params?.active !== undefined)
			searchParams.append("active", params.active.toString());
		if (params?.limit) searchParams.append("limit", params.limit.toString());
		if (params?.offset) searchParams.append("offset", params.offset.toString());

		const url = `${this.baseUrl}?${searchParams.toString()}`;
		const response = await axiosInstance.get<TeamResponse>(url);
		return response.data;
	}

	async getTeamMemberById(id: string): Promise<Team> {
		const response = await axiosInstance.get<Team>(`${this.baseUrl}/${id}`);
		return response.data;
	}

	async createTeamMember(data: CreateTeamMemberData): Promise<Team> {
		const response = await axiosInstance.post<Team>(this.baseUrl, data);
		return response.data;
	}

	async updateTeamMember(
		id: string,
		data: UpdateTeamMemberData
	): Promise<Team> {
		const response = await axiosInstance.put<Team>(
			`${this.baseUrl}/${id}`,
			data
		);
		return response.data;
	}

	async deleteTeamMember(id: string): Promise<void> {
		await axiosInstance.delete(`${this.baseUrl}/${id}`);
	}

	async getFeaturedTeamMembers(limit: number = 6): Promise<TeamResponse> {
		return this.getTeamMembers({ featured: true, active: true, limit });
	}

	async toggleFeaturedStatus(id: string): Promise<Team> {
		const response = await axiosInstance.patch<Team>(
			`${this.baseUrl}/${id}/toggle-featured`
		);
		return response.data;
	}

	async updateDisplayOrder(id: string, displayOrder: number): Promise<Team> {
		const response = await axiosInstance.patch<Team>(
			`${this.baseUrl}/${id}/display-order`,
			{ displayOrder }
		);
		return response.data;
	}
}

const teamService = new TeamService();
export default teamService;
