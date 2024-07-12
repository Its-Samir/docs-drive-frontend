import { z } from "zod";

export const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Invalid email format" }),
	password: z
		.string()
		.trim()
		.min(6, { message: "Password should not be less than 5 character" }),
});
