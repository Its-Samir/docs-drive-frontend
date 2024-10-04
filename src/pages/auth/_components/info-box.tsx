import { useState } from "react";

export default function InfoBox() {
	const [showBox, setShowBox] = useState(true);

	return showBox ? (
		<div className="fixed bottom-0 right-0 m-4 space-y-1 rounded-md border bg-white/80 p-4 text-sm backdrop-blur-sm sm:w-[20rem] sm:text-base">
			<h1 className="text-xl font-semibold lg:text-2xl">
				We're using cookies
			</h1>
			<p>
				Before login or signup, please make sure your browser cookies are
				enabled.
			</p>
			<button
				className="rounded-sm border px-4 py-1 font-semibold"
				onClick={() => setShowBox((p) => !p)}
			>
				Close
			</button>
		</div>
	) : null;
}
