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

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import useFetch from "hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import "./styles.css";
import { Box, Button, Card, IconButton, Paper, Tab, Tabs } from "@mui/material";
import MDButton from "components/MDButton";
import ReportsTable from "./components/ReportsTable";
import MDTabMonth from "components/MDTabMonth/MDTabMonth";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import {
	DatePicker,
	MobileDatePicker,
	MobileDateTimePicker,
} from "@mui/x-date-pickers";
import useFetchEvent from "hooks/useFetchEvent";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import { useAuthContext } from "context/AuthContext";

const months = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

export default function MontlyReport() {
	const { token, userProfile } = useAuthContext();
	const [date, setDate] = useState(dayjs(new Date())); // Select date and time
	const [selectedMonth, setSelectedMonth] = useState(date.month()); // get month from date
	const [reports, setReports] = useState(null); // get reports from server
	const [loadingReports, setLoadingReports] = useState(false); // loading reports
	const [errorReports, setErrorReports] = useState(null); // error reports

	useEffect(() => {
		setLoadingReports(true);
		useFetchEvent(`/report?date=${date.toDate()}`, token)
			.then((response) => {
				console.log(response);
				setReports(response);
			})
			.catch((err) => {
				// console.log(err);
				setReports(null);
				setErrorReports(err.message);
			})
			.finally(() => setLoadingReports(false));
	}, []);

	const handleMonthClick = (monthIndex) => {
		// const currentYear = new Date().getFullYear();
		const dateF = new Date(date.year(), monthIndex, 20); // Siempre 20 del mes
		setSelectedMonth(monthIndex);
		console.log({ dateF });

		setLoadingReports(false);
		useFetchEvent(`/report?date=${dateF}`, token)
			.then((response) => {
				// console.log(response);
				setReports(response);
			})
			.catch((err) => {
				// console.log(err);
				setReports(null);
				setErrorReports(err.message);
			})
			.finally(() => setLoadingReports(false));
	};
	// console.log(userMe);
	// console.log(date.month());
	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox mb={2} />
			<Header userMe={userProfile}></Header>
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
							onChange={(newValue) => (
								setDate(newValue),
								setSelectedMonth(
									newValue.month(),
									handleMonthClick(newValue.month())
								)
							)}
						/>
					</DemoItem>
				</MDBox>
			</Box>
			<MDBox>
				<MDTypography variant="h4" gutterBottom>
					Seleccione un mes del {date.year()}
				</MDTypography>
				{/* {loading && <MDTypography>Loading...</MDTypography>} */}
				<MDTabMonth
					months={months}
					selectedMonth={selectedMonth}
					setSelectedMonth={setSelectedMonth}
					handleMonthClick={handleMonthClick}
				/>
			</MDBox>
			<Divider />
			<MDBox mt={5} mb={3}>
				<Grid container spacing={1}>
					<Grid item xs={12}>
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
									Reporte mes {months[selectedMonth]} {date.get("year")}{" "}
									cancelados y no cancelados
								</MDTypography>
							</MDBox>
							{reports && !loadingReports ? (
								<ReportsTable data={reports} />
							) : errorReports ? (
								<MDTypography variant="h4" sx={{ p: 2 }}>
									{errorReports}
								</MDTypography>
							) : (
								<MDTableLoading title={"Cargando reportes"} rows={5} />
							)}
						</Card>
					</Grid>
				</Grid>
			</MDBox>
			<Footer />
		</DashboardLayout>
	);
}
