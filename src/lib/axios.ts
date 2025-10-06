import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// Add auth token if exists
		const token =
			typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor with retry logic
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};

		// Retry logic for network errors
		if (error.code === "ECONNABORTED" || error.message === "Network Error") {
			if (!originalRequest._retry) {
				originalRequest._retry = true;
				return axiosInstance(originalRequest);
			}
		}

		// Handle 401 Unauthorized
		if (error.response?.status === 401) {
			// Clear token and redirect to login if needed
			if (typeof window !== "undefined") {
				localStorage.removeItem("token");
				// window.location.href = '/login'
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;

// Helper function for handling API errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: any): string => {
	if (axios.isAxiosError(error)) {
		if (error.response) {
			// Server responded with error
			return (
				error.response.data?.message ||
				error.response.data?.error ||
				"Something went wrong"
			);
		} else if (error.request) {
			// Request made but no response
			return "Network error. Please check your connection.";
		}
	}
	return error.message || "An unexpected error occurred";
};
