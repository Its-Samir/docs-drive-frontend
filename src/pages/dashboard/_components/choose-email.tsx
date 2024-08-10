import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../../../components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../components/ui/popover";
import { memo, useState } from "react";
import { apiGetUsers, apiShare } from "../../../lib/api-client";
import { useApiMutation } from "../../../hooks/use-api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const ChooseEmail = memo(({ itemId }: { itemId: string }) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [selectedEmail, setSelectedEmail] = useState("");

	const { refetch, data } = useQuery({
		queryKey: ["query-users"],
		queryFn: ({ signal }) => apiGetUsers({ email: value, signal }),
	});

	const { mutate } = useApiMutation(
		["mutate-share"],
		apiShare,
		["query-item", "query-items-count"],
		(data) => {
			toast.success(data.message);
		},
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedEmail ? selectedEmail : "Select email..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						onValueChange={(val) => {
							setValue(val);
							if (val !== value) {
								refetch({ cancelRefetch: false });
							}
						}}
						placeholder="Search email..."
					/>
					<CommandEmpty>No email found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{data?.users.map((user) => (
								<CommandItem
									key={user.id}
									value={user.email}
									onSelect={(currentValue: string) => {
										setSelectedEmail(
											currentValue === selectedEmail
												? ""
												: currentValue,
										);
										setOpen(false);
										mutate({ userId: user.id, itemId });
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedEmail === user.email
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{user.email}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
});

export default ChooseEmail;
