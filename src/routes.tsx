/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Register from "layouts/authentication/register";
import Users from "layouts/users";
import MeterReadings from "layouts/meterReadings/MeterReadingsPage";
import MontlyReport from "layouts/reports/MontlyReport";
import Meters from "layouts/meters/Meters";
import AnnualReport from "layouts/reports/AnnualReport";
import Charts from "layouts/charts";

// @mui icons
import Icon from "@mui/material/Icon";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import BackupTableRoundedIcon from "@mui/icons-material/BackupTableRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";

import { formateDate } from "helpers/formatDate";
import DirectorPage from "layouts/Directors/DirectorPage";
import BillingPage from "layouts/Billing/BillingPage";
import paths from "routes/paths";

const routes = [
	// {
	// 	type: "collapse",
	// 	name: "Dashboard",
	// 	key: "dashboard",
	// 	icon: <DashboardRoundedIcon />,
	// 	route: "/dashboard",
	// 	component: <Dashboard />,
	// },
	{
		type: "collapse",
		name: "Usuarios",
		key: paths.users,
		icon: <PeopleRoundedIcon />,
		route: paths.users,
		component: <Users />,
	},
	{
		type: "collapse",
		name: "Medidores",
		icon: <SpeedRoundedIcon />,
		key: paths.waterMeters,
		route: paths.waterMeters,
		component: <Meters />,
	},
	// {
	// 	type: "collapse",
	// 	name: "Tables",
	// 	key: "tables",
	// 	icon: <TableViewRoundedIcon />,
	// 	route: "/tables",
	// 	component: <Tables />,
	// },
	{
		type: "collapse",
		name: "Gráficas",
		key: paths.charts,
		icon: <InsightsRoundedIcon />,
		route: paths.charts,
		component: <Charts />,
	},
	{
		type: "collapse",
		name: "Tarifas",
		key: paths.billings,
		icon: <AddCardRoundedIcon />,
		route: paths.billings,
		component: <BillingPage />,
	},
	// {
	// 	type: "collapse",
	// 	name: "Billing",
	// 	key: "billing",
	// 	icon: <Icon fontSize="small">receipt_long</Icon>,
	// 	route: "/billing",
	// 	component: <Billing />,
	// },
	// {
	//   type: "collapse",
	//   name: "RTL",
	//   key: "rtl",
	//   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
	//   route: "/rtl",
	//   component: <RTL />,
	// },
	// {
	// 	type: "collapse",
	// 	name: "Notifications",
	// 	key: "notifications",
	// 	icon: <NotificationsActiveRoundedIcon />,
	// 	route: "/notifications",
	// 	component: <Notifications />,
	// },
	{
		type: "collapse",
		name: "Perfil",
		key: "profile",
		icon: <PersonRoundedIcon />,
		route: "/profile",
		component: <Profile />,
	},
	{
		type: "collapse",
		name: `Lecturas : ${formateDate(new Date(), "MMMM YYYY")} `,
		key: "meter-readings",
		icon: <BackupTableRoundedIcon />,
		route: "/meter-readings",
		component: <MeterReadings />,
	},
	{
		type: "collapse",
		name: `Reportes : ${formateDate(new Date(), "MMMM YYYY")} `,
		key: "report",
		icon: <AssessmentRoundedIcon />,
		route: "/report",
		component: <MontlyReport />,
	},
	{
		type: "collapse",
		name: `Reporte anual: ${new Date().getFullYear()}`,
		key: "report/year",
		icon: <AssessmentRoundedIcon />,
		route: "/report/year",
		component: <AnnualReport />,
	},
	// {
	// 	type: "collapse",
	// 	name: "Iniciar sessión",
	// 	key: "sign-in",
	// 	icon: <KeyRoundedIcon />,
	// 	route: "/authentication/sign-in",
	// 	component: <SignIn />,
	// },
	// {
	// 	type: "collapse",
	// 	name: "Crean cuenta",
	// 	key: "sign-up",
	// 	icon: <PersonAddRoundedIcon />,
	// 	route: "/authentication/sign-up",
	// 	component: <SignUp />,
	// },
	{
		type: "collapse",
		name: "Registrar nuevo",
		key: "user/register",
		icon: <PersonAddRoundedIcon />,
		route: "/user/register",
		component: <Register />,
	},
	{
		type: "collapse",
		name: "Mesa directiva",
		key: "board-director",
		icon: <Diversity3RoundedIcon />,
		route: "/board-director",
		component: <DirectorPage />,
	},
];

export default routes;
