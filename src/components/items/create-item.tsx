import { memo, useCallback, useState } from "react";
import { apiCreateItem } from "../../lib/api-client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { File, Folder, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useDropzone } from "react-dropzone";
import { useApiMutation } from "../../hooks/use-api";
import { toast } from "sonner";

const CreateItem = memo(
	({ children, itemId }: { children: React.ReactNode; itemId: string }) => {
		const [open, setOpen] = useState<boolean>(false);
		const [isPrivate, setIsPrivate] = useState<boolean>(false);
		const [file, setFile] = useState<File | null>(null);
		const [itemName, setItemName] = useState<string>("");
		const [openSelection, setOpenSelection] = useState<{
			isFolder: boolean | undefined;
		}>({
			isFolder: undefined,
		});

		const { mutate, isPending } = useApiMutation(
			["mutate-create"],
			async () => {
				if (openSelection.isFolder) {
					return apiCreateItem({
						parentId: itemId === "~" ? null : itemId,
						isFolder: openSelection.isFolder,
						data: {
							action: "folder",
							name: itemName,
							isPrivate,
							size: 0,
						},
					});
				} else {
					if (!file) return { message: "File is required" };

					return apiCreateItem({
						parentId: itemId === "~" ? null : itemId,
						isFolder: openSelection.isFolder,
						data: { action: "file", file, isPrivate },
					});
				}
			},
			["query-items", "query-items-count"],
			(data) => {
				setOpen((p) => !p);
				toast.success(data.message);
			},
		);

		const handleSelection = useCallback(
			(value: "dismiss" | "folder" | "file") => {
				if (value === "dismiss") {
					setOpenSelection({ isFolder: undefined });
				} else if (value === "folder") {
					setOpenSelection({ isFolder: true });
				} else if (value === "file") {
					setOpenSelection({ isFolder: false });
				}
			},
			[],
		);

		const onDrop = useCallback((acceptedFiles: File[]) => {
			setFile(acceptedFiles[0]);
			setItemName(
				`${crypto.randomUUID().slice(0, 5)}-${acceptedFiles[0].name}`,
			);
		}, []);

		const { getRootProps, getInputProps, isDragActive } = useDropzone({
			onDrop,
		});

		return (
			<Dialog
				open={open}
				onOpenChange={(isOpen) => {
					setOpen(isOpen);
					handleSelection("dismiss");
					setItemName("");
				}}
			>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="p-4 sm:p-6">
					<DialogHeader>
						<DialogTitle>
							{openSelection.isFolder === undefined
								? "Select an item"
								: openSelection.isFolder
									? "Add folder name"
									: "Choose file"}
						</DialogTitle>
					</DialogHeader>
					{typeof openSelection.isFolder === "undefined" && (
						<div className="jusitfy-center flex items-center gap-3 p-4">
							<div
								onClick={() => handleSelection("file")}
								className="flex cursor-pointer flex-col items-center gap-2 p-2 hover:bg-slate-200"
							>
								<File size={50} />
								<span>File</span>
							</div>
							<div
								onClick={() => handleSelection("folder")}
								className="flex cursor-pointer flex-col items-center gap-2 p-2 hover:bg-slate-200"
							>
								<Folder size={50} />
								<span>Folder</span>
							</div>
						</div>
					)}
					{typeof openSelection.isFolder !== "undefined" && (
						<div className="flex flex-col gap-3">
							{openSelection.isFolder ? (
								<>
									<Input
										onChange={(e) => setItemName(e.target.value)}
										placeholder="FolderOne"
									/>
									{!itemName && (
										<span className="text-red-500">Required(*)</span>
									)}
									<h2 className="font-medium">Make Private</h2>
									<Switch
										onCheckedChange={(isChecked) =>
											setIsPrivate(isChecked)
										}
									/>
									<Button
										disabled={!itemName || isPending}
										onClick={mutate}
										size={"sm"}
									>
										{isPending ? (
											<Loader2 className="animate-spin" />
										) : (
											"ADD FOLDER"
										)}
									</Button>
								</>
							) : (
								<>
									<div
										{...getRootProps({ className: "dropzone" })}
										className="cursor-pointer"
									>
										<input
											{...getInputProps({
												accept:
													"image/*,application/pdf,video/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
												type: "file",
											})}
										/>
										{isDragActive ? (
											<p className="border-2 border-dotted px-2 opacity-70">
												Drop the files here...
											</p>
										) : file && file.name ? (
											<p>{file.name}</p>
										) : (
											<p className="border-2 border-white px-2">
												Drag 'n' drop some files here, or click to
												select files
											</p>
										)}
									</div>
									<h2 className="font-medium">Make Private</h2>
									<Switch
										onCheckedChange={(isChecked) =>
											setIsPrivate(isChecked)
										}
									/>
									<Button
										disabled={!itemName || !file || isPending}
										onClick={mutate}
										size={"sm"}
									>
										{isPending ? (
											<Loader2 className="animate-spin" />
										) : (
											"DONE"
										)}
									</Button>
								</>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		);
	},
);

export default CreateItem;
