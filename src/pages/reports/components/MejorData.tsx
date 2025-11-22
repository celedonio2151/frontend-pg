import { useState } from "react";
import {
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableRow,
	Box,
} from "@mui/material";

// MUI Icons
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import MDChip from "./MDChip";
import MDInput from "components/MDInput";
import type {
	MeterReading,
	Reading,
} from "pages/reports/interfaces/reports.annual.interface";

type Props = {
	readings: Reading[];
};

// Obtener el estado del mes en base a la lectura
const getMonthStatus = (readings: MeterReading[], monthIndex: number) => {
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
				variant="outlined"
			/>
		); // No hay lectura para este mes
	}

	if (!reading.invoice) {
		return (
			<MDChip
				label={"Sin recibo"}
				icon={<CommentsDisabledRoundedIcon />}
				color={"secondary"}
				variant="filled"
			/>
		); // No hay invoice
	}

	if (!reading.invoice.isPaid) {
		return (
			<MDChip
				label={"Sin pagar"}
				icon={<MoneyOffRoundedIcon />}
				color={"warning"}
				variant="filled"
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

export default function PaymentTable({ readings }: Props) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const filteredReadings = readings.filter((meter) => {
		const searchTerm = searchQuery.toLowerCase();
		return (
			meter.user.name.toLowerCase().includes(searchTerm) ||
			meter.user.surname.toLowerCase().includes(searchTerm) ||
			(meter.user.ci &&
				meter.user.ci.toString().toLowerCase().includes(searchTerm)) ||
			meter.meter_number.toString().toLowerCase().includes(searchTerm)
		);
	});

	return (
		<Box>
			<Box my={3} mx={2}>
				<MDInput
					label="Buscar por nombre, apellido, CI o medidor"
					value={searchQuery}
					onChange={handleSearchChange}
					fullWidth
				/>
			</Box>
			<TableContainer>
				<Table stickyHeader sx={{ width: "100%", textAlign: "left" }}>
					<thead>
						<StyledTableRow>
							<TableCell sx={{ fontWeight: "bold" }}>Nº</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Apellidos</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>CI</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Meter Number</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Enero</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Febrero</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Marzo</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Abril</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Mayo</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Junio</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Julio</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Agosto</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Septiembre</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Octubre</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Noviembre</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>Diciembre</TableCell>
						</StyledTableRow>
					</thead>
					<TableBody sx={{ pt: 2 }}>
						{filteredReadings.map((meter, index) => (
							<StyledTableRow hover key={index}>
								<StyledTableCell>{index + 1}</StyledTableCell>
								<StyledTableCell>{meter.user.name}</StyledTableCell>
								<StyledTableCell>{meter.user.surname}</StyledTableCell>
								<StyledTableCell>{meter.user.ci}</StyledTableCell>
								<StyledTableCell>{meter.meter_number}</StyledTableCell>
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
									(_, monthIndex) => (
										<StyledTableCell key={monthIndex}>
											{getMonthStatus(meter.meterReadings, monthIndex)}
										</StyledTableCell>
									)
								)}
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));
