import { useState } from "react";
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
import { loginFormSchema } from "../../lib/schemas/login-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiLogin } from "../../lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useApiMutation } from "../../hooks/use-api";
import GoogleSignIn from "./_components/google-sign-in";

export default function Login() {
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [isChecked, setIsChecked] = useState(false);

	const { mutate, isPending } = useApiMutation(
		["login"],
		apiLogin,
		[],
		(data) => {
			localStorage.setItem("data", JSON.stringify(data));
			toast.success("Login successfull");
			window.location.href = "/dashboard/home/~";
		},
	);

	return (
		<div className="flex min-h-[80vh] items-center justify-center gap-4 rounded-sm p-2">
			<div className="hidden h-[24rem] w-[50%] flex-col gap-4 bg-slate-100 p-4 md:flex">
				<h1 className="flex items-center gap-1 sm:gap-2">
					<img src="/vite.svg" alt="vite-logo" className="w-[1.5rem]" />{" "}
					<span className="bg-transparent bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text font-extrabold text-transparent">
						DocsDrive
					</span>
				</h1>
				<h1 className="text-2xl font-bold text-neutral-600">
					Hey, Welcome Back!
				</h1>
				<p className="text-slate-600">
					We're thrilled to see you again. Log in to access your
					personalized dashboard, manage your account, and stay updated
					with the latest features and services we offer.
				</p>
				<p>
					By using DocsDrive, you are agree with our{" "}
					<span className="underline">terms and conditions.</span>
				</p>
			</div>
			<div className="flex w-full flex-col gap-3 px-2 sm:px-4 md:w-[50%] md:p-0">
				<h1 className="text-2xl font-bold text-neutral-600">
					Welcome Back
				</h1>
				<Form {...form}>
					<form
						className="flex flex-col space-y-3"
						onSubmit={form.handleSubmit((values) => {
							mutate(values);
						})}
					>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="email">Email</FormLabel>
									<Input
										{...field}
										placeholder="test@test.com"
										id="email"
										autoComplete="false"
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
							name="login-btn"
							aria-label="Login to account"
							disabled={isPending}
						>
							{isPending ? (
								<Loader2 className="animate-spin" />
							) : (
								"Login"
							)}
						</Button>
					</form>
				</Form>
				<hr />
				<GoogleSignIn />
				<p>
					Don&apos;t have an Account?{" "}
					<a
						aria-label="Go to register page"
						href="/register"
						className="underline"
					>
						Register
					</a>{" "}
					here.
				</p>
			</div>
		</div>
	);
}
