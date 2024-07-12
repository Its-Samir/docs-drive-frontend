import { memo } from "react";
import { MediaType } from "../../../lib/types";

export const ShowMedia = memo(
	({ media, mediaType }: { media: string; mediaType: string }) => {
		return (
			<div
				className={`${mediaType === MediaType.PDF ? "h-[20rem]" : "h-auto"} w-auto overflow-auto md:w-[28rem]`}
			>
				{mediaType === MediaType.PDF && (
					<embed src={media} className="h-full w-full" />
				)}
				{mediaType === MediaType.IMAGE && (
					<img src={media} alt="Media" loading="lazy" />
				)}
				{mediaType === MediaType.VIDEO && (
					<video controls width="400">
						<source src={media} />
						Your browser does not support the video tag.
					</video>
				)}
				{mediaType === MediaType.UNKNOWN ||
					(mediaType === MediaType.OFFICE && (
						<div>
							Cannot preview file, Try to{" "}
							<a
								target="_blank"
								className="underline"
								href={media}
								aria-label="Open file in separate tab or download"
							>
								Open
							</a>{" "}
							in separate tab or Download it.
						</div>
					))}
			</div>
		);
	},
);

export default ShowMedia;
