import { z } from "zod";

export const registerFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, { message: "Name must be more than 2 character" }),
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Invalid email format" }),
	password: z
		.string()
		.trim()
		.min(6, { message: "Password should not be less than 5 character" }),
});
