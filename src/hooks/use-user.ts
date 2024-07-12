import { LoginData } from "../lib/types";

export function useCurrentUser(): LoginData | null {
	const data = localStorage.getItem("data");

	if (data) {
		const parsedData = JSON.parse(data) as LoginData;

		if (
			new Date().getTime() <
			new Date(parsedData.loginTime).getTime() + 3600000
		) {
			return parsedData;
		} else {
			localStorage.removeItem("data");
		}
	}

	return null;
}
