import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { isAxiosError } from "axios";

const AlertBody = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<div>
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{children}</AlertDescription>
		</div>
	);
};

const ItemError = ({ error }: { error: Error }) => {
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
					<AlertBody title={error.response.statusText}>
						{error.response?.data.error}, try to{" "}
						<a className="underline" href="/login">
							login
						</a>{" "}
						again
					</AlertBody>
				) : error.code === "ERR_NETWORK" ? (
					<AlertBody title={error.code}>{error.message}</AlertBody>
				) : (
					<AlertBody title={error.response?.statusText || "Error"}>
						{error.response?.data.error}
					</AlertBody>
				)
			) : (
				<AlertBody title="Error">
					Something went wrong! An error occured while fetching items,
					please try later.
				</AlertBody>
			)}
		</Alert>
	);
};

export default ItemError;
