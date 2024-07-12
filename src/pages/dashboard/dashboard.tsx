import { lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { paths } from "./_components/dashboard-paths";
const BottomTabs = lazy(
	() => import("../../components/bottom-bar/bottom-tabs"),
);

export default function Dashboard() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col justify-between md:flex-row md:justify-normal">
			<aside className="hidden w-72 md:block">
				<div className="sticky top-3 mt-3 flex flex-col space-y-3">
					{paths.map((path) => (
						<Button
							aria-label={`${path.name}-navigate-button`}
							onClick={() => navigate(path.path)}
							className={`flex items-center justify-start gap-2 rounded-none text-neutral-500 ${
								location.pathname.includes(path.path.split("/~")[0])
									? "border-l-2 border-l-violet-500 font-bold text-neutral-800"
									: ""
							}`}
							variant={"link"}
							key={path.id}
						>
							{path.icon} {path.name}
						</Button>
					))}
				</div>
			</aside>
			<Outlet />
			<BottomTabs />
		</div>
	);
}
