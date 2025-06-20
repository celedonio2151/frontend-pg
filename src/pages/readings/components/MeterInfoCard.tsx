import { type FC } from "react";
import { Box, Card, Typography } from "@mui/material";

// Icons
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

// MD Components
import MDBox from "components/MDBox";
import type { WaterMeter } from "pages/meters/interfaces/meter.interface";
import type { Reading } from "pages/readings/interfaces/meterReading.interface";
import { formateDate } from "helpers/formatDate";

// Types
interface MeterInfoCardProps {
	title: string;
	meter: WaterMeter;
	reading: Reading;
}

const MeterInfoCard: FC<MeterInfoCardProps> = ({ title, meter, reading }) => {
	const renderItem = (
		label: string,
		value: string | number | boolean,
		icon: React.ReactNode
	) => (
		<MDBox key={label} display="flex" alignItems="center" py={0.5}>
			<Box mr={1}>{icon}</Box>
			<Typography variant="button" fontWeight="bold">
				{label}: &nbsp;
			</Typography>
			<Typography variant="button" fontWeight="regular" color="text">
				{String(value)}
			</Typography>
		</MDBox>
	);

	return (
		<Card sx={{ width: "100%", maxWidth: 500, margin: "0 auto", mb: 4 }}>
			<Typography variant="h6" fontWeight="medium" textAlign={"center"} py={1}>
				{title}
			</Typography>
			<Box px={2}>
				{renderItem(
					"Nombre",
					`${meter.name} ${meter.surname}`,
					<AccountCircleRoundedIcon />
				)}
				{renderItem("CI", meter.ci, <ContactEmergencyRoundedIcon />)}
				{renderItem("Nº Medidor", meter.meter_number, <SpeedRoundedIcon />)}
				{renderItem(
					"Fecha de lectura",
					formateDate(reading.date),
					<CalendarMonthRoundedIcon />
				)}
				{renderItem(
					"Consumo m³",
					reading.cubicMeters,
					<WaterDropRoundedIcon />
				)}
				{renderItem(
					"Saldo",
					reading.balance + " Bs",
					<MonetizationOnRoundedIcon />
				)}
				{renderItem(
					"Estado",
					meter.status ? "Activo" : "Inactivo",
					meter.status ? <VerifiedUserRoundedIcon /> : <GppBadRoundedIcon />
				)}
			</Box>
		</Card>
	);
};

export default MeterInfoCard;
