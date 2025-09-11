import { useState } from "react";
import { useSnackbar } from "notistack";
import {
	Box,
	Card,
	Checkbox,
	CircularProgress,
	Typography,
	Button,
	Grid,
	FormControlLabel,
} from "@mui/material";

// MUI ICONS
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";

import { formateDate } from "helpers/formatDate";
import type { WaterMeter } from "pages/meters/interfaces/meter.interface";
import type { ManyInvoices } from "pages/readings/interfaces/many-invoices/many-invoices";
import EmptyLoader from "components/loader/EmptyLoader";
import { useAuthContext } from "context/AuthContext";
import useFetch from "hooks/useFetch";
import usePut from "hooks/usePut";
import MDButton from "components/MDButton";

type Props = {
	waterMeter: WaterMeter;
};

export default function PayManyInvoices({ waterMeter }: Props) {
	const { token } = useAuthContext();
	const [invoiceIds, setInvoiceIds] = useState<string[]>([]);
	const [totaBalance, setTotaBalance] = useState(0);
	const { enqueueSnackbar } = useSnackbar();
	const {
		data: invoicesData,
		loading,
		error,
	} = useFetch<ManyInvoices>({
		endpoint: `/invoice/no-paid?ci=${waterMeter.ci}`,
		token,
	});
	const { put, loading: loadingPut, error: errorPut } = usePut();
	// Select one option
	const handleToggle = (id: string) => {
		setInvoiceIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
		// Sumar el amountDue y guardar
		invoiceIds.map((id) => {
			invoicesData?.invoices.findIndex(id);
		});
	};

	// Select all options
	const handleSelectAll = () => {
		if (invoiceIds.length === invoicesData?.invoices.length) setInvoiceIds([]);
		if (invoicesData && invoicesData?.invoices.length > 0) {
			setInvoiceIds(invoicesData.invoices.map((inv) => inv._id));
			const summary = invoicesData?.invoices.map((inv) => inv.amountDue);
			setTotaBalance(summary.reduce((a, b) => a + b, 0));
		}
	};
	console.log({ totaBalance });

	const handleOnSubmit = async () => {
		console.log(invoiceIds);
		try {
			const res = await put(
				"/invoice/pay-many-lalaalal",
				{ invoiceIds },
				token
			);
			if (res) {
				enqueueSnackbar("Facturas pagadas con éxito", { variant: "success" });
				setInvoiceIds([]);
			}
		} catch {
			if (errorPut)
				enqueueSnackbar("Error al pagar las facturas", { variant: "error" });
		}
	};

	if (loading) return <CircularProgress />;
	if (error)
		return <Typography color="error">Error al cargar facturas</Typography>;

	return (
		<Grid
			container
			spacing={2}
			direction={"column"}
			mx={"auto"}
			mb={3}
			width={"100%"}
			// bgcolor={"yellowgreen"}
			maxWidth={500}
		>
			<Grid
				item
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
			>
				<Box display={"flex"} justifyContent={"center"}>
					<WaterDropRoundedIcon fontSize="large" color="info" />
				</Box>
				<Typography variant="h3" fontWeight="bold" textAlign="center">
					Pagar recibos de Agua
				</Typography>
				<Typography variant="body2" mb={2} textAlign="center">
					Selecciona los meses que deseas pagar.
				</Typography>
			</Grid>
			{invoicesData?.invoices.length === 0 && (
				<EmptyLoader title="No hay facturas pendientes." />
			)}

			<Grid item>
				{!loading && invoicesData && invoicesData?.invoices.length > 0 && (
					<FormControlLabel
						control={
							<Checkbox
								checked={invoiceIds.length === invoicesData.invoices.length}
								indeterminate={
									invoiceIds.length > 0 &&
									invoiceIds.length < invoicesData.invoices.length
								}
								onChange={handleSelectAll}
							/>
						}
						label="Seleccionar todos"
					/>
				)}
			</Grid>

			{invoicesData?.invoices.map((inv) => {
				const reading = inv.meterReading;
				const meter = reading.waterMeter;
				const isChecked = invoiceIds.includes(inv._id);
				return (
					<Grid item xs={12} key={inv._id}>
						<Card
							sx={{
								display: "flex",
								alignItems: "start",
								justifyContent: "space-between",
								px: 2,
								py: 1,
								bgcolor: isChecked ? "#e3f2fd" : "#f5f5f5",
								boxShadow: isChecked ? 4 : 1,
								border: isChecked ? "2px solid #1976d2" : "1px solid #e0e0e0",
								transition: "all 0.2s",
							}}
						>
							<Box
								display="flex"
								alignItems="center"
								gap={2}
								width={1}
								// bgcolor={"red"}
							>
								<Checkbox
									checked={isChecked}
									onChange={() => handleToggle(inv._id)}
									color="primary"
								/>
								<Box width={1}>
									{/* Box date */}
									<Box display="flex" alignItems="center" gap={1}>
										<CalendarMonthRoundedIcon fontSize="small" color="action" />
										<Typography variant="body2" fontWeight="bold">
											{formateDate(
												new Date(reading.date),
												"DD MMMM YYYY"
											).toUpperCase()}
										</Typography>
									</Box>
									{/* Box cubes and amount */}
									<Box
										display="flex"
										alignItems="center"
										justifyContent={"space-between"}
										mt={0.5}
									>
										<Box display={"flex"} alignItems={"center"} gap={1}>
											<WaterDropRoundedIcon fontSize="small" color="info" />
											<Typography variant="body2" fontWeight="bold">
												{reading.cubicMeters} m³
											</Typography>
										</Box>
										<Box display="flex" alignItems="center" gap={1}>
											<MonetizationOnRoundedIcon
												fontSize="small"
												color="success"
											/>
											<Typography
												variant="body2"
												fontWeight="bold"
												color={"green"}
											>
												{inv.amountDue} Bs.
											</Typography>
										</Box>
									</Box>
								</Box>
							</Box>
						</Card>
					</Grid>
				);
			})}
			<Grid item>
				<MDButton
					variant="gradient"
					color="info"
					size="large"
					fullWidth
					disabled={invoiceIds.length === 0 || loadingPut}
					onClick={handleOnSubmit}
					sx={{ mt: 2, fontWeight: "bold", py: 1.2 }}
				>
					Pagar{" "}
					{invoiceIds.length > 0
						? `${invoiceIds.length} factura(s)`
						: "selección"}
				</MDButton>
			</Grid>
		</Grid>
	);
}
