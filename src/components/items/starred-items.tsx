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
import { apiGetStarredItems, apiManageStarredItem } from "../../lib/api-client";
import { Link, useParams } from "react-router-dom";
import ItemsLoading from "./items-loading";
import { useApiMutation } from "../../hooks/use-api";
import { toast } from "sonner";
import { formatDate } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
const MediaViewer = lazy(() => import("./media-viewer"));
const ItemError = lazy(() => import("./item-error"));

export default function StarredItems() {
	const { itemId } = useParams();
	const {
		data: items,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["query-starred-items", `${itemId}`],
		queryFn: ({ signal }) =>
			apiGetStarredItems({ itemId: `${itemId}`, signal }),
	});

	const { mutate } = useApiMutation(
		["mutate-starred-items"],
		apiManageStarredItem,
		["query-starred-items", "query-items"],
		(data) => {
			toast.success(data.message);
		},
	);

	if (isLoading) {
		return <ItemsLoading />;
	}

	if (isError && error) {
		return <ItemError error={error} />;
	}

	return (
		<div className="flex w-full flex-col space-y-3 py-2 pb-16">
			<Table>
				<TableCaption>
					{items?.length === 0 && "No starred items"}
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
											<Link
												to={`/dashboard/starred/folders/${item.id}`}
												className="w-[5rem] truncate md:w-[10rem]"
											>
												{item.name}
											</Link>
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
									{itemId === "~" && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant={"outline"} size={"sm"}>
													<MoreHorizontal className="ml-auto" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													onClick={() => mutate(item.id)}
												>
													Unstar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
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
