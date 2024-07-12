import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../pages/dashboard/_components/dashboard-paths";
import { Button } from "../ui/button";

export default function BottomTabs() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className="fixed bottom-0 right-0 flex w-full items-center gap-2 bg-white p-2 md:hidden">
			{paths.map((path) => (
				<Button
					onClick={() => navigate(path.path)}
					className={`flex flex-col items-center gap-2 text-neutral-500 ${
						location.pathname.includes(path.path.split("/~")[0])
							? "bg-slate-300 font-bold text-neutral-800"
							: ""
					} flex-1`}
					variant={"link"}
					key={path.id}
				>
					{path.icon}
				</Button>
			))}
		</div>
	);
}
