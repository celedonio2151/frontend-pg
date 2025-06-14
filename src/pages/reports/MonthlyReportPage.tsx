import { useMemo, useState } from "react";
import { Box, Card, Chip, Divider, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";

// MUI ICONS
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

import MDBox from "components/MDBox";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import MDTabMonth from "components/MDTabMonth/MDTabMonth";
import MDTypography from "components/MDTypography";
import { useAuthContext } from "context/AuthContext";
import MainTable from "examples/Table";
import { formateDate } from "helpers/formatDate";
import useFetch from "hooks/useFetch";
import type {
	MonthlyReport,
	Report,
} from "pages/reports/interfaces/reports.interfaces";

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

export default function MonthlyReportPage() {
	const [date, setDate] = useState(dayjs(new Date())); // Select date and time
	const [selectedMonth, setSelectedMonth] = useState(date.month()); // get month from date
	const [eventTrigger, setEventTrigger] = useState(0); // trigger to refetch reports
	const { token } = useAuthContext();
	const {
		data: reports,
		error: errorReports,
		loading: loadingReports,
	} = useFetch<MonthlyReport>({
		endpoint: `/report/monthly?startDate=2023-02-01T16%3A37%3A42.000Z&endDate=2023-02-30T16%3A37%3A42.000Z`,
		token,
		eventTrigger: eventTrigger,
	});

	const handleMonthClick = (monthIndex) => {
		// const currentYear = new Date().getFullYear();
		const dateF = new Date(date.year(), monthIndex, 20); // Siempre 20 del mes
		setSelectedMonth(monthIndex);
		console.log({ dateF });
	};

	const columns = useMemo<ColumnDef<Report, any>[]>(
		() => [
			{
				accessorFn: (row) => row,
				header: "N°",
				cell: (info) => info.row.index + 1,
			},
			{
				accessorKey: "waterMeter.meter_number",
				header: "N° de medidor",
			},
			{
				accessorFn: (row) => `${row.waterMeter.name} ${row.waterMeter.surname}`,
				header: "Nombre completo",
			},
			{
				accessorFn: (row) => `${row.cubicMeters} m³`,
				header: "Metros cúbicos (m³)",
			},
			{
				accessorFn: (row) => formateDate(row.date || new Date(), "DD-MM-YYYY"),
				header: "Fecha de lectura",
			},
			{
				accessorKey: "balance",
				header: "Saldo (Bs.)",
				cell: (info) => (
					<Typography variant="body2">{info.getValue()} Bs.</Typography>
				),
			},
			{
				accessorFn: (row) => row.invoice?.status,
				header: "Estado de factura",
				cell: ({ getValue }) => (
					<Chip
						color={getValue() ? "success" : "error"}
						label={getValue() ? "Pagada" : "No pagada"}
						icon={
							getValue() ? (
								<PriceCheckRoundedIcon />
							) : (
								<MoneyOffRoundedIcon color="error" />
							)
						}
					/>
				),
			},
		],
		[]
	);

	return (
		<>
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
									newValue?.month(),
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
							{reports && !loadingReports && (
								<>
									<Box
										m={2}
										display="flex"
										flexDirection="row"
										justifyContent="space-between"
										gap={2}
										flexWrap="wrap"
									>
										<Box
											display="flex"
											alignItems="center"
											gap={1}
											bgcolor="#e3f2fd"
											px={2}
											py={1}
											borderRadius={2}
											minWidth={250}
											maxWidth={300}
										>
											<SummarizeRoundedIcon color="primary" />
											<Box>
												<Typography variant="subtitle2" color="text.primary">
													Total de reportes
												</Typography>
												<Typography variant="h6" color="primary">
													{reports.total}
												</Typography>
											</Box>
										</Box>
										<Box
											display="flex"
											alignItems="center"
											gap={1}
											bgcolor="#e8f5e9"
											px={2}
											py={1}
											borderRadius={2}
											minWidth={200}
											maxWidth={300}
										>
											<PriceCheckRoundedIcon color="success" />
											<Box>
												<Typography variant="subtitle2" color="success.main">
													Cancelados
												</Typography>
												<Typography variant="h6" color="success.main">
													{reports.summary.totalPaid} Bs.
												</Typography>
											</Box>
										</Box>
										<Box
											display="flex"
											alignItems="center"
											gap={1}
											bgcolor="#ffebee"
											px={2}
											py={1}
											borderRadius={2}
											minWidth={200}
											maxWidth={300}
										>
											<MoneyOffRoundedIcon color="error" />
											<Box>
												<Typography variant="subtitle2" color="error.main">
													No cancelados
												</Typography>
												<Typography variant="h6" color="error.main">
													{reports.summary.totalPending} Bs.
												</Typography>
											</Box>
										</Box>
										<Box
											display="flex"
											alignItems="center"
											gap={1}
											bgcolor="#e3f2fd"
											px={2}
											py={1}
											borderRadius={2}
											minWidth={200}
											maxWidth={300}
										>
											<WaterDropRoundedIcon color="info" />
											<Box>
												<Typography variant="subtitle2" color="info.main">
													Metros cúbicos (m³)
												</Typography>
												<Typography variant="h6" color="info.main">
													{reports.summary.totalCubicMeters} m³
												</Typography>
											</Box>
										</Box>
									</Box>
									<MainTable columns={columns} data={reports.reports} filter />
								</>
							)}
							{errorReports && (
								<Typography variant="h4" sx={{ p: 2 }}>
									{errorReports.message || "Error al cargar los reportes"}
								</Typography>
							)}
							{loadingReports && <MDTableLoading title="Cargando reportes" />}
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</>
	);
}
