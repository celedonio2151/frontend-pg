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
import { Box, Card } from "@mui/material";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components

import useFetch from "hooks/useFetch";
import { useState } from "react";
import dayjs from "dayjs";

import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import ReportAnnualTable from "./components/ReportAnnualTable";
import CustomTable from "examples/Table";
import PaymentBarChart from "./components/MejorData";
import handlerErrors from "helpers/handlerErrors";
import { useAuthContext } from "context/AuthContext";
import type { ReportAnnualByMeter } from "pages/reports/interfaces/reports.annual.interface";
import { getFirstEndDatesYear } from "helpers/getFirstEndDates";

type Props = {
	date: Date;
};

export default function AnnualReport({ date }: Props) {
	const { token } = useAuthContext();
	const { startDate, endDate } = getFirstEndDatesYear(date);
	const {
		data: reports,
		loading,
		error,
	} = useFetch<ReportAnnualByMeter>({
		endpoint: `/report/annual-by-meter?startDate=${startDate}&endDate=${endDate}`,
		token,
	});

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

	return (
		<>
			{/* <MDBox>{reports && <ReportAnnualTable data={reports} />}</MDBox> */}
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
						Reporte anual del año {date.getFullYear()} cancelados y no
						cancelados
					</MDTypography>
				</MDBox>
				{reports && reports.readings.length === 0 && (
					<MDTypography variant="h4" p={2}>
						Aun no existen lecturas
					</MDTypography>
				)}
				{reports && reports.readings.length > 0 && !loading && (
					<>
						{/* <ReportAnnualTable data={reports.readings} /> */}
						<PaymentBarChart readings={reports.readings} />
					</>
				)}
				{error && (
					<MDTypography variant="h4" sx={{ p: 2 }}>
						{handlerErrors(error)}
					</MDTypography>
				)}
				{loading && <MDTableLoading title={"Cargando reportes"} rows={5} />}
			</Card>
		</>
	);
}
