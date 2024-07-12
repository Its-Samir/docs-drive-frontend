import { MoreHorizontal, User2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { apiShare } from "../../../lib/api-client";
import { useApiMutation } from "../../../hooks/use-api";
import { memo } from "react";
import { toast } from "sonner";

export const UserCard = memo(
	({
		itemId,
		userId,
		email,
		avatar,
	}: {
		itemId: string;
		userId: string;
		email: string;
		avatar: string;
	}) => {
		const { mutate } = useApiMutation(
			["mutate-share"],
			apiShare,
			["query-item", "query-items-count"],
			(data) => {
				toast.success(data.message);
			},
		);

		return (
			<div className="flex w-full items-center justify-between gap-2 rounded-sm bg-slate-100 px-2 py-1 sm:px-3 sm:py-2">
				<div className="h-full w-[2rem] rounded-full">
					{avatar ? (
						<img
							src={avatar}
							alt="user-avatar"
							className="h-full w-full rounded-full"
							loading="lazy"
						/>
					) : (
						<span className="h-full w-full rounded-full">
							<User2 color="slategray" />
						</span>
					)}
				</div>
				<span className="w-[10rem] truncate">{email}</span>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<MoreHorizontal />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => mutate({ itemId, userId })}>
							Remove Permission
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
);

export default UserCard;
