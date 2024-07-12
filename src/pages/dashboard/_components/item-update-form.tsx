import { memo, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button";
import { ItemInfo } from "../../../lib/types";

interface ItemUpdateFormProps {
	item: ItemInfo;
	isPending: boolean;
	onMutate: ({
		itemId,
		data,
	}: {
		itemId: string;
		data: {
			name: string;
			isPrivate: boolean;
		};
	}) => void;
}

export const ItemUpdateForm = memo(
	({ item, isPending, onMutate }: ItemUpdateFormProps) => {
		const [name, setName] = useState(item?.name);
		const [isPrivate, setIsPrivate] = useState(item?.isPrivate);

		return (
			<div className="flex flex-col gap-2 p-2 text-slate-700">
				<span>Name</span>
				<Input
					aria-label="Item name"
					onChange={(e) => setName(e.target.value)}
					defaultValue={item.name}
				/>
				<span>Private</span>
				<Switch
					aria-label="Set private"
					onCheckedChange={(checked) => setIsPrivate(checked)}
					defaultChecked={item.isPrivate}
				/>
				<Button
					aria-label="Update item"
					disabled={isPending}
					onClick={() =>
						onMutate({
							itemId: item.id,
							data: {
								name: name ? name : item.name,
								isPrivate,
							},
						})
					}
					size={"sm"}
				>
					{isPending ? "Loading..." : "Update"}
				</Button>
			</div>
		);
	},
);
export default ItemUpdateForm;
