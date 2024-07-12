import { Button } from "../../../components/ui/button";

export default function GoogleSignIn() {
	return (
		<Button
			className="flex items-center gap-2"
			variant={"outline"}
			onClick={() => {
				window.open(
					`${import.meta.env.VITE_SERVER_URL}/api/auth/google`,
					"_self",
				);
			}}
		>
			Google
		</Button>
	);
}
