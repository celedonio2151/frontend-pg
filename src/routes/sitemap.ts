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

import paths from "routes/paths";
import { formateDate } from "helpers/formatDate";
import path from "path";

export interface SubMenuItem {
	name: string;
	pathName: string;
	route: string;
	items?: SubMenuItem[];
}

export interface MenuItem {
	key: string;
	type: string;
	name: string;
	route: string;
	icon?: string;
	// items?: SubMenuItem[];
	// messages?: number;
	// hidden?: boolean;
}

const sitemap: MenuItem[] = [
	// {
	// 	key: "dashboard",
	// 	type: "collapse",
	// 	name: "Dashboard",
	// 	route: "/",
	// 	icon: "solar:widget-bold",
	// },
	{
		key: paths.users,
		type: "collapse",
		name: "Usuarios",
		route: paths.users,
		icon: "mdi:users-group-outline",
	},
	{
		key: paths.roles,
		type: "collapse",
		name: "Roles",
		route: paths.roles,
		icon: "mdi:account-key",
	},
	{
		key: paths.waterMeters,
		type: "collapse",
		name: "Medidores",
		route: paths.waterMeters,
		icon: "mdi:users-group-outline",
	},
	{
		key: paths.charts,
		type: "collapse",
		name: "Gráficas",
		route: paths.charts,
		icon: "mdi:users-group-outline",
	},
	{
		key: paths.billings,
		type: "collapse",
		name: "Tarifas",
		route: paths.billings,
		icon: "mdi:users-group-outline",
	},
	{
		type: "collapse",
		name: `Lecturas : ${formateDate(new Date(), "MMMM YYYY")} `,
		key: paths.readings,
		icon: "",
		route: paths.readings,
	},
	{
		type: "collapse",
		name: `Reportes : ${formateDate(new Date(), "MMMM YYYY")} `,
		key: "report",
		icon: "",
		route: "/report",
	},
	{
		type: "collapse",
		name: `Reporte anual: ${new Date().getFullYear()}`,
		key: "report/year",
		icon: "",
		route: "/report/year",
	},
	{
		type: "collapse",
		name: `Mesa Directiva: ${new Date().getFullYear()}`,
		key: paths.directors,
		icon: "",
		route: paths.directors,
	},
	{
		key: paths.signin,
		type: "collapse",
		name: "Iniciar sesión",
		route: paths.signin,
		icon: "mage:lock-fill",
	},
	{
		key: paths.signup,
		type: "collapse",
		name: "Registrarse",
		route: paths.signup,
		icon: "mage:user-plus-fill",
	},
];

export default sitemap;
