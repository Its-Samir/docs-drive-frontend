import { Loader2 } from "lucide-react";

export default function ItemsLoading() {
	return (
		<p className="flex h-[80vh] w-full items-center justify-center gap-3 font-bold">
			<Loader2 className="animate-spin text-neutral-500" />
			<span>Loading...</span>
		</p>
	);
}
