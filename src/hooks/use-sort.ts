import { useMemo } from "react";
import { Item } from "../lib/types";

const sortFilesAndFolders = (
	items: Item[],
	criteria: { key: keyof Item; order: "asc" | "desc" }[],
) => {
	return items.sort((a, b) => {
		for (let { key, order } of criteria) {
			let comparison = 0;

			if (key === "id") return 0;

			if (key === "createdAt") {
				comparison =
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime();
			} else if (typeof a[key] === "string") {
				comparison = (a[key] as string).localeCompare(b[key] as string);
			} else if (typeof a[key] === "boolean") {
				comparison = a[key] === b[key] ? 0 : a[key] ? -1 : 1;
			}

			if (comparison !== 0) {
				return order === "asc" ? comparison : -comparison;
			}
		}
		return 0;
	});
};

export const useSortedItems = (
	items: Item[],
	criteria: { key: keyof Item; order: "asc" | "desc" }[],
) => {
	return useMemo(
		() => sortFilesAndFolders(items, criteria),
		[items, criteria],
	);
};
