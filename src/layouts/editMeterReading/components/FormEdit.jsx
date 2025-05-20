import React, { useState } from "react";
// MUI Components
import {
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
// MUI ICONS
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import dayjs from "dayjs";
// Local components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

export default function FormEdit({
	data,
	dateTime,
	setDateTime,
	lastMonthValue,
	setLastMonthValue,
	description,
	setDescription,
	disabledBalance,
	setDisabledBalance,
	balance,
	setBalance,
	loadingForm,
	setLoadingForm,
	responseSubmit,
	setResponseSubmit,
	errorSubmit,
	setErrorSubmit,
	handleOnSubmit,
}) {
	return (
		<MDBox pt={4} pb={3} px={3}>
			<MDBox
				component="form"
				// noValidate
				onSubmit={handleOnSubmit}
				role="form"
			>
				{/* =====	Ingresar campo fecha	===== */}
				<MDBox mb={2}>
					<DemoItem label="Fecha de lectura">
						<MobileDateTimePicker
							defaultValue={dayjs("2022-04-17T15:30")}
							format="DD/MM/YYYY HH:mm"
							value={dateTime}
							onChange={(newValue) => setDateTime(newValue)}
						/>
					</DemoItem>
				</MDBox>
				{/* =====	Ingresar campo Lectura Actual	===== */}
				<MDBox mb={2}>
					<FormControl fullWidth variant="outlined">
						<InputLabel htmlFor="outlined-adornment_name">
							Lectura Actual
						</InputLabel>
						<OutlinedInput
							id="outlined-adornment-name"
							type="number"
							// name="lastMonthValue"
							value={lastMonthValue}
							// defaultValue={data.lastMonth.meterValue}
							onChange={(e) => setLastMonthValue(e.target.value)}
							required
							endAdornment={
								<InputAdornment position="end">
									<IconButton aria-label="toggle name" edge="end">
										<SpeedRoundedIcon />
									</IconButton>
								</InputAdornment>
							}
							label="Lectura Actual"
						/>
						{errorSubmit && (
							<FormHelperText id="component-error-text" sx={{ color: "red" }}>
								{errorSubmit}
							</FormHelperText>
						)}
					</FormControl>
				</MDBox>
				{/* =====	Ingresar campo Balance | opcional editar	===== */}
				<MDBox mb={2}>
					<FormControl fullWidth variant="outlined">
						<InputLabel htmlFor="outlined-adornment_name">Saldo</InputLabel>
						<OutlinedInput
							id="outlined-adornment-name"
							type="number"
							value={balance}
							min={1}
							onChange={(e) => setBalance(e.target.value)}
							required
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle name"
										edge="end"
										onClick={() => setDisabledBalance(!disabledBalance)}
									>
										<PaidRoundedIcon />
									</IconButton>
								</InputAdornment>
							}
							disabled={disabledBalance}
							label="Saldo"
						/>
					</FormControl>
				</MDBox>
				<MDBox mb={2}>
					<TextField
						fullWidth
						variant="outlined"
						id="standard-multiline-flexible"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						label="Descripcion por alterar el precio"
						placeholder="Descripcion por alterar el precio u otros"
						// multiline
						rows={2}
					/>
				</MDBox>
				<MDBox mt={4} mb={1}>
					<MDButton
						variant="gradient"
						color="primary"
						type="submit"
						disabled={loadingForm}
						size="large"
						fullWidth
					>
						Editar lectura
					</MDButton>
				</MDBox>
			</MDBox>
		</MDBox>
	);
}
