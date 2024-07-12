import { z } from "zod";
import { loginFormSchema } from "./schemas/login-form-schema";
import axios from "axios";
import { registerFormSchema } from "./schemas/register-form-schema";
import { Item, ItemInfo, LoginData, RegisterData } from "./types";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 10,
			gcTime: 1000 * 60 * 15,
			refetchOnWindowFocus: false,
			retry: false
		},
	},
});

const SERVER_APP_URL = import.meta.env.VITE_SERVER_URL;

export const instance = axios.create({
	baseURL: SERVER_APP_URL,
	withCredentials: true,
});

export async function apiLogin(
	values: z.infer<typeof loginFormSchema>,
): Promise<LoginData> {
	const res = await instance.post<Promise<LoginData>>(`/api/login`, {
		...values,
	});

	return await res.data;
}

export async function apiRegister(
	values: z.infer<typeof registerFormSchema>,
): Promise<RegisterData> {
	const res = await instance.post<Promise<RegisterData>>(`/api/register`, {
		...values,
	});

	return await res.data;
}

export async function apiLogout(): Promise<boolean> {
	const res = await instance.post(`/api/logout`);

	if (res.statusText === "OK") {
		return true;
	}

	return false;
}

export async function apiGetItemInfo({
	itemId,
	signal,
}: {
	itemId: string;
	signal: AbortSignal;
}): Promise<ItemInfo> {
	let url = `/api/items/${itemId}`;

	const res = await instance.get<Promise<{ item: ItemInfo }>>(url, {
		signal,
	});

	const data = await res.data;

	return data.item;
}

export async function apiGetItemsCount({ signal }: { signal: AbortSignal }) {
	let url = `/api/items/count`;
	const res = await instance.get<
		Promise<
			{
				name: string;
				count: number;
			}[]
		>
	>(url, {
		signal,
	});

	return await res.data;
}

export async function apiGetItems({
	itemId,
	signal,
}: {
	signal: AbortSignal;
	itemId?: string;
}): Promise<Item[]> {
	let url = `/api/items/files-folders/`;

	if (itemId && itemId !== "~") {
		url = `/api/items/files-folders/${itemId}`;
	}

	const res = await instance.get<Promise<{ items: Item[] }>>(url, {
		signal,
	});

	const data = await res.data;

	return data.items;
}

interface ApiCreateItemParams {
	parentId: string | null;
	isFolder?: boolean;
	data:
		| {
				isPrivate: boolean;
				action: "folder";
				name: string;
				size: number;
		  }
		| {
				action: "file";
				file: File;
				isPrivate: boolean;
		  };
}

export async function apiCreateItem({
	parentId,
	isFolder,
	data,
}: ApiCreateItemParams): Promise<{ message: string }> {
	let url = `/api/items/files/`;

	if (parentId) {
		url = `/api/items/files/${parentId}`;
	}

	let headers = { "Content-Type": "multipart/form-data" };

	if (isFolder) {
		url = `/api/items/folders/`;

		if (parentId) {
			url = `/api/items/folders/${parentId}`;
		}

		headers = { "Content-Type": "application/json" };
	}

	const res = await instance.post<Promise<{ message: string }>>(url, data, {
		headers,
	});

	return await res.data;
}

export async function apiUpdateItem({
	itemId,
	data,
}: {
	itemId: string;
	data: { name: string; isPrivate?: boolean };
}): Promise<{ message: string }> {
	let url = `/api/items/${itemId}`;

	const res = await instance.put<Promise<{ message: string }>>(url, data);

	return res.data;
}

export async function apiGetSharedItems({
	itemId,
	signal,
}: {
	itemId: string;
	signal: AbortSignal;
}): Promise<Item[]> {
	let url = `/api/items/shared/`;

	if (itemId && itemId !== "~") {
		url = `/api/items/shared/${itemId}`;
	}

	const res = await instance.get<Promise<{ items: Item[] }>>(url, {
		signal,
	});

	const data = await res.data;

	return data.items;
}

export async function apiGetStarredItems({
	itemId,
	signal,
}: {
	itemId: string;
	signal: AbortSignal;
}): Promise<Item[]> {
	let url = `/api/items?starred=true`;

	if (itemId && itemId !== "~") {
		url = `/api/items/files-folders/${itemId}`;
	}

	const res = await instance.get<Promise<{ items: Item[] }>>(url, {
		signal,
	});

	const data = await res.data;

	return data.items;
}
export async function apiGetTrashedItems({
	signal,
}: {
	signal: AbortSignal;
}): Promise<Item[]> {
	let url = `/api/items?trashed=true`;

	const res = await instance.get<Promise<{ items: Item[] }>>(url, {
		signal,
	});

	const data = await res.data;

	return data.items;
}

export async function apiMakeTrash(itemId: string) {
	let url = `/api/items/${itemId}/trash`;

	const res = await instance.put<Promise<{ message: string }>>(url);

	return await res.data;
}

export async function apiManageStarredItem(itemId: string) {
	let url = `/api/items/${itemId}/starred`;

	const res = await instance.put<Promise<{ message: string }>>(url);

	return await res.data;
}

export async function apiRestoreFromTrash(itemId: string) {
	let url = `/api/items/${itemId}/restore`;

	const res = await instance.put<Promise<{ message: string }>>(url);

	return await res.data;
}

export async function apiGetUsers({
	email,
	signal,
}: {
	email: string;
	signal: AbortSignal;
}) {
	if (!email) return null;

	let url = `/api/users?email=${email}`;

	const res = await instance.get<
		Promise<{ users: { id: string; email: string }[] }>
	>(url, {
		signal,
	});

	return await res.data;
}

export async function apiShare({
	userId,
	itemId,
}: {
	userId: string;
	itemId: string;
}) {
	let url = `/api/items/${itemId}/share`;

	const res = await instance.put<Promise<{ message: string }>>(url, {
		userId,
	});

	return await res.data;
}

export async function apiDeleteItem(itemId: string) {
	let url = `/api/items/${itemId}`;

	const res = await instance.delete<Promise<{ message: string }>>(url);

	return await res.data;
}
