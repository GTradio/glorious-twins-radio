import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function formatTime(time: string): string {
	return time; // Already formatted from backend
}

export function truncateText(text: string, maxLength: number = 100): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
}
