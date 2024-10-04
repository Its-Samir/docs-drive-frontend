import { MediaType } from "../../lib/types";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface MediaViewerProps {
	url: string;
	mediaType: MediaType;
	children: React.ReactNode;
}

const MediaViewer = ({ url, mediaType, children }: MediaViewerProps) => {
	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent
				className={`${
					mediaType === MediaType.PDF ? "h-[65vh]" : "max-h-[90vh]"
				} overflow-auto p-2 sm:p-6`}
			>
				{mediaType === MediaType.PDF && (
					<iframe
						src={url}
						className="h-full w-full"
						style={{ border: "none" }}
						title="pdf"
					/>
				)}
				{mediaType === MediaType.IMAGE && (
					<img src={url} alt="img-media" loading="lazy" />
				)}
				{mediaType === MediaType.VIDEO && (
					<video title="video" controls width="600">
						<source src={url} />
						Your browser does not support the video tag.
					</video>
				)}
				{mediaType === MediaType.OFFICE && (
					<div>
						Cannot preview file, Try to{" "}
						<a
							target="_blank"
							className="underline"
							href={url}
							aria-label="Open or download file"
						>
							Open
						</a>{" "}
						in separate tab or Download it.
					</div>
				)}
				{mediaType === MediaType.UNKNOWN && (
					<div>
						Cannot preview file, Try to{" "}
						<a
							target="_blank"
							className="underline"
							href={url}
							aria-label="Open or download file"
						>
							Open
						</a>{" "}
						in separate tab or Download it.
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default MediaViewer;
