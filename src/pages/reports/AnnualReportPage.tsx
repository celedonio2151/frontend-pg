import { useCallback, useMemo, useState } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs, { Dayjs } from "dayjs";

// MUI ICONS
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

import MDBox from "components/MDBox";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import MDTypography from "components/MDTypography";
import { useAuthContext } from "context/AuthContext";
import MainTable from "examples/Table";
import useFetch from "hooks/useFetch";
import type {
	AnnualReport,
	MonthlyData,
} from "pages/reports/interfaces/reports.interfaces";
import DatePickerInput from "components/DataPicker/DataPicker";
import { getFirstEndDatesYear } from "helpers/getFirstEndDates";

export default function AnnualReportPage() {
	const { token } = useAuthContext();
	const [date, setDate] = useState<Dayjs>(dayjs());
	const params = useMemo(() => getFirstEndDatesYear(date.toDate()), [date]);
	const {
		data: reports,
		error,
		loading,
	} = useFetch<AnnualReport>({
		endpoint: `/report/annual?startDate=${params.startDate}&endDate=${params.endDate}`,
		token,
	});

	const handleMonthOrDateChange = useCallback(
		(newDate: Dayjs | null) => {
			if (newDate) {
				setDate(newDate);
			}
		},
		[date]
	);

	const columns = useMemo<ColumnDef<MonthlyData, any>[]>(
		() => [
			{
				accessorFn: (row) => row,
				header: "N°",
				cell: (info) => info.row.index + 1,
			},
			{
				accessorFn: (row) => `${row.mes}`,
				header: "Mes",
			},
			{
				accessorFn: (row) => `${row.consumo} m³`,
				header: "Metros cúbicos (m³)",
			},
			{
				accessorKey: "facturado",
				header: "Saldo (Bs.)",
				cell: (info) => (
					<Typography variant="body2">{info.getValue()} Bs.</Typography>
				),
			},
		],
		[]
	);

	return (
		<Box mt={2} mb={3}>
			<Box mb={5}>
				<DatePickerInput
					date={date}
					handlerDateChange={handleMonthOrDateChange}
				/>
			</Box>
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
								Reporte del año {date.year()}
							</MDTypography>
						</MDBox>
						{reports && !loading && (
							<>
								<Box
									m={2}
									display="flex"
									justifyContent={"space-between"}
									flexDirection="row"
									flexWrap="wrap"
								>
									<Box
										display="flex"
										alignItems="center"
										maxWidth={300}
										height={70}
										gap={1}
										bgcolor="#e3f2fd"
										px={2}
										py={1}
										borderRadius={2}
									>
										<WaterDropRoundedIcon color="info" />
										<Typography variant="subtitle2" color="info.main">
											Consumo anual
										</Typography>
										<Typography variant="h6" color="info.main">
											{reports.summary.totalConsumo} m³
										</Typography>
									</Box>
									<Box
										display="flex"
										alignItems="center"
										gap={1}
										height={70}
										maxWidth={300}
										px={2}
										py={1}
										bgcolor="#e8f5e9" // Quiero verde suave mas suave
										borderRadius={2}
									>
										<PriceCheckRoundedIcon color="success" />
										<Typography variant="subtitle2" color="success.main">
											Facturación anual
										</Typography>
										<Typography variant="h6" color="success.main">
											{reports.summary.totalFacturado} Bs.
										</Typography>
									</Box>
								</Box>
								<MainTable data={reports.monthlyData} columns={columns} />
							</>
						)}

						{error && (
							<Typography variant="h4" sx={{ p: 2 }}>
								"Error al cargar el reporte anual: {error.message}"
							</Typography>
						)}
						{loading && <MDTableLoading title="Cargando reporte anual.." />}
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
