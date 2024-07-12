import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
const Home = lazy(() => import("./pages/home/home"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const HomeItems = lazy(() => import("./components/items/home-items"));
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
import { Toaster } from "sonner";
import { useCurrentUser } from "./hooks/use-user";
import ItemsLoading from "./components/items/items-loading";
const ManageItem = lazy(
	() => import("./pages/dashboard/_components/manage-item"),
);
const TrashedItems = lazy(() => import("./components/items/trashed-items"));
const SharedItems = lazy(() => import("./components/items/shared-items"));
const StarredItems = lazy(() => import("./components/items/starred-items"));
const Charts = lazy(() => import("./components/items/charts"));
const OAuth = lazy(() => import("./pages/auth/oauth"));

function App() {
	const user = useCurrentUser();

	return (
		<div className="mx-auto w-auto xl:w-[75rem]">
			<Navbar />
			<Suspense fallback={<ItemsLoading />}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/login"
						element={
							user ? <Navigate to={"/dashboard/home/~"} /> : <Login />
						}
					/>
					<Route
						path="/register"
						element={
							user ? <Navigate to={"/dashboard/home/~"} /> : <Register />
						}
					/>
					<Route
						path="/authenticate"
						element={
							user ? <Navigate to={"/dashboard/home/~"} /> : <OAuth />
						}
					/>
					<Route
						path="dashboard"
						element={user ? <Dashboard /> : <Navigate to={"/login"} />}
					>
						<Route path="home/:itemId" element={<HomeItems />} />
						<Route
							path="sharedwithme/:itemId"
							element={<SharedItems />}
						/>
						<Route path="starred/:itemId" element={<StarredItems />} />
						<Route path="trash" element={<TrashedItems />} />
						<Route
							path="manage-permissions/:itemId"
							element={<ManageItem />}
						/>
						<Route path="analytics" element={<Charts />} />
						<Route path="*" element={<p>Page Not Found</p>} />
					</Route>
				</Routes>
			</Suspense>
			<Toaster richColors closeButton />
		</div>
	);
}

export default App;
