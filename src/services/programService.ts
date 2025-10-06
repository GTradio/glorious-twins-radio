import axiosInstance from "@/lib/axios";
import {
	CreateProgramDTO,
	FilterParams,
	Program,
	UpdateProgramDTO,
} from "@/types";

class ProgramService {
	private readonly endpoint = "/programs";

	// Get all programs with optional filters
	async getPrograms(params?: FilterParams): Promise<Program[]> {
		try {
			const response = await axiosInstance.get<Program[]>(this.endpoint, {
				params,
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching programs:", error);
			throw error;
		}
	}

	// Get a single program by ID
	async getProgramById(id: string): Promise<Program> {
		try {
			const response = await axiosInstance.get<Program>(
				`${this.endpoint}/${id}`
			);
			return response.data;
		} catch (error) {
			console.error(`Error fetching program ${id}:`, error);
			throw error;
		}
	}

	// Get programs by day
	async getProgramsByDay(day: string): Promise<Program[]> {
		try {
			const response = await axiosInstance.get<Program[]>(this.endpoint, {
				params: { day },
			});
			return response.data;
		} catch (error) {
			console.error(`Error fetching programs for ${day}:`, error);
			throw error;
		}
	}

	// Get featured programs
	async getFeaturedPrograms(): Promise<Program[]> {
		try {
			const response = await axiosInstance.get<Program[]>(this.endpoint, {
				params: { featured: true },
			});
			return response.data;
		} catch (error) {
			console.error("Error fetching featured programs:", error);
			throw error;
		}
	}

	// Create a new program
	async createProgram(data: CreateProgramDTO): Promise<Program> {
		try {
			const response = await axiosInstance.post<Program>(this.endpoint, data);
			return response.data;
		} catch (error) {
			console.error("Error creating program:", error);
			throw error;
		}
	}

	// Update an existing program
	async updateProgram(data: UpdateProgramDTO): Promise<Program> {
		try {
			const { id, ...updateData } = data;
			const response = await axiosInstance.put<Program>(this.endpoint, {
				id,
				...updateData,
			});
			return response.data;
		} catch (error) {
			console.error(`Error updating program ${data.id}:`, error);
			throw error;
		}
	}

	// Delete a program
	async deleteProgram(id: string): Promise<void> {
		try {
			await axiosInstance.delete(`${this.endpoint}?id=${id}`);
		} catch (error) {
			console.error(`Error deleting program ${id}:`, error);
			throw error;
		}
	}

	// Batch operations
	async createMultiplePrograms(
		programs: CreateProgramDTO[]
	): Promise<Program[]> {
		try {
			const promises = programs.map((program) => this.createProgram(program));
			return await Promise.all(promises);
		} catch (error) {
			console.error("Error creating multiple programs:", error);
			throw error;
		}
	}

	// Get weekly schedule
	async getWeeklySchedule(): Promise<Record<string, Program[]>> {
		try {
			const days = [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			];
			const schedule: Record<string, Program[]> = {};

			for (const day of days) {
				schedule[day] = await this.getProgramsByDay(day);
			}

			return schedule;
		} catch (error) {
			console.error("Error fetching weekly schedule:", error);
			throw error;
		}
	}
}

const programService = new ProgramService();
export default programService;
