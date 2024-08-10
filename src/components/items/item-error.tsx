import { memo } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { isAxiosError } from "axios";

const ItemError = memo(({ error }: { error: Error }) => {
	if (isAxiosError(error)) {
		if (error.response?.status === 401) {
			localStorage.removeItem("data");
		}
	}

	return (
		<Alert
			variant="destructive"
			className="m-2 flex h-fit w-auto items-center sm:m-4 sm:w-[90vw]"
		>
			<AlertCircle size={18} />
			{isAxiosError(error) ? (
				error.response?.status === 401 ? (
					<div>
						<AlertTitle>{error.response?.statusText}</AlertTitle>
						<AlertDescription>
							{error.response?.data.error}, try to{" "}
							<a className="underline" href="/login">
								login
							</a>{" "}
							again
						</AlertDescription>
					</div>
				) : error.code === "ERR_NETWORK" ? (
					<div>
						<AlertTitle>{error.code}</AlertTitle>
						<AlertDescription>{error.message}</AlertDescription>
					</div>
				) : (
					<div>
						<AlertTitle>{error.response?.statusText}</AlertTitle>
						<AlertDescription>
							{error.response?.data.error}
						</AlertDescription>
					</div>
				)
			) : (
				<div>
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						Something went wrong! An error occured while fetching items,
						please try later.
					</AlertDescription>
				</div>
			)}
		</Alert>
	);
});

export default ItemError;
