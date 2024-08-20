import React from "react";
import { BarChart3Icon, Home, Share2Icon, Star, Trash2 } from "lucide-react";

interface Path {
	id: string;
	name: string;
	icon: React.ReactNode;
	path: string;
}

export const paths: Path[] = [
	{
		id: Math.floor(Math.random() * 1000000).toString(),
		icon: <Home size={18} />,
		name: "Home",
		path: "home/folders/~",
	},
	{
		id: Math.floor(Math.random() * 1000000).toString(),
		name: "Shared With Me",
		icon: <Share2Icon size={18} />,
		path: "sharedwithme/folders/~",
	},
	{
		id: Math.floor(Math.random() * 1000000).toString(),
		name: "Starred",
		icon: <Star size={18} />,
		path: "starred/folders/~",
	},
	{
		id: Math.floor(Math.random() * 1000000).toString(),
		name: "Trash",
		path: "trash",
		icon: <Trash2 size={18} />,
	},
	{
		id: Math.floor(Math.random() * 1000000).toString(),
		name: "Analytics",
		path: "analytics",
		icon: <BarChart3Icon size={18} />,
	},
];
