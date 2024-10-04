import { Link } from "react-router-dom";
import { useCurrentUser } from "../../hooks/use-user";
import { Button } from "../ui/button";
import { apiLogout } from "../../lib/api-client";
import { User } from "lucide-react";
import { useApiMutation } from "../../hooks/use-api";

export default function Navbar() {
	const user = useCurrentUser();

	const { mutate } = useApiMutation(["logout"], apiLogout, [], () => {
		localStorage.removeItem("data");
		window.location.href = "/login";
	});

	return (
		<nav className="flex items-center justify-between border-b px-2 py-2 md:px-1">
			<h1 className="text-lg font-bold text-neutral-700 sm:text-2xl">
				<Link to={"/"}>
					<span className="flex items-center gap-1 bg-transparent bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text font-extrabold text-transparent sm:gap-2">
						<img
							src="/assets/logo.png"
							alt="site-logo"
							className="w-[7rem] sm:w-[9rem]"
						/>
					</span>
				</Link>
			</h1>
			{user && user.user.id ? (
				<div className="flex items-center gap-3">
					<Link to={"/dashboard/home/folders/~"}>
						<Button
							aria-label="Go to Dashboard"
							name="dashboard-btn"
							size={"sm"}
							variant="outline"
							className="flex items-center gap-1 rounded-full text-neutral-600"
						>
							<User size={16} />
							{user.user.name.split(" ")[0]}
						</Button>
					</Link>
					<Button
						aria-label="Logout from account"
						name="logout-btn"
						size={"sm"}
						onClick={mutate}
					>
						Logout
					</Button>
				</div>
			) : (
				<Link to={"/login"}>
					<Button
						name="login-btn"
						aria-label="Login to account"
						size={"sm"}
					>
						Login
					</Button>
				</Link>
			)}
		</nav>
	);
}
