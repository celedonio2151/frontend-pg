import React, { useEffect, useState } from "react";
// @mui material components
import {
	Box,
	IconButton,
	Card,
	Grid,
	FormControl,
	InputLabel,
	InputAdornment,
	OutlinedInput,
	TextField,
	Autocomplete,
	FormHelperText,
} from "@mui/material";

// MUI X components
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

// MUI ICONS
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import useFetch from "hooks/useFetch";
import MDButton from "components/MDButton";
import useFetchEvent from "hooks/useFetchEvent";
import { formateDate } from "helpers/formatDate";
import usePost from "hooks/usePost";
import { NavLink } from "react-router-dom";
import MDAlert from "components/MDAlert";
import { Description } from "@mui/icons-material";

export default function RegisterFormMR({ token, setNewMeter }) {
	const [dateTime, setDateTime] = useState(dayjs(new Date())); // Select date and time
	const [lastMonth, setLastMonth] = useState(null); // Last record
	const [userValue, setUserValue] = useState(null); // Autocomplete value MUI
	const [inputValue, setInputValue] = useState(""); // Autocomplete input MUI
	const [options, setOptions] = useState([]); // Options to select waterMeters users
	const [disabledBalance, setDisabledBalance] = useState(true);
	const [balance, setBalance] = useState(0); // Balance to pay
	const [responseSubmit, setResponseSubmit] = useState(null);
	const [errorSubmit, setErrorSubmit] = useState(null);
	const [dataMeters, loadingUsers, errorUsers, handleCancelUsers] = useFetch(
		`/meter?status=true`,
		null,
		token
	);
	const postRequest = usePost(`/reading`, token);
	// Procesa los datos para mostrar en el select
	useEffect(() => {
		if (dataMeters?.length > 0) {
			setOptions(() =>
				dataMeters.map((meter) => ({
					label: meter.fullname,
					ci: meter.ci,
					waterMeterId: meter._id,
				}))
			);
		}
	}, [dataMeters]);
	// Limpia el error despues de 3s
	useEffect(() => {
		if (errorSubmit) {
			const timer = setTimeout(() => {
				setErrorSubmit(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [errorSubmit]);
	// Buscar lecturas -> La ultima lectura por el waterMeterId
	const handleFetchLastMonth = (meter) => {
		if (meter?.waterMeterId) {
			useFetchEvent(`/reading/${meter.waterMeterId}`, token)
				.then((response) => {
					// console.log("LastMonth :", response);
					setLastMonth(response); // Set last month
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {});
		}
	};
	// ==========	Calcula el saldo a pagar por la cantidad de m3 consumidos
	const handleCalculateBalance = (e) => {
		const cubic =
			e.target.value -
			(lastMonth?.lastMonth?.meterValue ? lastMonth.lastMonth.meterValue : 0);
		useFetchEvent(`/billing/calculate-balance/${cubic}`, token)
			.then((response) => {
				// console.log("Cal. balance: ", cubic, response);
				setBalance(response); // Set balance
			})
			.catch((err) => {
				console.log(err);
			})
			.finally();
	};
	// ==========	Envia para registrar la lectura
	function handleOnSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		e.currentTarget.reset();
		console.log(e.currentTarget);
		formData.append("waterMeterId", userValue.waterMeterId);
		formData.append("date", dateTime);
		formData.append(
			"beforeMonth",
			JSON.stringify({
				date: lastMonth ? lastMonth?.lastMonth.date : dateTime,
				meterValue: lastMonth ? lastMonth?.lastMonth.meterValue : 0,
			})
		);
		formData.append("balance", balance);
		const body = {
			waterMeterId: formData.get("waterMeterId"),
			date: formData.get("date"),
			beforeMonth: formData.get("beforeMonth"),
			lastMonth: formData.get("lastMonthValue"),
			balance: formData.get("balance"),
			Description: formData.get("description"),
		};
		// console.log(body);
		// alertContent("primary");
		postRequest(formData)
			.then((response) => {
				console.log("Se registro la lecturas correctamente: ", response);
				setResponseSubmit("Se registro la lectura correctamente");
				// setNewMeter(false);
				setBalance(0);
				setUserValue(null);
				setLastMonth(null);
			})
			.catch((err) => {
				console.log(err);
				setErrorSubmit(err.message);
			})
			.finally(() => {});
	}
	// Alertas
	const alertContent = (color, response) => (
		<MDAlert color={color} dismissible>
			<MDTypography variant="body2" color="white">
				<MDTypography
					component="a"
					href="#"
					variant="body2"
					fontWeight="medium"
					color="white"
				>
					{response}
				</MDTypography>
			</MDTypography>
		</MDAlert>
	);

	return (
		<>
			<MDBox mx={2} mb={4}>
				{responseSubmit && alertContent("success", responseSubmit)}
			</MDBox>
			<Card sx={{ marginBottom: 3, width: 1 }}>
				{/* <MDBox>
				<MDButton variant="gradient" color="error">
					<a href="#target-table">Ver tabla</a>
				</MDButton>
			</MDBox> */}
				<MDBox
					variant="gradient"
					bgColor="primary"
					borderRadius="lg"
					coloredShadow="primary"
					mx={2}
					mt={-3}
					p={3}
					mb={1}
					textAlign="center"
				>
					<MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
						Registrando una nueva lectura del medidor
					</MDTypography>
				</MDBox>
				<MDBox pt={4} pb={3} px={3}>
					<MDBox
						component="form"
						// noValidate
						onSubmit={handleOnSubmit}
						role="form"
					>
						<MDBox mb={2}>
							{options ? (
								<Autocomplete
									value={userValue}
									onChange={(event, newValue) => {
										setUserValue(newValue);
										handleFetchLastMonth(newValue);
										// handleRequestUser(newValue);
									}}
									inputValue={inputValue}
									onInputChange={(event, newInputValue) => {
										setInputValue(newInputValue);
									}}
									id="controllable-states-demo"
									options={options}
									sx={{ width: 1, p: 0 }}
									renderInput={(params) => (
										<TextField required {...params} label="Usuarios" />
									)}
								/>
							) : (
								<MDBox>Cargando usuarios</MDBox>
							)}
						</MDBox>
						{/* =====	Lectura Anterior */}
						<MDBox mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-before-month">
									Lectura Anterior
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-before-month"
									type="text"
									// name="beforeMonth"
									disabled
									value={
										lastMonth
											? `${formateDate(
													lastMonth?.lastMonth.date,
													"DD/MM/YYYY"
											  )}				Lectura: ${lastMonth?.lastMonth.meterValue}`
											: ""
									}
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle name" edge="end">
												<PaidRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Lectura Anterior"
								/>
							</FormControl>
						</MDBox>
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
									name="lastMonthValue"
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle name" edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Lectura Actual"
									onChange={handleCalculateBalance}
								/>
								{errorSubmit && (
									<FormHelperText
										id="component-error-text"
										sx={{ color: "red" }}
									>
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
									// name="balance"
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
						{!disabledBalance && (
							<MDBox mb={2}>
								<TextField
									fullWidth
									variant="outlined"
									id="standard-multiline-flexible"
									name="description"
									required
									label="Descripcion por alterar el precio"
									multiline
									rows={2}
								/>
							</MDBox>
						)}
						<MDBox mt={4} mb={1}>
							<MDButton
								variant="gradient"
								color="primary"
								type="submit"
								// disabled={loading}
								size="large"
								fullWidth
							>
								Registrar lectura
							</MDButton>
						</MDBox>
					</MDBox>
				</MDBox>
			</Card>
		</>
	);
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const optionss = [{ label: "The Shawshank Redemption", year: 1994 }];
