import Icon from "@mui/material/Icon";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
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
	icon?: any;
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
		icon: <PeopleRoundedIcon />,
	},
	{
		key: paths.roles,
		type: "collapse",
		name: "Roles",
		route: paths.roles,
		icon: <KeyRoundedIcon />,
	},
	{
		key: paths.waterMeters,
		type: "collapse",
		name: "Medidores",
		route: paths.waterMeters,
		icon: <SpeedRoundedIcon />,
	},
	{
		key: paths.charts,
		type: "collapse",
		name: "Gráficas",
		route: paths.charts,
		icon: <InsightsRoundedIcon />,
	},
	{
		key: paths.billings,
		type: "collapse",
		name: "Tarifas",
		route: paths.billings,
		icon: <MonetizationOnRoundedIcon />,
	},
	{
		type: "collapse",
		name: `Lecturas : ${formateDate(new Date(), "MMMM YYYY")} `,
		key: paths.readings,
		icon: <BackupTableRoundedIcon />,
		route: paths.readings,
	},
	{
		type: "collapse",
		name: `Reportes : ${formateDate(new Date(), "MMMM YYYY")} `,
		key: paths.monthlyReport,
		icon: <AssessmentRoundedIcon />,
		route: paths.monthlyReport,
	},
	{
		type: "collapse",
		name: `Reporte anual: ${new Date().getFullYear()}`,
		key: paths.annualReport,
		icon: <AssessmentRoundedIcon />,
		route: paths.annualReport,
	},
	{
		type: "collapse",
		name: `Mesa Directiva: ${new Date().getFullYear()}`,
		key: paths.directors,
		icon: <Diversity3RoundedIcon />,
		route: paths.directors,
	},
	{
		key: paths.signin,
		type: "collapse",
		name: "Iniciar sesión",
		route: paths.signin,
		icon: <LoginRoundedIcon />,
	},
	{
		key: paths.signup,
		type: "collapse",
		name: "Registrarse",
		route: paths.signup,
		icon: <PersonAddRoundedIcon />,
	},
];

export default sitemap;
