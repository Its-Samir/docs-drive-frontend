import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(createdAt: string) {
	return Intl.DateTimeFormat("en-IN", {
		day: "numeric",
		month: "short",
		year: "2-digit",
	}).format(new Date(createdAt));
}
