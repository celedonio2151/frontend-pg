import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React from "react";

// MUI Icons
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import MDChip from "./MDChip";
import { months } from "dayjs/locale/es";

// Obtener el estado del mes en base a la lectura
const getMonthStatus = (readings, monthIndex) => {
	// Encontrar la lectura del mes
	const reading = readings.find(
		(r) => new Date(r.date).getMonth() === monthIndex
	);

	if (!reading) {
		return (
			<MDChip
				label={"Sin lectura"}
				icon={<SpeedRoundedIcon />}
				color={"error"}
			/>
		); // No hay lectura para este mes
	}

	if (!reading.invoice) {
		return (
			<MDChip
				label={"Sin recibo"}
				icon={<CommentsDisabledRoundedIcon />}
				color={"secondary"}
			/>
		); // No hay invoice
	}

	if (!reading.invoice.isPaid) {
		return (
			<MDChip
				label={"Sin pagar"}
				icon={<MoneyOffRoundedIcon />}
				color={"warning"}
			/>
		); // No está pagado
	}

	return (
		<MDChip
			label={"Cancelado"}
			icon={<PriceCheckRoundedIcon />}
			color={"success"}
		/>
	); // Todo está correcto
};

export default function PaymentTable({ reports }) {
	// console.log("🚀 ~ PaymentTable ~ reports:", reports);
	return (
		<TableContainer>
			<Table stickyHeader sx={{ width: "100%", textAlign: "left" }}>
				<thead>
					<TableRow>
						<TableCell>Nº</TableCell>
						<TableCell>Nombre</TableCell>
						<TableCell>CI</TableCell>
						<TableCell>Meter Number</TableCell>
						<TableCell>Enero</TableCell>
						<TableCell>Febrero</TableCell>
						<TableCell>Marzo</TableCell>
						<TableCell>Abril</TableCell>
						<TableCell>Mayo</TableCell>
						<TableCell>Junio</TableCell>
						<TableCell>Julio</TableCell>
						<TableCell>Agosto</TableCell>
						<TableCell>Septiembre</TableCell>
						<TableCell>Octubre</TableCell>
						<TableCell>Noviembre</TableCell>
						<TableCell>Diciembre</TableCell>
					</TableRow>
				</thead>
				<TableBody>
					{reports.map((user, index) => (
						<TableRow hover key={index}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{user.fullname}</TableCell>
							<TableCell>{user.ci}</TableCell>
							<TableCell>{user.meterNumber}</TableCell>
							{months.map((_, monthIndex) => (
								<TableCell key={monthIndex}>
									{getMonthStatus(user.meterReadings, monthIndex)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
