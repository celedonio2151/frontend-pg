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
import { Box, IconButton, Card, Grid, Divider } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Data
// import authorsTableData from "layouts/users/data/authorsTableData";
import { useMemo, useState, useCallback } from "react";
import CustomTable from "examples/Table";
import { NavLink } from "react-router-dom";
import useFetch from "hooks/useFetch";
import { formateDate } from "helpers/formatDate";

import MDTabMonth from "components/MDTabMonth/MDTabMonth";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import usePost from "hooks/usePost";
import { months } from "dayjs/locale/es";
import JsonToExcel from "components/XLSX/JsonToExcel";
import { useAuthContext } from "context/AuthContext";
import type { ColumnDef } from "@tanstack/react-table";
import type {
	Reading,
	Readings,
} from "pages/readings/interfaces/meterReading.interface";
import CreateReadingPage from "pages/readings/CreateReadingPage";
import getFirstEndDates from "helpers/getFirstEndDates";

export default function MeterReadingsPage() {
	const { token } = useAuthContext();

	// Inicializa el mes seleccionado desde sessionStorage solo una vez
	const getInitialMonth = () => {
		const savedMonth = sessionStorage.getItem("selectedMonth");
		return savedMonth ? Number(savedMonth) : dayjs().month();
	};

	const [selectedMonth, setSelectedMonth] = useState<number>(getInitialMonth());
	const [date, setDate] = useState<Dayjs>(dayjs().month(selectedMonth));
	const [params, setParams] = useState(() => {
		const d = dayjs().month(getInitialMonth());
		return {
			startDate: getFirstEndDates(d.toDate()).startDate,
			endDate: getFirstEndDates(d.toDate()).endDate,
		};
	});
	const [newMeterReading, setNewMeter] = useState(false);

	// Fetch lecturas del mes
	const { data, loading, error } = useFetch<Readings>({
		endpoint: `/reading?startDate=${params.startDate}&endDate=${params.endDate}`,
		eventTrigger: params, // Solo dispara cuando cambian los params
		token,
	});

	const { post, loading: postLoading, error: postError } = usePost();

	// Centraliza el cambio de mes y fecha, y guarda el mes en sessionStorage
	const handleMonthOrDateChange = useCallback(
		(newMonth: number, newDate?: Dayjs) => {
			const d = newDate ? newDate : dayjs(date).month(newMonth);
			const { startDate, endDate } = getFirstEndDates(
				new Date(d.year(), newMonth, 20)
			);
			setSelectedMonth(newMonth);
			sessionStorage.setItem("selectedMonth", newMonth.toString());
			setParams({ startDate, endDate });
			setDate(d);
		},
		[date]
	);

	// Genera recibos para el mes seleccionado
	const handleGenerateInvoices = async () => {
		const { startDate, endDate } = getFirstEndDates(date.toDate());
		try {
			const invoices = await post(`/invoice`, { startDate, endDate }, token);
			if (invoices) {
				alert("Recibos generados correctamente");
			}
		} catch (err) {
			if (postError) {
				alert("Error al generar recibos");
			}
		}
	};

	// Descarga el PDF del recibo
	const handlePrintInvoice = async (readingId: string) => {
		const apiUrl = `${
			import.meta.env.VITE_SERVER
		}/invoice/pdf-double/${readingId}`;
		const headers = { Authorization: `Bearer ${token}` };
		try {
			const response = await fetch(apiUrl, { headers });
			if (response.status === 200) {
				const blob = await response.blob();
				const pdfURL = URL.createObjectURL(blob);
				window.open(pdfURL, "_blank", "noopener,noreferrer");
			} else {
				console.error(
					"Error al obtener el PDF. Estado de respuesta:",
					response.status
				);
			}
		} catch (error) {
			console.error("Error al obtener el PDF:", error);
		}
	};

	// Columnas de la tabla
	const columns = useMemo<ColumnDef<Reading, any>[]>(
		() => [
			{
				id: "rowNumber",
				header: "Nº",
				cell: (info) => info.row.index + 1,
			},
			{
				header: "NOMBRES",
				accessorFn: (row) =>
					row.waterMeter?.name + " " + row.waterMeter?.surname,
				cell: ({ row, getValue }) => (
					<Box>
						{getValue()} <br />
						<strong>CI: {row.original.waterMeter?.ci}</strong>
					</Box>
				),
			},
			{
				header: "MEDIDOR",
				accessorKey: "waterMeter.meter_number",
			},
			{
				header: "FECHA",
				accessorKey: "date",
				cell: ({ getValue }) => formateDate(getValue(), `DD/MM/YYYY`),
			},
			{
				header: "MES ANTERIOR",
				accessorKey: `beforeMonth`,
				cell: ({ getValue }) => (
					<Box>
						{formateDate(getValue()?.date, `DD/MM/YYYY`)}
						<strong> {getValue()?.meterValue}</strong>
					</Box>
				),
			},
			{
				header: "ULTIMO MES",
				accessorKey: "lastMonth",
				cell: ({ getValue }) => (
					<Box>
						{formateDate(getValue()?.date, `DD/MM/YYYY`)}
						<strong> {getValue()?.meterValue}</strong>
					</Box>
				),
			},
			{
				header: () => (
					<span>
						CONSUMO m<sup>3</sup>
					</span>
				),
				accessorKey: "cubicMeters",
				cell: ({ getValue }) => (
					<Box>
						{getValue()}m<sup>3</sup>
					</Box>
				),
			},
			{
				header: "Saldo Bs.",
				accessorKey: "balance",
				cell: ({ getValue }) => <Box>{getValue()}Bs.</Box>,
			},
			{
				header: "Acciones",
				id: "acciones",
				cell: ({ row }) => (
					<Box sx={{ borderRadius: 3 }}>
						<NavLink to={`/meter-reading/${row.original._id}/edit`}>
							<IconButton>
								<EditNoteRoundedIcon color="primary" fontSize="large" />
							</IconButton>
						</NavLink>
						<IconButton
							aria-label="print"
							color="info"
							disabled={!row.original.invoice?.isPaid}
							onClick={() => handlePrintInvoice(row.original._id)}
						>
							<ReceiptRoundedIcon fontSize="large" />
						</IconButton>
					</Box>
				),
			},
		],
		[]
	);

	const headers = [
		{ title: "ID", width: 4 },
		{ title: "CI", width: 20 },
		{ title: "Nombre Completo", width: 30 },
		{ title: "Número de Medidor", width: 20 },
		{ title: "Estado Medidor", width: 20 },
		{ title: "Fecha Lecturación", width: 20 },
		{ title: "Fecha Mes Anterior", width: 20 },
		{ title: "Valor Mes Anterior", width: 20 },
		{ title: "Fecha Mes Actual", width: 20 },
		{ title: "Valor Mes Actual", width: 20 },
		{ title: "Metros Cúbicos", width: 20 },
		{ title: "Saldo Bs.", width: 10 },
		{ title: "Factura Pagada", width: 15 },
	];

	// Memoiza la transformación de datos para exportar a Excel
	const excelData = useMemo(() => {
		if (!data?.readings) return [];
		return data.readings.map((item) => {
			const invoiceIsPaid = item.invoice ? item.invoice.isPaid : null;
			return {
				id: item._id,
				ci: item.waterMeter.ci,
				fullname: item.waterMeter.name + " " + item.waterMeter.surname,
				meterNumber: item.waterMeter.meter_number,
				status: item.waterMeter.status ? "ACTIVO" : "INACTIVO",
				date: formateDate(item.date, "DD-MM-YYYY"),
				beforeMonthDate: formateDate(item.beforeMonth.date, "DD-MM-YYYY"),
				beforeMonthValue: item.beforeMonth.value,
				lastMonthDate: formateDate(item.lastMonth.date, "DD-MM-YYYY"),
				lastMonthValue: item.lastMonth.value,
				cubicMeters: item.cubicMeters,
				balance: item.balance,
				invoiceIsPaid: invoiceIsPaid ? "PAGADO" : "SIN PAGAR",
			};
		});
	}, [data]);

	return (
		<>
			<MDBox pb={3}>
				<MDBox pb={4} sx={{ display: "flex", justifyContent: "space-between" }}>
					{/* Botón para mostrar/ocultar formulario de nueva lectura */}
					<MDButton
						variant="contained"
						color="info"
						startIcon={newMeterReading ? <VisibilityOff /> : <Visibility />}
						onClick={() => setNewMeter(!newMeterReading)}
					>
						Nueva Lectura
					</MDButton>

					<span />
					<MDButton
						variant="contained"
						color="primary"
						startIcon={<ReceiptRoundedIcon />}
						onClick={handleGenerateInvoices}
						disabled={postLoading}
					>
						{postLoading ? "Generando..." : "Generar recibos"}
					</MDButton>
				</MDBox>
				{/* Formulario de registro de lectura (desactivado) */}
				{newMeterReading && (
					<MDBox sx={{ maxWidth: 500, margin: "0 auto" }}>
						<CreateReadingPage />
					</MDBox>
				)}
				<Box sx={{ p: 3, minWidth: 300, maxWidth: 400, margin: "0 auto" }}>
					<MDBox mb={2}>
						<DemoItem label="Seleccione una fecha para ver lecturas">
							<DatePicker
								sx={{
									border: "4px solid skyblue",
									bgcolor: "whitesmoke",
									borderRadius: 2,
								}}
								format="DD MMMM YYYY"
								value={date}
								onChange={(newValue) => {
									if (newValue)
										handleMonthOrDateChange(newValue.month(), newValue);
								}}
							/>
						</DemoItem>
					</MDBox>
				</Box>
				<MDTypography variant="h4" gutterBottom>
					Seleccione un mes del {date.year()}
				</MDTypography>
				<Grid container justifyContent="center" spacing={6}>
					<Grid item xs={12}>
						<MDTabMonth
							months={months}
							selectedMonth={selectedMonth}
							setSelectedMonth={(month) => handleMonthOrDateChange(month)}
							handleMonthClick={handleMonthOrDateChange}
						/>
					</Grid>
					<Grid id="target-table" item xs={12}>
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
									Lectura de medidores {months[selectedMonth]}{" "}
									{date.get("year")} Agua Potable Mosoj Llajta
								</MDTypography>
							</MDBox>
							<Divider />
							{data?.readings && !loading ? (
								data.readings.length === 0 ? (
									<MDTypography variant="h4" color="dark" sx={{ p: 2 }}>
										Sin lecturas para este mes
									</MDTypography>
								) : (
									<>
										<JsonToExcel headers={headers} data={excelData} />
										<CustomTable data={data.readings} columns={columns} />
									</>
								)
							) : (
								<MDTableLoading
									title={"Cargando lectura de medidores"}
									rows={5}
								/>
							)}
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</>
	);
}
