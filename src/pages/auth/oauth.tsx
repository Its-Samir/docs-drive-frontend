import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { instance } from "../../lib/api-client";

export default function OAuth() {
	const [searchParams] = useSearchParams();

	useEffect(() => {
		if (!localStorage.getItem("data")) {
			instance
				.get(`/api/account`)
				.then((res) => {
					if (res.data.token === searchParams.get("auth_token")) {
						localStorage.setItem(
							"data",
							JSON.stringify({
								user: res.data.user,
								loginTime: res.data.loginTime,
							}),
						);

						window.location.href = "/dashboard/home/~";
					}
				})
				.catch((_) => window.location.href = "/login");
		}
	}, []);

	return (
		<div className="mt-16 flex w-[100%] items-center justify-center">
			<div className="flex items-center gap-2">
				<Loader2 className="animate-spin" />
				<span>Authenticating</span>
			</div>
		</div>
	);
}
