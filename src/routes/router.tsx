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
const Error404 = lazy(() => import("pages/errors/Error404"));

// Layouts
const App = lazy(() => import("App"));
const MainLayout = lazy(() => import("layouts/main-layout"));
const AuthLayout = lazy(() => import("layouts/auth-layout"));

// Autenticación
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import PublicRoute from "private/PublicRoute";
const RegisterUserPage = lazy(() => import("layouts/authentication/register"));
const Cover = lazy(() => import("layouts/authentication/sign-up"));

// Usuarios
const ListUsers = lazy(() => import("pages/users"));
const EditUserPage = lazy(() => import("pages/users/EditUserPage"));

// Roles
const RolesPage = lazy(() => import("pages/roles/RolesPage"));
const CreateRolePage = lazy(() => import("pages/roles/CreateRolePage"));
const EditRolePage = lazy(() => import("pages/roles/EditRolePage"));

// Medidores de agua
const Meters = lazy(() => import("pages/meters/Meters"));
const EditMeterPage = lazy(() => import("pages/meters/EditMeterPage"));

// Lecturas de medidores
const MeterReadingsPage = lazy(
	() => import("pages/readings/MeterReadingsPage")
);
const CreateReadingPage = lazy(
	() => import("pages/readings/CreateReadingPage")
);
const EditReadingPage = lazy(() => import("pages/readings/EditReadingPage"));

// Reportes
const MonthlyReportPage = lazy(() => import("pages/reports/MonthlyReportPage"));
const AnnualReportPage = lazy(() => import("pages/reports/AnnualReportPage"));

// Gráficas
const Charts = lazy(() => import("pages/charts"));

// Tarifas
const BillingPage = lazy(() => import("pages/billing/BillingPage"));

// Directores
const DirectorPage = lazy(() => import("pages/directors/DirectorPage"));

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
							// Usuarios
							{ path: paths.users, element: <ListUsers /> },
							{ path: paths.createUser, element: <RegisterUserPage /> },
							{ path: paths.editUser, element: <EditUserPage /> },
							{ path: paths.userMe, element: <ListUsers /> },

							// Roles
							{ path: paths.roles, element: <RolesPage /> },
							{ path: paths.createRole, element: <CreateRolePage /> },
							{ path: paths.editRole, element: <EditRolePage /> },

							// Medidores de agua
							{ path: paths.waterMeters, element: <Meters /> },
							{ path: paths.editWaterMeter, element: <EditMeterPage /> },

							// Lecturas de medidores
							{ path: paths.readings, element: <MeterReadingsPage /> },
							{ path: paths.editReading, element: <EditReadingPage /> },

							// Reportes
							{ path: paths.monthlyReport, element: <MonthlyReportPage /> },
							{ path: paths.annualReport, element: <AnnualReportPage /> },

							// Gráficas
							{ path: paths.charts, element: <Charts /> },

							// Tarifas
							{ path: paths.billings, element: <BillingPage /> },

							// Directores
							{ path: paths.directors, element: <DirectorPage /> },
						],
					},
					{ path: "/unauthorized", element: <UnauthorizedPage /> },
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
						element: (
							<PublicRoute>
								<Outlet />
							</PublicRoute>
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
						],
					},
					{ path: paths.resetPassword, element: <Cover /> },
				],
			},
			{ path: "*", element: <Error404 /> },
		],
	},
];

const router = createBrowserRouter(routes, { basename: "/" });

export default router;
