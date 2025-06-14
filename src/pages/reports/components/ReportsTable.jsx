import React from "react";
// MUI Components
import {
	Chip,
	Divider,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from "@mui/material";
// Creative Tim components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// MUI Icons
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import MDChip from "./MDChip";

export default function ReportsTable({ data }) {
	const paidReadings = data.meterReadings.filter(
		(reading) => reading.invoice?.isPaid
	);
	const unpaidReadings = data.meterReadings.filter(
		(reading) => !reading.invoice?.isPaid
	);

	const totalPaid = paidReadings.reduce(
		(sum, reading) => sum + reading.invoice?.amountDue || 0,
		0
	);
	const totalUnpaid = unpaidReadings.reduce(
		(sum, reading) => sum + reading.invoice?.amountDue || 0,
		0
	);
	return (
		<TableContainer component={Paper} sx={{ p: 2 }}>
			<MDBox className="balance-summary">
				<MDTypography
					component="h2"
					variant="h5"
					color="success"
					className="paid"
				>
					Pagado: {totalPaid.toFixed(2)}Bs.
				</MDTypography>
				<Divider sx={{ width: "60%" }} />
				<MDTypography variant="h5" color="error">
					Sin pagar: {totalUnpaid.toFixed(2)}Bs.
				</MDTypography>
			</MDBox>
			<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
				<thead
					style={{
						backgroundColor: "skyblue",
						padding: "10px",
					}}
				>
					<TableRow sx={{}}>
						<TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Numero de Medidor</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Saldo Pendiente</TableCell>
						<TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
					</TableRow>
				</thead>
				<TableBody>
					{paidReadings.map((reading) => (
						<TableRow hover key={reading._id} className="paid-row">
							<TableCell>{reading.waterMeter.fullname}</TableCell>
							<TableCell>{reading.waterMeter.meterNumber}</TableCell>
							<TableCell>{reading.invoice?.amountDue.toFixed(2)}Bs.</TableCell>
							<TableCell>
								<MDChip
									label={"Cancelado"}
									icon={<PriceCheckRoundedIcon />}
									color={"success"}
								/>
							</TableCell>
						</TableRow>
					))}
					{unpaidReadings.map((reading) => (
						<TableRow hover key={reading._id} className="unpaid-row">
							<TableCell>{reading.waterMeter.fullname}</TableCell>
							<TableCell>{reading.waterMeter.meterNumber}</TableCell>
							<TableCell>
								{reading.invoice?.amountDue ? (
									`${reading.invoice?.amountDue.toFixed(2)}Bs.`
								) : (
									<MDChip
										label={"Sin recibo"}
										icon={<CommentsDisabledRoundedIcon />}
										color={"error"}
									/>
								)}
							</TableCell>
							<TableCell>
								{reading.invoice?.amountDue ? (
									<MDChip
										label={"Sin pagar"}
										icon={<MoneyOffRoundedIcon />}
										color={"warning"}
									/>
								) : (
									<MDChip
										label={"Sin recibo"}
										icon={<CommentsDisabledRoundedIcon />}
										color={"error"}
									/>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
