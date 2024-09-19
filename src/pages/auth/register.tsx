import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerFormSchema } from "../../lib/schemas/register-form-schema";
import { toast } from "sonner";
import { apiRegister } from "../../lib/api-client";
import { Loader2 } from "lucide-react";
import GoogleSignIn from "./_components/google-sign-in";
import { useApiMutation } from "../../hooks/use-api";

export default function Register() {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const [isChecked, setIsChecked] = useState(false);

	const { mutate, isPending } = useApiMutation(
		["register"],
		apiRegister,
		[],
		(data) => {
			toast.success(data.message);
			navigate("/login");
		},
	);

	useEffect(
		() =>
			alert(
				"We're using cookies: \nBefore login or signup, please make sure your browser cookies are enabled.",
			),
		[],
	);

	return (
		<div className="flex min-h-[80vh] items-center justify-center gap-4 rounded-sm p-2">
			<div className="hidden h-[27rem] w-[50%] flex-col gap-4 bg-slate-100 p-4 md:flex">
				<h1 className="flex items-center gap-1 sm:gap-2">
					<img src="/vite.svg" alt="vite-logo" className="w-[1.5rem]" />{" "}
					<span className="bg-transparent bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text font-extrabold text-transparent">
						DocsDrive
					</span>
				</h1>
				<h1 className="text-2xl font-bold text-neutral-600">
					Join us today!
				</h1>
				<p className="text-slate-600">
					Welcome to{" "}
					<span className="bg-transparent bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text font-extrabold text-transparent">
						DocsDrive
					</span>
					! Join us to access exclusive features and personalized services.
					Signing up is quick and easy. Let's get started!
				</p>
				<p>
					By using DocsDrive, you are agree with our{" "}
					<span className="underline">terms and conditions.</span>
				</p>
			</div>
			<div className="flex w-full flex-col gap-3 px-2 sm:px-4 md:w-[50%] md:p-0">
				<h1 className="text-2xl font-bold text-neutral-600">
					Create an Account
				</h1>
				<Form {...form}>
					<form
						className="flex flex-col space-y-3"
						onSubmit={form.handleSubmit((values) => {
							mutate(values);
						})}
					>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="name">Name</FormLabel>
									<Input
										{...field}
										placeholder="john"
										id="name"
										autoComplete="false"
										aria-label="Enter name"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="email">Email</FormLabel>
									<Input
										{...field}
										type="email"
										placeholder="john@email.com"
										id="email"
										autoComplete="false"
										aria-label="Enter email"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="password">Password</FormLabel>
									<Input
										{...field}
										type={isChecked ? "text" : "password"}
										placeholder="******"
										id="password"
										aria-label="Enter password"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-1">
							<input
								type="checkbox"
								name="check"
								id="check-box"
								onChange={(e) => setIsChecked(e.target.checked)}
								checked={isChecked}
							/>{" "}
							<span>Show password</span>
						</div>
						<Button
							name="register-btn"
							aria-label="Register account"
							disabled={isPending}
						>
							{isPending ? (
								<Loader2 className="animate-spin" />
							) : (
								"Register"
							)}
						</Button>
					</form>
				</Form>
				<hr />
				<GoogleSignIn />
				<p>
					Already have an Account?{" "}
					<a
						aria-label="Go to login page"
						href="/login"
						className="underline"
					>
						Login
					</a>{" "}
					here.
				</p>
			</div>
		</div>
	);
}
