import React from "react";
import {
	Button,
	IconButton,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

// MUI Icons
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import MoneyOffRoundedIcon from "@mui/icons-material/MoneyOffRounded";

import MDChip from "./MDChip";

export default function ReportAnnualTable({ data }) {
	const months = [0,1,2,3,4,5,6,7,8,9,10,11]
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 700 }} aria-label="customized table">
				<thead>
					<StyledTableRow
						sx={{
							borderBottom: "5px solid white",
							backgroundColor: "red",
						}}
					>
						<TableCell>Nº</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  width={250}>Nombre</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">CI</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Nº medidor</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Enero</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Febrero</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Marzo</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Abril</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Mayo</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Junio</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Julio</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Agosto</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Septiembre</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Octubre</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Noviembre</TableCell>
						<TableCell sx={{fontWeight:"bold"}}  align="center">Diciembre</TableCell>
					</StyledTableRow>
				</thead>
				<TableBody>
					{data &&
						data.map((user, i) => (
							<StyledTableRow hover key={user._id}>
								<StyledTableCell component="th" scope="row">
									{i + 1}
								</StyledTableCell>
								<StyledTableCell>{user.fullname}</StyledTableCell>
								<StyledTableCell>{user.ci}</StyledTableCell>
								<StyledTableCell>{user.meterNumber}</StyledTableCell>
								{user.meterReadings.map((reading, i) => (
											<StyledTableCell key={reading._id + "12d"}>
												{
												reading?.invoice ? (
													reading?.invoice?.isPaid ? (
														<MDChip
															label={"Cancelado"}
															icon={<PriceCheckRoundedIcon />}
															color={"success"}
														/>
													) : (
														<MDChip
															label={"Sin cancelar"}
															icon={<PriceCheckRoundedIcon />}
															color={"warning"}
														/>
													)
												) : (
													<MDChip
														label={"Sin recibo"}
														icon={<PriceCheckRoundedIcon />}
														color={"error"}
													/>
												)
												}
											</StyledTableCell> 
								))}
							</StyledTableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
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
