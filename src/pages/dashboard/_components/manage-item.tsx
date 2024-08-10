import { lazy } from "react";
import { useParams } from "react-router-dom";
import { apiGetItemInfo, apiUpdateItem } from "../../../lib/api-client";
import UserCard from "./user-card";
import ShowMedia from "./show-media";
import ItemsLoading from "../../../components/items/items-loading";
import { useApiMutation } from "../../../hooks/use-api";
import { isAxiosError } from "axios";
import { formatDate } from "../../../lib/utils";
import ItemUpdateForm from "./item-update-form";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
const ChooseEmail = lazy(() => import("./choose-email"));
const ItemError = lazy(() => import("../../../components/items/item-error"));

export default function ManageItem() {
	const { itemId } = useParams();

	const {
		data: item,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["query-item", `${itemId}`],
		queryFn: ({ signal }) => apiGetItemInfo({ itemId: `${itemId}`, signal }),
	});

	const { mutate, isPending } = useApiMutation(
		["muate-update"],
		apiUpdateItem,
		["query-item", "query-items", "query-items-count"],
		(data) => {
			toast.success(data.message);
		},
	);

	if (isLoading) {
		return <ItemsLoading />;
	}

	if (isError && error) {
		if (isAxiosError(error) && error.response?.status === 401) {
			window.location.reload();
		}

		return <ItemError error={error} />;
	}

	if (item)
		return (
			<div className="flex w-full flex-col items-start gap-3 p-2 pb-16 sm:p-4">
				<h1 className="rounded-md bg-slate-500 px-2 font-mono text-lg font-bold text-white sm:text-2xl">
					Manage &gt; {item.name}:
				</h1>
				<div className="flex flex-col justify-between gap-2 rounded-md p-2 sm:p-4 md:flex-row">
					{!item.isFolder && (
						<ShowMedia media={item.media!} mediaType={item.mediaType!} />
					)}
					<div className="grid h-fit grid-cols-3 gap-2 rounded-lg bg-slate-100 p-3 *:flex *:flex-col *:gap-1 *:text-xs *:text-slate-600">
						<div>
							<span className="font-bold">Type</span>
							<span>{item.mediaType ? item.mediaType : "FOLDER"}</span>
						</div>
						<div>
							<span className="font-bold">Size</span>
							<span>
								{item.size.toString().length >= 7
									? `${(item.size / 1024 / 1024).toFixed(2)}MB`
									: `${(item.size / 1024).toFixed(2)}KB`}
							</span>
						</div>
						<div>
							<span className="font-bold">Total Permissions</span>
							<span>{item.sharedWith.length}</span>
						</div>
						<div>
							<span className="font-bold">CreatedAt</span>
							<span>{formatDate(item.createdAt.toString())}</span>
						</div>
						<div>
							<span className="font-bold">UpdatedAt</span>
							<span>
								{Intl.DateTimeFormat("en-IN", {
									day: "numeric",
									month: "short",
									year: "2-digit",
								}).format(new Date(item.updatedAt))}
							</span>
						</div>
					</div>
				</div>
				<ItemUpdateForm
					item={item}
					isPending={isPending}
					onMutate={({ itemId, data }) => mutate({ itemId, data })}
				/>
				{item.isPrivate && (
					<div className="flex w-full flex-col items-start gap-3 p-2 sm:p-4">
						<h1 className="font-bold text-slate-700">Add Users</h1>
						<ChooseEmail itemId={item.id} />
						<h2 className="font-bold text-slate-700">
							{item.sharedWith.length > 0
								? "Users who have permission"
								: "No users have permission"}
						</h2>
						{item.sharedWith.length > 0 &&
							item.sharedWith.map((i) => (
								<UserCard
									key={i.id}
									email={i.user.email}
									userId={i.userId}
									itemId={i.itemId}
									avatar={i.user.image || ""}
								/>
							))}
					</div>
				)}
			</div>
		);
}
