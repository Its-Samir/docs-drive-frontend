import { lazy } from "react";
import { File, Folder, MoreHorizontal } from "lucide-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	apiDeleteItem,
	apiGetTrashedItems,
	apiRestoreFromTrash,
} from "../../lib/api-client";
import ItemsLoading from "./items-loading";
import { useApiMutation, useApiQuery } from "../../hooks/use-api";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { formatDate } from "../../lib/utils";
const MediaViewer = lazy(() => import("./media-viewer"));
const ItemError = lazy(() => import("./item-error"));

export default function TrashedItems() {
	const {
		data: items,
		isLoading,
		isError,
		error,
	} = useApiQuery(["query-trashed-items"], apiGetTrashedItems);

	const { mutate: restoreItem } = useApiMutation(
		["mutate-restore-items"],
		apiRestoreFromTrash,
		["query-trashed-items", "query-items"],
		(data) => {
			toast.success(data.message);
		},
	);

	const { mutate: deleteItem } = useApiMutation(
		["mutate-delete-items"],
		apiDeleteItem,
		["query-trashed-items"],
		(data) => {
			toast.success(data.message);
		},
	);

	if (isLoading) {
		return <ItemsLoading />;
	}

	if (isError && error) {
		if (isAxiosError(error) && error.response?.status === 401) {
			window.location.href = "/login";
		}

		return <ItemError error={error} />;
	}

	return (
		<div className="flex w-full flex-col space-y-3 py-2 pb-16">
			<Table>
				<TableCaption>
					{items?.length === 0 && "No trashed items"}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>
							<div className="jusitfy-between flex items-center gap-5">
								Name
							</div>
						</TableHead>
						<TableHead>
							<div className="jusitfy-between flex items-center gap-5">
								Type
							</div>
						</TableHead>
						<TableHead className="w-[2rem] truncate md:w-auto">
							<div className="jusitfy-between flex items-center gap-5">
								Created At
							</div>
						</TableHead>
						<TableHead>Owner</TableHead>
						<TableHead className="text-right">Options</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(items) &&
						items.map((item) => (
							<TableRow key={item.id}>
								{item.isFolder ? (
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Folder />
											<span className="w-[5rem] truncate md:w-[10rem]">
												{item.name}
											</span>
										</div>
									</TableCell>
								) : (
									<TableCell className="font-medium">
										<MediaViewer
											url={item.media!}
											mediaType={item.mediaType!}
										>
											<div className="flex items-center gap-2">
												<File />
												<span
													className="w-[5rem] truncate text-left md:w-[10rem]"
													title={item.name}
												>
													{item.name}
												</span>
											</div>
										</MediaViewer>
									</TableCell>
								)}
								<TableCell>
									{item.isFolder ? "FOLDER" : item.mediaType}
								</TableCell>
								<TableCell className="w-[2rem] truncate md:w-auto">
									{formatDate(item.createdAt.toString())}
								</TableCell>
								<TableCell className="w-[10rem] truncate">
									{item.owner.email}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant={"outline"} size={"sm"}>
												<MoreHorizontal className="ml-auto" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem
												onClick={() => restoreItem(item.id)}
											>
												Restore
											</DropdownMenuItem>
											<DropdownMenuItem
												className="focus:bg-red-500 focus:text-white"
												onClick={() => deleteItem(item.id)}
											>
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			{Array.isArray(items) && items.length === 0 && (
				<img
					loading="lazy"
					src="/assets/folders.jpg"
					className="mx-auto w-full sm:w-[25rem]"
					alt="Design by freepik - Image"
				/>
			)}
		</div>
	);
}
