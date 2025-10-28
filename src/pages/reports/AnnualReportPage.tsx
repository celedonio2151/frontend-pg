import { useCallback, useMemo, useState, type SyntheticEvent } from "react";
import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
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
import AnnualReportComponent from "pages/reports/AnnualReport";
import { useSessionStorage } from "hooks/useStorage";

export default function AnnualReportPage() {
	const { token } = useAuthContext();
	const { storedValue, setValue } = useSessionStorage(
		"selected-year-report",
		dayjs().toISOString()
	);
	const initialMonth = useMemo(() => {
		const savedMonth = storedValue;
		return savedMonth ? new Date(savedMonth) : dayjs().toDate();
	}, []);
	const [date, setDate] = useState<Dayjs>(dayjs(initialMonth));

	const [value, setValueTab] = useState("one"); // FOR TABS SELECTED
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
				setValue(newDate.toISOString());
			}
		},
		[date]
	);

	const handleChange = (event: SyntheticEvent, newValue: string) =>
		setValueTab(newValue);

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
			<Box mb={2}>
				<DatePickerInput
					date={date}
					handlerDateChange={handleMonthOrDateChange}
				/>
			</Box>
			{/* TAB PARA CAMBIAR ENTRE GLOBAL Y POR MEDIDOR */}
			<Tabs
				sx={{ backgroundColor: "", width: "100%", my: 3 }}
				orientation={"horizontal"}
				value={value}
				onChange={handleChange}
				textColor="secondary"
				indicatorColor="secondary"
				aria-label="secondary tabs example"
				centered
			>
				<Tab
					sx={{ py: 2 }}
					value="one"
					label="Reporte anual"
					icon={<WaterDropRoundedIcon fontSize="medium" />}
					iconPosition="start"
					id="tab-one" // ID para accesibilidad
					aria-controls="tabpanel-one" // Controla qué panel se muestra
				/>
				<Tab
					sx={{ py: 2 }}
					value="two"
					label="Reporte personal"
					icon={<WaterDropRoundedIcon fontSize="medium" />}
					iconPosition="start"
					id="tab-two"
					aria-controls="tabpanel-two"
				/>
			</Tabs>

			<Grid container spacing={1}>
				<Grid item xs={12}>
					<TabPanel value={value} index="one">
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
					</TabPanel>

					<TabPanel value={value} index="two">
						<AnnualReportComponent date={date.toDate()} />
					</TabPanel>
				</Grid>
			</Grid>
		</Box>
	);
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: string;
	value: string;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			sx={{ pt: 2 }}
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <>{children}</>}
		</Box>
	);
}
