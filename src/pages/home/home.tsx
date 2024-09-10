import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useCurrentUser } from "../../hooks/use-user";

export default function Home() {
	const user = useCurrentUser();

	return (
		<div className="flex h-auto flex-col items-start justify-center space-y-5 p-4 pt-10 md:min-h-[80vh] md:items-center">
			<h1 className="text-4xl font-extrabold text-neutral-700 sm:text-5xl">
				Simplify Your File Management.
			</h1>
			<p className="text-left text-base text-slate-600 sm:text-lg md:text-center">
				Easily upload, organize, and share your files with{" "}
				<span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-gradient-to-r before:from-purple-600 before:to-blue-500">
					<span className="relative font-bold text-white">DocsDrive</span>
				</span>
				, your all-in-one cloud storage solution. Access your documents,
				photos, and videos anytime, anywhere, with seamless synchronization
				across all your devices.
			</p>
			<div className="flex items-center gap-2">
				<Button variant={"outline"}>Prices</Button>
				{user && user.user.id ? (
					<Link to={"/dashboard/home/folders/~"}>
						<Button>Go to Dashboard</Button>
					</Link>
				) : (
					<Link to={"/login"}>
						<Button>Start for Free</Button>
					</Link>
				)}
			</div>
			<footer className="fixed bottom-0 right-0 w-full bg-slate-100 p-4 text-center text-neutral-600">
				<p>DocsDrive Copyright © 2024</p>
			</footer>
		</div>
	);
}
