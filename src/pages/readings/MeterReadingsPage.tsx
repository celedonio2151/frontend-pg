import {
	Box,
	IconButton,
	Card,
	Grid,
	Divider,
	Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMemo, useState, useCallback } from "react";
import CustomTable from "examples/Table";
import { useNavigate } from "react-router-dom";
import useFetch from "hooks/useFetch";
import { formateDate } from "helpers/formatDate";
import MDTabMonth from "components/MDTabMonth/MDTabMonth";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import usePost from "hooks/usePost";
import JsonToExcel from "components/XLSX/JsonToExcel";
import { useAuthContext } from "context/AuthContext";
import type { ColumnDef } from "@tanstack/react-table";
import type {
	Reading,
	Readings,
} from "pages/readings/interfaces/meterReading.interface";
import CreateReadingPage from "pages/readings/CreateReadingPage";
import getFirstEndDates from "helpers/getFirstEndDates";
import paths from "routes/paths";
import { useSnackbar } from "notistack";
import useLocalStorage from "hooks/useStorage";
import EmptyLoader from "components/loader/EmptyLoader";
import ErrorLoader from "components/loader/ErrorLoader";
import DatePickerInput from "components/DataPicker/DataPicker";

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

export default function MeterReadingsPage() {
	const { token } = useAuthContext();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { storedValue, setValue } = useLocalStorage<Date>(
		"selectedDate",
		dayjs().toDate()
	);

	const initialMonth = useMemo(() => {
		const savedMonth = sessionStorage.getItem("selectedMonth");
		return savedMonth ? new Date(savedMonth) : dayjs().toDate();
	}, []);

	const [selectedMonth, setSelectedMonth] = useState<Date>(initialMonth);
	const [newMeterReading, setNewMeter] = useState(false); // Show or hide new meter reading form

	const date = useMemo(() => dayjs(selectedMonth), [selectedMonth]);

	const params = useMemo(() => {
		return getFirstEndDates(selectedMonth);
	}, [selectedMonth]);

	const { data, loading, error } = useFetch<Readings>({
		endpoint: `/reading?startDate=${params.startDate}&endDate=${params.endDate}`,
		eventTrigger: params,
		token,
	});

	const { post, loading: postLoading, error: postError } = usePost();

	const handleMonthOrDateChange = useCallback(
		(newDate: Dayjs) => {
			const d = newDate || date;
			setSelectedMonth(d.toDate());
			sessionStorage.setItem("selectedMonth", d.toDate().toISOString());
			console.log("Fecha selecionada: ", d.toDate());
		},
		[date]
	);

	const handleEditReading = (readingId: string) =>
		navigate(paths.editReading.split(":")[0] + readingId);

	const handleGenerateInvoices = async () => {
		try {
			const { startDate, endDate } = getFirstEndDates(date.toDate());
			const invoices = await post(`/invoice`, { startDate, endDate }, token);
			if (invoices) {
				enqueueSnackbar("Recibos generados correctamente", {
					variant: "success",
				});
			}
		} catch {
			if (postError) {
				enqueueSnackbar("Error al generar recibos", { variant: "error" });
			}
		}
	};

	const handlePrintInvoice = async (readingId: string) => {
		const apiUrl = `${
			import.meta.env.VITE_SERVER
		}/invoice/pdf-double/${readingId}`;
		try {
			const response = await fetch(apiUrl, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.status === 200) {
				const blob = await response.blob();
				const pdfURL = URL.createObjectURL(blob);
				window.open(pdfURL, "_blank", "noopener,noreferrer");
			} else {
				console.log(
					"Error al obtener el PDF. Estado de respuesta:",
					response.status
				);
			}
		} catch (error) {
			console.log("Error al obtener el PDF:", error);
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
						<IconButton onClick={() => handleEditReading(row.original._id)}>
							<EditNoteRoundedIcon color="primary" fontSize="large" />
						</IconButton>
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
		[handleEditReading]
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

	const excelData = useMemo(() => {
		if (!data?.readings) return [];
		return data.readings.map((item) => ({
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
			invoiceIsPaid: item.invoice?.isPaid ? "PAGADO" : "SIN PAGAR",
		}));
	}, [data]);

	return (
		<Box pb={3}>
			<Box pb={4} display="flex" justifyContent="space-between">
				<MDButton
					variant="gradient"
					color="info"
					startIcon={newMeterReading ? <VisibilityOff /> : <Visibility />}
					onClick={() => setNewMeter(!newMeterReading)}
				>
					Nueva Lectura
				</MDButton>

				<span />

				<MDButton
					variant="gradient"
					color="primary"
					startIcon={<ReceiptRoundedIcon />}
					onClick={handleGenerateInvoices}
					disabled={postLoading}
				>
					{postLoading ? "Generando..." : "Generar recibos"}
				</MDButton>
			</Box>

			{newMeterReading && (
				<Box sx={{ maxWidth: 500, margin: "0 auto" }}>
					<CreateReadingPage />
				</Box>
			)}

			<DatePickerInput
				date={date}
				handlerDateChange={handleMonthOrDateChange}
			/>

			<Typography variant="h4" gutterBottom>
				Seleccione un mes del {date.year()}
			</Typography>

			<Grid container justifyContent="center" spacing={6}>
				<Grid item xs={12}>
					<MDTabMonth
						months={months}
						selectedMonth={selectedMonth}
						handleMonthClick={(month) => handleMonthOrDateChange(dayjs(month))}
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
								Lectura de medidores {months[selectedMonth.getMonth()]}{" "}
								{date.year()} Agua Potable Mosoj Llajta
							</MDTypography>
						</MDBox>
						<Divider />

						{loading && <MDTableLoading title="Cargando lecturas" rows={5} />}
						{!loading && data?.readings?.length === 0 && (
							<EmptyLoader
								title="No hay lecturas disponibles"
								description="No se encontraron lecturas para el mes seleccionado."
							/>
						)}

						{error && (
							<ErrorLoader
								title="Error al cargar lecturas"
								description={`Ocurrió un error al intentar cargar las lecturas. Por favor, inténtelo de nuevo más tarde.`}
							/>
						)}

						{!loading && data && data?.readings?.length > 0 && (
							<>
								<CustomTable data={data.readings} columns={columns} />
								<JsonToExcel headers={headers} data={excelData} />
							</>
						)}
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
