import { useState, type FC } from "react";
import { Box, Card, Typography } from "@mui/material";

// Icons
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";

// MD Components
import type { WaterMeter } from "pages/meters/interfaces/meter.interface";
import type { Reading } from "pages/readings/interfaces/meterReading.interface";
import { formateDate } from "helpers/formatDate";
import MDButton from "components/MDButton";
import CustomModal from "components/Modal/CustomModal";

// Types
interface MeterInfoCardProps {
	title: string;
	meter: WaterMeter;
	reading: Reading;
	method: "cash" | "qr" | "transfer";
}

const MeterInfoCard: FC<MeterInfoCardProps> = ({
	title,
	meter,
	reading,
	method,
}) => {
	const [open, setOpen] = useState(false); // Modal state

	const modalOpen = () => setOpen(true);
	const modalClose = () => setOpen(false);

	const handlerPay = () => {
		console.log("Pagar recibo");
		modalClose();
	};
	return (
		<>
			<Card
				sx={{
					width: "100%",
					maxWidth: 400,
					mx: "auto",
					mb: 2,
					borderRadius: 4,
					p: 1,
					background: "linear-gradient(180deg, #e3f2fd 0%, #fff 100%)",
				}}
			>
				<Typography
					variant="h5"
					fontWeight="medium"
					textAlign="center"
					py={1}
					sx={{ color: "#1976d2", letterSpacing: 0.5 }}
				>
					{title}
				</Typography>
				<Box px={1.5} pb={1}>
					{/* NOMBRE */}
					<Box display="flex" alignItems="center" flexDirection="row" py={1}>
						<Box display="flex" alignItems="center">
							<AccountCircleRoundedIcon color="action" fontSize="medium" />
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
							ml={2}
						>
							<Typography
								variant="caption"
								fontWeight="bold"
								color="text.secondary"
							>
								NOMBRE
							</Typography>
							<Typography variant="subtitle1" fontWeight="bold">
								{meter.name} {meter.surname}
							</Typography>
						</Box>
					</Box>
					{/* CI */}
					<Box display="flex" alignItems="center" flexDirection="row" py={1}>
						<Box display="flex" alignItems="center">
							<ContactEmergencyRoundedIcon color="action" fontSize="medium" />
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
							ml={2}
						>
							<Typography
								variant="caption"
								fontWeight="bold"
								color="text.secondary"
							>
								CI
							</Typography>
							<Typography variant="subtitle1" fontWeight="medium">
								{meter.ci}
							</Typography>
						</Box>
					</Box>
					{/* Nº MEDIDOR */}
					<Box display="flex" alignItems="center" flexDirection="row" py={1}>
						<Box display="flex" alignItems="center">
							<SpeedRoundedIcon color="action" fontSize="medium" />
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
							ml={2}
						>
							<Typography
								variant="caption"
								fontWeight="bold"
								color="text.secondary"
							>
								Nº MEDIDOR
							</Typography>
							<Typography variant="subtitle1" fontWeight="medium">
								{meter.meter_number}
							</Typography>
						</Box>
					</Box>
					{/* FECHA DE LECTURA */}
					<Box display="flex" alignItems="center" flexDirection="row" py={1}>
						<Box display="flex" alignItems="center">
							<CalendarMonthRoundedIcon color="action" fontSize="medium" />
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
							ml={2}
						>
							<Typography
								variant="caption"
								fontWeight="bold"
								color="text.secondary"
							>
								FECHA DE LECTURA
							</Typography>
							<Typography variant="subtitle1" fontWeight="medium">
								{formateDate(reading.date, "DD MMMM YYYY")}
							</Typography>
						</Box>
					</Box>

					{/* Consumo y Saldo */}
					<Box display="flex" gap={2} justifyContent="space-between" my={2}>
						<Box
							bgcolor="#e3f2fd"
							borderRadius={2}
							px={3}
							py={1}
							textAlign="center"
							width={"50%"}
						>
							<Typography
								variant="caption"
								fontWeight="bold"
								color="#1976d2"
								letterSpacing={1}
							>
								CONSUMO
							</Typography>
							<Typography variant="h4" fontWeight="bold" color="#1976d2">
								{reading.cubicMeters} m³
							</Typography>
						</Box>
						<Box
							bgcolor="#e8f5e9"
							borderRadius={2}
							px={3}
							py={1}
							textAlign="center"
							width={"50%"}
						>
							<Typography
								variant="caption"
								fontWeight="bold"
								color="#388e3c"
								letterSpacing={1}
							>
								SALDO
							</Typography>
							<Typography variant="h4" fontWeight="bold" color="#388e3c">
								{reading.balance} BS
							</Typography>
						</Box>
					</Box>

					{/* Estado */}
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						bgcolor={meter.status ? "#e8f5e9" : "#ffebee"}
						borderRadius={2}
						py={1}
						mb={2}
					>
						{meter.status ? (
							<VerifiedUserRoundedIcon sx={{ color: "#43a047", mr: 1 }} />
						) : (
							<GppBadRoundedIcon sx={{ color: "#e53935", mr: 1 }} />
						)}
						<Typography
							variant="subtitle2"
							fontWeight="bold"
							color={meter.status ? "#43a047" : "#e53935"}
						>
							ESTADO: {meter.status ? "ACTIVO" : "INACTIVO"}
						</Typography>
					</Box>

					{/* Botón */}
					{meter.status && reading.balance > 0 && (
						<Typography
							variant="body2"
							fontWeight="regular"
							color="text.secondary"
							textAlign="center"
							mb={1}
						>
							Pague su saldo pendiente para evitar la suspensión del servicio.
						</Typography>
					)}
					{!meter.status && (
						<Typography
							variant="body2"
							fontWeight="regular"
							color="text.secondary"
							textAlign="center"
							mb={1}
						>
							El servicio de agua está suspendido. Contacte con la
							administración.
						</Typography>
					)}
					{meter.status && reading.invoice && (
						<MDButton
							variant="gradient"
							color="success"
							fullWidth
							startIcon={<MonetizationOnRoundedIcon />}
							sx={{
								fontSize: "1rem",
								marginBottom: 2,
							}}
							onClick={modalOpen}
						>
							Pagar Ahora con{" "}
							{method === "cash"
								? "Efectivo"
								: method === "qr"
								? "QR"
								: "Transferencia"}
						</MDButton>
					)}
					{/* Botón Pagar Múltiples Meses */}
					{meter.status && reading.invoice && (
						<MDButton
							variant="gradient"
							fullWidth
							startIcon={<CreditCardRoundedIcon />}
							sx={{
								background: "#6c63ff",
								color: "#fff",
								fontSize: "1rem",
								boxShadow: "0 2px 8px 0 rgba(108,99,255,0.10)",
								"&:hover": { background: "#574fd6" },
							}}
						>
							Pagar Múltiples Meses
						</MDButton>
					)}
				</Box>
			</Card>
			<CustomModal
				open={open}
				onClose={modalClose}
				onConfirm={handlerPay}
				title="Pagar recibo de agua"
				content="¿Está seguro que desea pagar este recibo?"
				confirmText="Pagar"
			/>
		</>
	);
};

export default MeterInfoCard;
