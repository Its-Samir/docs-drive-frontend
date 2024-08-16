import { lazy } from "react";
import { File, Folder } from "lucide-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Link, useParams } from "react-router-dom";
import { apiGetSharedItems } from "../../lib/api-client";
import ItemsLoading from "./items-loading";
import { formatDate } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
const MediaViewer = lazy(() => import("./media-viewer"));
const ItemError = lazy(() => import("./item-error"));

export default function SharedItems() {
	const { itemId } = useParams();
	const {
		data: items,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["query-shared-items", `${itemId}`],
		queryFn: ({ signal }) =>
			apiGetSharedItems({ itemId: `${itemId}`, signal }),
	});

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
					{items?.length === 0 && itemId !== "~" && "folder is empty"}
					{items?.length === 0 && itemId === "~" && "No items"}
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
												to={`/dashboard/sharedwithme/folder/${item.id}`}
												className="w-[5rem] truncate md:w-[10rem]"
												title={item.name}
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
								<TableCell className="text-right"></TableCell>
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
