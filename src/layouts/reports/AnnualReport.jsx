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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/profile/components/Header";

import useFetch from "hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import "./styles.css";
import { Box, Button, Card } from "@mui/material";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import {
	DatePicker,
	MobileDatePicker,
	MobileDateTimePicker,
} from "@mui/x-date-pickers";
import useFetchEvent from "hooks/useFetchEvent";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import ReportAnnualTable from "./components/ReportAnnualTable";
import CustomTable from "examples/Table";
import PaymentBarChart from "./components/MejorData";
import handlerErrors from "helpers/handlerErrors";
import { useAuthContext } from "context/AuthContext";

export default function AnnualReport() {
	const { token, userProfile } = useAuthContext();
	const [date, setDate] = useState(dayjs(new Date())); // Select date and time
	// const [reports, setReports] = useState(null); // get reports from server
	const [reports, loadingReports, errorReports] = useFetch(
		`/report/year?date=${date}`,
		null,
		token
	);

	const columns = [
		{
			header: "Nº",
			accessorKey: "_id",
		},
		{
			header: "Nombre",
			accessorKey: "fullname",
		},
		{
			header: "CI",
			accessorKey: "ci",
		},
		{
			header: "Medidor",
			accessorKey: "meterNumber",
		},
		{
			header: "Enero",
			accessorKey: "",
		},
		{
			header: "Febrero",
			accessorKey: "",
		},
		{
			header: "Marzo",
			accessorKey: "",
		},
		{
			header: "Abril",
			accessorKey: "",
		},
		{
			header: "Mayo",
			accessorKey: "",
		},
	];

	console.log(reports, loadingReports, errorReports);
	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox mb={2} />
			<Header userMe={userProfile}></Header>
			{/* <MDBox>{reports && <ReportAnnualTable data={reports} />}</MDBox> */}
			<Box sx={{ p: 3, minWidth: 300, maxWidth: 400, margin: "0 auto" }}>
				<MDBox mb={2} sx={{ backgroundColor: "" }}>
					<DemoItem label="Selecione una fecha para ver el reporte">
						<DatePicker
							sx={{
								border: "4px solid skyblue",
								bgcolor: "whitesmoke",
								borderRadius: 2,
							}}
							// label="Selecione una fecha"
							format="DD MMMM YYYY"
							value={date}
							onChange={(newValue) => setDate(newValue)}
						/>
					</DemoItem>
				</MDBox>
			</Box>
			<Card>
				<MDBox
					mx={2}
					mt={-3}
					py={3}
					px={2}
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="info"
				>
					<MDTypography variant="h5" color="white">
						Reporte anual del año {date.get("year")} cancelados y no cancelados
					</MDTypography>
				</MDBox>
				{reports && reports.length === 0 && (
					<MDTypography variant="h4" p={2}>
						Aun no existen lecturas
					</MDTypography>
				)}
				{reports && reports?.length > 0 && !loadingReports && (
					// <ReportAnnualTable data={reports} />
					<PaymentBarChart reports={reports} />
				)}
				{errorReports && (
					<MDTypography variant="h4" sx={{ p: 2 }}>
						{handlerErrors(errorReports)}
					</MDTypography>
				)}
				{loadingReports && (
					<MDTableLoading title={"Cargando reportes"} rows={5} />
				)}
			</Card>
			<Footer />
		</DashboardLayout>
	);
}
