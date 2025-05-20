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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Data
// import authorsTableData from "layouts/users/data/authorsTableData";
import { useEffect, useMemo, useState } from "react";
import CustomTable from "examples/Table";
import { NavLink } from "react-router-dom";
import useFetch from "hooks/useFetch";
import { formateDate } from "helpers/formatDate";
import RegisterFormMR from "./RegisterFormMR";

import useFetchEvent from "hooks/useFetchEvent";
import MDTabMonth from "components/MDTabMonth/MDTabMonth";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import usePost from "hooks/usePost";
import { months } from "dayjs/locale/es";
import JsonToExcel from "components/XLSX/JsonToExcel";
import { useAuthContext } from "context/AuthContext";
import type { ColumnDef } from "@tanstack/react-table";
import type {
	Reading,
	Readings,
} from "layouts/meterReadings/interfaces/meterReading.interface";

export default function MeterReadingsPage() {
	const { token } = useAuthContext();
	const [date, setDate] = useState(dayjs(new Date())); // Select date and time
	const [tabsOrientation, setTabsOrientation] = useState("horizontal");
	const [selectedMonth, setSelectedMonth] = useState(date.get("month")); // Select a month
	// const [eventTrigger, setEventTrigger] = useState(new Date()); // Event trigger
	const [readingUrl, setReadingUrl] = useState(`/reading`); // URL for reading

	const [newMeterReading, setNewMeter] = useState(false); // Show form or hidden
	const { data, loading, error } = useFetch<Readings>({
		endpoint: readingUrl,
		eventTrigger: null,
		token,
	});
	const { post, loading: postLoading, error: postError } = usePost();

	useEffect(() => {
		const savedMonth = sessionStorage.getItem("selectedMonth");
		if (savedMonth) setSelectedMonth(Number(savedMonth));
	}, []); // Se ejecuta solo una vez al cargar

	useEffect(() => {
		// A function that sets the orientation state of the tabs.
		function handleTabsOrientation() {
			return window.innerWidth < breakpoints.values.sm
				? setTabsOrientation("vertical")
				: setTabsOrientation("horizontal");
		}

		/** 
    The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
		window.addEventListener("resize", handleTabsOrientation);

		// Call the handleTabsOrientation function to set the state with the initial value.
		handleTabsOrientation();

		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleTabsOrientation);
	}, [tabsOrientation]);

	const saveSelectedMonth = (monthIndex: number) => {
		const saveMonth = Number(sessionStorage.getItem("selectedMonth"));
		if (saveMonth) {
			console.log("Mes guardado en el sessionStorage", saveMonth);
			// setSelectedMonth(saveMonth);
		}
		sessionStorage.setItem("selectedMonth", monthIndex.toString());
	};

	// useEffect(() => {
	// 	setSelectedMonth(Number(sessionStorage.getItem("selectedMonth")));
	// }, []);

	const handleMonthClick = (monthIndex: number) => {
		// const dateF = new Date(date.year(), monthIndex, 20); // Siempre fecha 20 del mes
		const startDate = new Date(date.year(), monthIndex, 1, 0, 0, 0, 0).toISOString();
		const endDate = new Date(date.year(), monthIndex + 1, 0, 23, 59, 59, 999).toISOString();
		console.log("fechas:", startDate, endDate, "Mes Index:", monthIndex);
		setSelectedMonth(monthIndex); // Guarda el mes en el estado
		saveSelectedMonth(monthIndex); // Guardar el mes fecha en sessionStorage
		setReadingUrl(`/reading?startDate=${startDate}&endDate=${endDate}`);
	};

	const handleGenerateInvoices = async () => {
		const dateF = new Date(date.year(), selectedMonth, date.date());
		try {
			const invoices = await post(`/invoice`, { date: dateF }, token);
			if (invoices) {
				alert("Recibos generados correctamente");
			}
		} catch (err) {
			if (err) {
				alert("Error al generar recibos");
				console.log(err);
			}
		}
	};

	const handlePrintInvoice = async (readingId: string) => {
		// Ver y descargar en certificado
		const apiUrl = `${
			import.meta.env.VITE_SERVER
		}/invoice/pdf-double/${readingId}`;
		const headers = {
			Authorization: `Bearer ${token}`, // Agregar el token como cabecera de autorización
		};
		try {
			// Realizar una solicitud para verificar si el PDF está disponible
			const response = await fetch(apiUrl, { headers });

			if (response.status === 200) {
				// Si la solicitud fue exitosa (status 200), abrir la URL en una nueva ventana
				const blob = await response.blob();
				const pdfURL = URL.createObjectURL(blob);
				window.open(pdfURL, "_blank", "noopener,noreferrer");
			} else {
				// Manejar el caso en el que la solicitud no sea exitosa
				console.error(
					"Error al obtener el PDF. Estado de respuesta:",
					response.status
				);
			}
		} catch (error) {
			// Manejar errores de red u otras excepciones
			console.error("Error al obtener el PDF:", error);
		}
	};
	
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
						{/* <Divider  /> */}
						{/* {String(row.original.invoice?.isPaid)} */}
						<IconButton
							aria-label="delete"
							color="info"
							disabled={row.original.invoice?.isPaid ? false : true}
							onClick={() => handlePrintInvoice(row.original._id)}
						>
							<ReceiptRoundedIcon fontSize="large" />
						</IconButton>
					</Box>
				),
			},
			// {
			// 	header: "Recibos",
			// 	accessorKey: "_id",
			// 	cell: ({ getValue }) => (
			// 		<MDBox >
			// 			<MDButton
			// 				onClick={() => handlePrintInvoice(getValue)}
			// 				variant="contained"
			// 				color="success"
			// 			>
			// 				Ver Recibo
			// 			</MDButton>
			// 			<MDButton
			// 				onClick={() => handlePrintInvoice(getValue)}
			// 				variant="contained"
			// 				color="primary"
			// 			>
			// 				QR
			// 			</MDButton>
			// 		</MDBox>
			// 	),
			// },
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

	return (
		<>
			<MDBox pb={3}>
				<MDBox pb={4} sx={{ display: "flex", justifyContent: "space-between" }}>
					<MDButton
						variant="contained"
						color="info"
						startIcon={newMeterReading ? <VisibilityOff /> : <Visibility />}
						onClick={() => setNewMeter(!newMeterReading)}
					>
						Nueva Lectura
					</MDButton>
					<span>&nbsp;</span>
					<MDButton
						variant="contained"
						color="primary"
						startIcon={<ReceiptRoundedIcon />}
						onClick={handleGenerateInvoices}
					>
						Generar recibos
					</MDButton>
				</MDBox>
				{/* FORMUlARIO DE REGISTRO DE METER READING */}
				{newMeterReading && (
					<MDBox sx={{ maxWidth: 500, margin: "0 auto" }}>
						<RegisterFormMR token={token} setNewMeter={setNewMeter} />
					</MDBox>
				)}
				<Box sx={{ p: 3, minWidth: 300, maxWidth: 400, margin: "0 auto" }}>
					<MDBox mb={2} sx={{ backgroundColor: "" }}>
						<DemoItem label="Selecione una fecha para ver lecturas">
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
									setSelectedMonth(newValue.month()),
									handleMonthClick(newValue.month())
								)}
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
							setSelectedMonth={setSelectedMonth}
							handleMonthClick={handleMonthClick}
						/>
					</Grid>
					{/* TABLA DE LECTURAS DEL MES */}
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
										<JsonToExcel
											headers={headers}
											data={transformData(data.readings)}
										/>
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

function transformData(data) {
	return data.map((item) => {
		const invoiceIsPaid = item.invoice ? item.invoice.isPaid : null;

		return {
			id: item._id,
			ci: item.waterMeter.ci,
			fullname: item.waterMeter.fullname,
			meterNumber: item.waterMeter.meterNumber,
			status: item.waterMeter.status ? "ACTIVO" : "INACTIVO",
			date: formateDate(item.date, "DD-MM-YYYY"),
			beforeMonthDate: formateDate(item.beforeMonth.date, "DD-MM-YYYY"),
			beforeMonthValue: item.beforeMonth.meterValue,
			lastMonthDate: formateDate(item.lastMonth.date, "DD-MM-YYYY"),
			lastMonthValue: item.lastMonth.meterValue,
			cubicMeters: item.cubicMeters,
			balance: item.balance,
			invoiceIsPaid: invoiceIsPaid ? "PAGADO" : "SIN PAGAR",
		};
	});
}
