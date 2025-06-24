/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	OutlinedInput,
} from "@mui/material";

// @mui icons
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

import handlerErrors from "helpers/handlerErrors";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import usePost from "hooks/usePost";
import type { User } from "pages/users/interfaces/user.interface";

export default function RegisterUserPage() {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { token } = useAuthContext();
	const { post, loading, error } = usePost<User>();

	// const postRequest = usePost(`/auth/signup`, token);
	// console.log("register : ", token);

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		console.log("onSubmit");
		const data = new FormData(e.currentTarget);
		data.append("password", 11111111);
		data.append("birthdate", "2000-01-01");
		data.append("roles", "USER");
		data.append("status", true);
		if (!data.get("phone_number")) {
			data.delete("phone_number");
		}
		if (!data.get("meter_number")) {
			data.delete("meter_number");
		}
		const body = {
			ci: data.get("ci"),
			name: data.get("name"),
			surname: data.get("surname"),
			meter_number: data.get("meter_number"),
			phone_number: data.get("phone_number"),
		};
		try {
			const res = await post("/auth/signup", body, token);
			if (res) {
				enqueueSnackbar("Usuario registrado correctamente", {
					variant: "success",
				});
				navigate("/users");
			}
		} catch (err) {
			const errorMessage = handlerErrors(err || error);
			console.error("Error al registrar usuario:", errorMessage);
			if (error) {
				enqueueSnackbar(errorMessage, { variant: "error" });
			}
		}
	};

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox mb={2} />
			<MDBox
				width="calc(100% - 2rem)"
				minHeight={"35vh"}
				borderRadius="xl"
				mx={2}
				my={2}
				pt={6}
				pb={28}
				sx={{
					backgroundImage: ({
						functions: { linearGradient, rgba },
						palette: { gradients },
					}) =>
						bgImage &&
						`${linearGradient(
							rgba(gradients.dark.main, 0.4),
							rgba(gradients.dark.state, 0.4)
						)}, url(${bgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			/>
			<MDBox
				mt={{ xs: -20, lg: -18 }}
				px={1}
				width="calc(100% - 2rem)"
				mx="auto"
			>
				<Grid container spacing={1} justifyContent="center">
					<Grid item sm={6}>
						<Card sx={{ marginBottom: 3 }}>
							<MDBox
								variant="gradient"
								bgColor="info"
								borderRadius="lg"
								coloredShadow="success"
								mx={2}
								mt={-3}
								p={3}
								mb={1}
								textAlign="center"
							>
								<MDTypography
									variant="h4"
									fontWeight="medium"
									color="white"
									mt={1}
								>
									Registrar nuevo usuario
								</MDTypography>
								<MDTypography
									display="block"
									variant="button"
									color="white"
									my={1}
								>
									Un nuevo usuario debe ser aprobado por el comite de agua de
									Mosoj Llajta
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
										<FormControl fullWidth variant="outlined">
											<InputLabel htmlFor="outlined-adornment-ci">
												CI
											</InputLabel>
											<OutlinedInput
												id="outlined-adornment-ci"
												type="number"
												name="ci"
												required
												endAdornment={
													<InputAdornment position="end">
														<IconButton aria-label="toggle ci" edge="end">
															<ContactEmergencyRoundedIcon />
														</IconButton>
													</InputAdornment>
												}
												label="ci"
											/>
										</FormControl>
									</MDBox>
									<MDBox mb={2}>
										<FormControl fullWidth variant="outlined">
											<InputLabel htmlFor="outlined-adornment_name">
												Nombre
											</InputLabel>
											<OutlinedInput
												id="outlined-adornment-name"
												type="text"
												name="name"
												required
												endAdornment={
													<InputAdornment position="end">
														<IconButton aria-label="toggle name" edge="end">
															<AccountCircleRoundedIcon />
														</IconButton>
													</InputAdornment>
												}
												label="Nombre"
											/>
										</FormControl>
									</MDBox>
									<MDBox mb={2}>
										<FormControl fullWidth variant="outlined">
											<InputLabel htmlFor="outlined-surname">
												Apellidos
											</InputLabel>
											<OutlinedInput
												id="outlined-adornment-surname"
												type="text"
												name="surname"
												required
												endAdornment={
													<InputAdornment position="end">
														<IconButton aria-label="toggle surname" edge="end">
															<ContactEmergencyRoundedIcon />
														</IconButton>
													</InputAdornment>
												}
												label="Apellido"
											/>
										</FormControl>
									</MDBox>
									<MDBox mb={2}>
										<FormControl fullWidth variant="outlined">
											<InputLabel htmlFor="outlined-meter_number">
												Número del Medidor
											</InputLabel>
											<OutlinedInput
												id="outlined-meter_number"
												type="number"
												name="meter_number"
												// required
												min="9999"
												endAdornment={
													<InputAdornment position="end">
														<IconButton aria-label="toggle ci" edge="end">
															<SpeedRoundedIcon />
														</IconButton>
													</InputAdornment>
												}
												label="Número del Medidor"
											/>
										</FormControl>
									</MDBox>
									<MDBox mb={2}>
										<FormControl fullWidth variant="outlined">
											<InputLabel htmlFor="outlined-meter_number">
												Celular
											</InputLabel>
											<OutlinedInput
												id="outlined-celular"
												type="number"
												name="phone_number"
												min="9999999"
												endAdornment={
													<InputAdornment position="end">
														<IconButton aria-label="toggle ci" edge="end">
															<PhoneEnabledRoundedIcon />
														</IconButton>
													</InputAdornment>
												}
												label="Celular"
											/>
										</FormControl>
									</MDBox>
									<Box mt={4} mb={1}>
										<MDButton
											variant="gradient"
											color="info"
											type="submit"
											disabled={loading}
											size="large"
											fullWidth
										>
											Registrar usuario
										</MDButton>
									</Box>
								</MDBox>
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
			{/* <Header></Header> */}
			<Footer />
		</DashboardLayout>
	);
}
