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
			<img
				src="/assets/Google_Icon.png"
				alt="google-icon"
				className="h-[120%]"
			/>
			Google
		</Button>
	);
}
