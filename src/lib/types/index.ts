export type User = {
	id: string;
	name: string;
	email: string;
	image?: string;
};

export type Item = {
	id: string;
	previewUrl: string;
	media?: string;
	name: string;
	size: number;
	mediaType?: MediaType;
	isStarred: boolean;
	isFolder: boolean;
	isPrivate: boolean;
	isTrash: boolean;
	ownerId: string;
	parentId?: string;
	createdAt: Date;
	updatedAt: Date;
	_count: {
		childrens: number;
	};
	owner: {
		email: string;
		name: string;
		image?: string;
	};
};

export type SharedItem = {
	id: string;
	ownerId: string;
	userId: string;
	itemId: string;
};

export type SharedItemWithUser = SharedItem & {
	user: User;
};

export type ItemInfo = Omit<Item, "_count" | "owner"> & {
	sharedWith: SharedItemWithUser[];
};

export enum MediaType {
	PDF = "PDF",
	IMAGE = "IMAGE",
	VIDEO = "VIDEO",
	OFFICE = "OFFICE",
	UNKNOWN = "UNKNOWN",
}

export interface LoginData {
	user: {
		id: string;
		email: string;
		name: string;
		image?: string;
	};
	loginTime: Date;
}

export interface RegisterData {
	message: string;
}
