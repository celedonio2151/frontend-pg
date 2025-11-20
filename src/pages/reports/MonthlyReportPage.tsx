import { useCallback, useMemo, useState } from "react";
import { Box, Card, Chip, Divider, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";

// MUI ICONS
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";

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
import DatePickerInput from "components/DataPicker/DataPicker";
import { useLocalStorage, useSessionStorage } from "hooks/useStorage";
import getFirstEndDates from "helpers/getFirstEndDates";
import EmptyLoader from "components/loader/EmptyLoader";
import ErrorLoader from "components/loader/ErrorLoader";
import { SummaryCard } from "pages/readings/components/SummaryCard";
import { softColors } from "theme/palette";

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
	const { token } = useAuthContext();
	const { storedValue, setValue } = useSessionStorage(
		"selected-month-report",
		dayjs().toISOString()
	);
	const initialMonth = useMemo(() => {
		const savedMonth = storedValue;
		return savedMonth ? new Date(savedMonth) : dayjs().toDate();
	}, []);

	const [selectedMonth, setSelectedMonth] = useState<Date>(initialMonth);
	const date = useMemo(() => dayjs(selectedMonth), [selectedMonth]); // Set date based on selectedMonth
	const params = useMemo(() => {
		return getFirstEndDates(selectedMonth);
	}, [selectedMonth]);

	const {
		data: reports,
		error: errorReports,
		loading: loadingReports,
	} = useFetch<MonthlyReport>({
		endpoint: `/report/monthly?startDate=${params.startDate}&endDate=${params.endDate}`,
		token,
	});
	const handleMonthClick = useCallback(
		(newDate: Dayjs) => {
			const d = newDate || date;
			setSelectedMonth(d.toDate());
			setValue(d.toISOString());
		},
		[date]
	);

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
				accessorFn: (row) =>
					`${row.waterMeter.user.name} ${row.waterMeter.user.surname}`,
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
				accessorFn: (row) => row.invoice,
				header: "Estado de pago",
				cell: ({ getValue }) => (
					<Chip
						color={
							getValue() ? (getValue().isPaid ? "success" : "warning") : "error"
						}
						variant={getValue() ? "filled" : "outlined"}
						label={
							getValue()
								? getValue().isPaid
									? "Pagado"
									: "Pendiente"
								: "Sin recibo "
						}
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
			{
				accessorFn: (row) => row.invoice,
				header: "Estado de factura",
				cell: ({ getValue }) => (
					<Chip
						color={getValue() ? "success" : "error"}
						label={
							getValue()
								? getValue().status
									? "Activa"
									: "Anulada"
								: "Sin recibo "
						}
						variant="outlined"
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
		<Box mt={2} mb={2}>
			<DatePickerInput date={date} handlerDateChange={handleMonthClick} />

			<MDBox>
				<Typography variant="h4" gutterBottom>
					Seleccione un mes del {date.year()}
				</Typography>
				{/* {loading && <MDTypography>Loading...</MDTypography>} */}
				<MDTabMonth
					months={months}
					selectedMonth={selectedMonth}
					handleMonthClick={(d) => handleMonthClick(dayjs(d))} // Update selectedMonth with Date object
				/>
			</MDBox>
			<Divider />
			<Box mt={5} mb={3}>
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
									Reporte mes {months[selectedMonth.getMonth()]}{" "}
									{date.get("year")} cancelados y no cancelados
								</MDTypography>
							</MDBox>
							{!loadingReports && reports && reports.reports.length === 0 && (
								<EmptyLoader />
							)}
							{!loadingReports && reports && reports.reports.length > 0 && (
								<>
									<Box
										m={2}
										display="flex"
										flexDirection="row"
										justifyContent="space-between"
										gap={2}
										flexWrap="wrap"
									>
										<SummaryCard
											color=""
											bgColor={softColors.info}
											icon={<SummarizeRoundedIcon color="info" />}
											title="Reportes"
											value={reports.total}
										/>

										<SummaryCard
											color="info.main"
											bgColor={softColors.info}
											icon={<WaterDropRoundedIcon color="info" />}
											title="Cubos m³"
											value={reports.summary.totalCubes}
										/>

										<SummaryCard
											color="success.main"
											bgColor={softColors.success}
											icon={<PriceCheckRoundedIcon color="success" />}
											title="Facturado"
											value={reports.summary.totalPaid}
										/>

										<Box
											display="flex"
											flexDirection="column"
											bgcolor="#e3f2fd"
											px={2}
											py={1}
											borderRadius={2}
											minWidth={200}
											maxWidth={300}
										>
											<Box display="flex" justifyContent="space-between">
												<Typography variant="body2" color="success.main">
													Saldo Total
												</Typography>
												<Typography variant="h6" color="success.main">
													{reports.summary.totalBilled} Bs.
												</Typography>
											</Box>
											<Divider sx={{ my: 0.5 }} />
											<Box display="flex" justifyContent="space-between">
												<Typography variant="body2" color="error.main">
													Restante
												</Typography>
												<Typography variant="h6" color="error.main">
													{reports.summary.pendingAmount} Bs.
												</Typography>
											</Box>
										</Box>
									</Box>
									<MainTable columns={columns} data={reports.reports} />
								</>
							)}
							{errorReports && (
								<ErrorLoader
									title="Error al cargar los reportes"
									description={
										errorReports?.message || "Intente nuevamente más tarde."
									}
								/>
							)}
							{loadingReports && <MDTableLoading title="Cargando reportes" />}
						</Card>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
