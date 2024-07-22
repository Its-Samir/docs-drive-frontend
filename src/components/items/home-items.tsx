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
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { Item } from "../../lib/types";
import {
	apiGetItems,
	apiManageStarredItem,
	apiMakeTrash,
} from "../../lib/api-client";
import { useSortedItems } from "../../hooks/use-sort";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ItemsLoading from "./items-loading";
import { useApiMutation, useApiQuery } from "../../hooks/use-api";
import { toast } from "sonner";
import { formatDate } from "../../lib/utils";
const CreateItem = lazy(() => import("./create-item"));
const MediaViewer = lazy(() => import("./media-viewer"));
const ChooseEmail = lazy(
	() => import("../../pages/dashboard/_components/choose-email"),
);
const ItemError = lazy(() => import("./item-error"));

export default function HomeItems() {
	const { itemId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const key = searchParams.get("key");
	const order = searchParams.get("order");

	const {
		data: items,
		isLoading,
		isError,
		error,
	} = useApiQuery(["query-items", `${itemId}`], apiGetItems, {
		itemId: `${itemId}`,
	});

	const sortedItems = useSortedItems(Array.isArray(items) ? items : [], [
		{
			key: (key as keyof Item) || "id",
			order: (order as "desc" | "asc") || "asc",
		},
	]);

	const { mutate: makeTrashed } = useApiMutation(
		["mutate-trashed-items"],
		apiMakeTrash,
		["query-items", "query-trashed-items"],
		(data) => {
			toast.success(data.message);
		},
	);

	const { mutate: makeStarred } = useApiMutation(
		["mutate-starred-items"],
		apiManageStarredItem,
		["query-items", "query-starred-items"],
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
			<div className="flex flex-col items-start justify-between gap-3 px-2 md:flex-row md:items-center md:px-0">
				<CreateItem itemId={itemId!}>
					<Button name="upload-btn" aria-label="Upload item" size={"sm"}>
						UPLOAD
					</Button>
				</CreateItem>
				{Array.isArray(items) && items.length > 0 && (
					<div className="flex flex-col items-start gap-3 sm:flex-row md:items-center">
						<Select
							name="select-sortby"
							onValueChange={(value: keyof Item) =>
								navigate(`?key=${value}&order=${order || "desc"}`)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name">Name</SelectItem>
								<SelectItem value="mediaType">Type</SelectItem>
								<SelectItem value="createdAt">Date</SelectItem>
							</SelectContent>
						</Select>
						<Select
							onValueChange={(value: "asc" | "desc") =>
								navigate(`?key=${key || "name"}&order=${value}`)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Sort by order" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="asc">Asc</SelectItem>
								<SelectItem value="desc">Desc</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</div>
			<Table>
				<TableCaption>
					{items?.length === 0 && itemId !== "~" && "folder is empty"}
					{items?.length === 0 &&
						itemId === "~" &&
						"You don't have any files or folders here."}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead
							className={`${
								key === "name" && "bg-slate-100 font-bold"
							} group w-[100px]`}
						>
							<div className="jusitfy-between flex items-center gap-5">
								Name
							</div>
						</TableHead>
						<TableHead
							className={`${
								key === "mediaType" && "bg-slate-100 font-bold"
							} group`}
						>
							<div className="jusitfy-between flex items-center gap-5">
								Type
							</div>
						</TableHead>
						<TableHead
							className={`${
								key === "createdAt" && "bg-slate-100 font-bold"
							} group w-[2rem] truncate md:w-auto`}
						>
							<div className="jusitfy-between flex items-center gap-5">
								Created At
							</div>
						</TableHead>
						<TableHead>Owner</TableHead>
						<TableHead className="text-right">Options</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(sortedItems) &&
						sortedItems.map((item) => (
							<TableRow key={item.id}>
								{item.isFolder ? (
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Folder />
											<Link
												to={`/dashboard/home/${item.id}`}
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
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant={"outline"} size={"sm"}>
												<MoreHorizontal className="ml-auto" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{item.isPrivate && (
												<DropdownMenuSub>
													<DropdownMenuSubTrigger>
														Share
													</DropdownMenuSubTrigger>
													<DropdownMenuSubContent>
														<ChooseEmail itemId={item.id} />
													</DropdownMenuSubContent>
												</DropdownMenuSub>
											)}
											{item.isFolder ? null : (
												<DropdownMenuItem>
													<a
														href={item.media}
														download={true}
														target="_blank"
													>
														Download
													</a>
												</DropdownMenuItem>
											)}
											<DropdownMenuItem>
												<Link
													to={`/dashboard/manage-permissions/${item.id}`}
													className="w-full"
												>
													Manage
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => makeStarred(item.id)}
												className="flex items-center justify-between gap-2"
											>
												{item.isStarred ? "Unstar" : "Make Starred"}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => makeTrashed(item.id)}
											>
												Move to Trash
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
