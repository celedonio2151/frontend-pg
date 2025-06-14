/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Splash from "components/loader/Splash";
import PageLoader from "components/loader/PageLoader";
import paths, { rootPaths } from "./paths";

const ProtectedRoute = lazy(() => import("private/ProtectedRoute"));
const UnauthorizedPage = lazy(
	() => import("pages/unauthorized/UnauthorizedPage")
);

const App = lazy(() => import("App"));
const MainLayout = lazy(() => import("layouts/main-layout"));
const AuthLayout = lazy(() => import("layouts/auth-layout"));
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ListUsers from "pages/users";
import Cover from "layouts/authentication/sign-up";
import Meters from "layouts/meters/Meters";
import Charts from "layouts/charts";
import BillingPage from "layouts/Billing/BillingPage";
import RegisterUserPage from "layouts/authentication/register";
import DirectorPage from "layouts/Directors/DirectorPage";
import RolesPage from "pages/roles/RolesPage";
import CreateRolePage from "pages/roles/CreateRolePage";
import EditRolePage from "pages/roles/EditRolePage";
import MeterReadingsPage from "pages/readings/MeterReadingsPage";
import CreateReadingPage from "pages/readings/CreateReadingPage";
import EditUserPage from "pages/users/EditUserPage";
import MonthlyReportPage from "pages/reports/MonthlyReportPage";
import AnnualReportPage from "pages/reports/AnnualReportPage";
// const ResetPassword = lazy(() => import("pages/authentication/ResetPassword"));
const Error404 = lazy(() => import("pages/errors/Error404"));

// const CreateUserPage = lazy(() => import("pages/admin/users/createUserpage"));
// const UserPage = lazy(() => import("pages/admin/users"));
// const EditUserPage = lazy(() => import("pages/admin/edit-user"));

const routes = [
	{
		element: (
			<Suspense fallback={<Splash />}>
				<App />
			</Suspense>
		),
		children: [
			{
				path: "/",
				element: (
					<MainLayout>
						<Suspense fallback={<PageLoader />}>
							<Outlet />
						</Suspense>
					</MainLayout>
				),
				children: [
					{
						element: <ProtectedRoute />, // Solo autenticados
						children: [
							{
								index: true,
								element: <ListUsers />,
							},
						],
					},
					{
						element: <ProtectedRoute roles={["ADMIN"]} />, // Solo Admin
						children: [
							{
								path: paths.users,
								element: <ListUsers />,
							},
							{
								path: paths.createUser,
								element: <RegisterUserPage />,
							},
							{
								path: paths.editUser,
								element: <EditUserPage />,
							},
							{
								path: paths.userMe,
								element: <ListUsers />,
							},
							// Roles
							{
								path: paths.roles,
								element: <RolesPage />,
							},
							{
								path: paths.createRole,
								element: <CreateRolePage />,
							},
							{
								path: paths.editRole,
								element: <EditRolePage />,
							},
							// Medidores de agua
							{
								path: paths.waterMeters,
								element: <Meters />,
							},
							// Lecturas de agua
							{
								path: paths.readings,
								element: <MeterReadingsPage />,
							},
							// {
							// 	path: paths.createReading,
							// 	element: <CreateReadingPage />,
							// },

							// Reportes
							{
								path: paths.monthlyReport,
								element: <MonthlyReportPage />,
							},
							{
								path: paths.annualReport,
								element: <AnnualReportPage />,
							},
							// Gráficas
							{
								path: paths.charts,
								element: <Charts />,
							},
							// Tarifas
							{
								path: paths.billings,
								element: <BillingPage />,
							},
							// Directors
							{
								path: paths.directors,
								element: <DirectorPage />,
							},
						],
					},
					{
						path: "/unauthorized",
						element: <UnauthorizedPage />,
					},
				],
			},
			{
				path: rootPaths.authRoot,
				element: (
					<Suspense fallback={<Splash />}>
						<Outlet />
					</Suspense>
				),
				children: [
					{
						path: paths.signin,
						element: (
							<AuthLayout>
								<SignIn />
							</AuthLayout>
						),
					},
					{
						path: paths.signup,
						element: (
							<AuthLayout>
								<SignUp />
							</AuthLayout>
						),
					},
					{
						path: paths.resetPassword,
						element: <Cover />,
					},
				],
			},
			{
				path: "*",
				element: <Error404 />,
			},
		],
	},
];

const router = createBrowserRouter(routes, { basename: "/" });

export default router;
