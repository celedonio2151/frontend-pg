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

// react-router-dom components
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import {
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from "@mui/material";
// Icons from Material UI
import { Visibility, VisibilityOff } from "@mui/icons-material";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import VpnKeyOffRoundedIcon from "@mui/icons-material/VpnKeyOffRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import GoogleIcon from "@mui/icons-material/Google";

import { formateDate } from "helpers/formatDate";
import { useAuthContext } from "context/AuthContext";
import usePost from "hooks/usePost";
import type { User, UserLogin } from "interfaces/Profile.interface";
// import { UserContext } from "context";

export default function Cover() {
	const [showPassword, setShowPassword] = useState(false);
	const [showCodeAdmin, setShowCodeAdmin] = useState(false);
	const { setToken, setRefreshToken, setProfile } = useAuthContext();
	const { post, loading, error } = usePost();
	const navigate = useNavigate();
	// SnackBar
	const [successSB, setSuccessSB] = useState(false);
	const [errorSB, setErrorSB] = useState(false);
	const [textAlert, setTextAlert] = useState("");

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const signInWithGoogle = () => {
		console.log("Sign in with google");
		window.open(`${""}/auth/google`, "_self");
	};

	const handleMouseDownPassword = (event: any) => {
		event.preventDefault();
	};

	// Handler Snackbars
	const openSuccessSB = (content: string) => {
		setSuccessSB(true);
		setTextAlert(content);
	};
	const closeSuccessSB = () => setSuccessSB(false);
	const openErrorSB = (content: string) => {
		setErrorSB(true);
		setTextAlert(content);
	};
	const closeErrorSB = () => setErrorSB(false);

	// console.log(textAlert);

	const renderSuccessSB = (
		<MDSnackbar
			color="success"
			icon={<CheckRoundedIcon color="white" />}
			title="Material Dashboard"
			content={textAlert}
			dateTime={formateDate(new Date(), "ddd DD MMM YYYY")}
			open={successSB}
			onClose={closeSuccessSB}
			close={closeSuccessSB}
			// bgWhite
		/>
	);

	const renderErrorSB = (
		<MDSnackbar
			color="error"
			icon={<WarningRoundedIcon color="white" />}
			title="Material Dashboard"
			content={textAlert}
			dateTime="11 mins ago"
			open={errorSB}
			onClose={closeErrorSB}
			close={closeErrorSB}
			// bgWhite
		/>
	);

	const handleOnSubmit = (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		// data.append("profileImg", null);
		data.append("roles", "ADMIN");
		data.append("status", true);
		if (!data.get("meter_number")) {
			data.delete("meter_number");
		}
		if (data.get("password") === data.get("password-repeated")) {
			alert("Las contraseñas no coinciden");
		}
		const body = {
			ci: data.get("ci"),
			name: data.get("name"),
			surname: data.get("surname"),
			password: data.get("password"),
			phone_number: data.get("phone_number"),
			meter_number: data.get("meter_number"),
			roles: data.get("roles"),
			status: data.get("status"),
			email: data.get("email"),
			codeAdmin: data.get("codeAdmin"),
		};
		// console.log("Sendign to server..", body);
		post(`/auth/admin/signup`, {})
			.then((response) => {
				openSuccessSB(response.message);
				setToken(response.token);
				setProfile(response.newUser);
				// console.log(response);
				navigate(`/users`);
			})
			.catch((err) => {
				openErrorSB(err.message);
			})
			.finally(() => {});
	};
	return (
		<CoverLayout image={bgImage}>
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
					<MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
						Agua Potable Mosoj Llajta
						{/* <span color=""> Administrador</span> */}
					</MDTypography>
					{/* <MDTypography display="block" variant="button" color="white" my={1}>
						Un nuevo usuario debe ser aprobado por el comite de agua de Mosoj
						Llajta
					</MDTypography> */}
					<Grid item xs={12}>
						<MDButton
							color="inherit"
							size="small"
							fullWidth
							onClick={() => signInWithGoogle()}
						>
							<GoogleIcon />
						</MDButton>
					</Grid>
				</MDBox>
				<MDBox pt={4} pb={3} px={3}>
					<MDBox
						component="form"
						// noValidate
						onSubmit={handleOnSubmit}
						role="form"
					>
						<MDBox mb={2}>
							<MDInput
								type="number"
								label="Carnet identidad"
								name="ci"
								required
								fullWidth
							/>
						</MDBox>
						<MDBox mb={2}>
							<MDInput
								type="text"
								label="Nombre Completo"
								required
								name="name"
								fullWidth
							/>
						</MDBox>
						<MDBox mb={2}>
							<MDInput
								type="text"
								label="Apellidos"
								required
								name="surname"
								fullWidth
							/>
						</MDBox>
						<MDBox mb={2}>
							<MDInput
								type="email"
								label="Gmail"
								name="email"
								required
								fullWidth
							/>
						</MDBox>
						{/* <MDBox mb={2}>
							<MDInput
								type="number"
								label="Número de medidor"
								name="meter_number"
								// required
								fullWidth
							/>
						</MDBox> */}
						<MDBox mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password">
									Contraseña
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password"
									type={showPassword ? "text" : "password"}
									name="password"
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Password"
								/>
							</FormControl>
						</MDBox>
						<MDBox mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password-repeat">
									Repita la contraseña
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password-repeat"
									type={showPassword ? "text" : "password"}
									name="passwordRepeated"
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Repita la contraseña"
								/>
							</FormControl>
						</MDBox>
						<MDBox
							mb={2}
							sx={{ display: "flex", justifyContent: "space-between" }}
						>
							<FormControl fullWidth variant="outlined" sx={{ width: "45%" }}>
								<InputLabel htmlFor="outlined-adornment-code-admin">
									Cod. admin
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-code-admin"
									type={showCodeAdmin ? "text" : "password"}
									name="codeAdmin"
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={(e) => setShowCodeAdmin(!showCodeAdmin)}
												edge="end"
											>
												{showCodeAdmin ? (
													<VpnKeyOffRoundedIcon />
												) : (
													<VpnKeyRoundedIcon />
												)}
											</IconButton>
										</InputAdornment>
									}
									label="Cod. admin"
								/>
							</FormControl>
							{/* <MDBox mb={2}> */}
							<MDInput
								sx={{ width: "50%" }}
								type="number"
								label="Número de celular"
								name="phone_number"
								required
								fullWidth
							/>
							{/* </MDBox> */}
						</MDBox>
						{/* <MDBox display="flex" alignItems="center" ml={-1}>
							<Checkbox />
							<MDTypography
								variant="button"
								fontWeight="regular"
								color="text"
								sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
							>
								&nbsp;&nbsp;I agree the&nbsp;
							</MDTypography>
							<MDTypography
								component="a"
								href="#"
								variant="button"
								fontWeight="bold"
								color="info"
								textGradient
							>
								Terms and Conditions
							</MDTypography>
						</MDBox> */}
						<MDBox mt={3} mb={1}>
							<MDButton
								type="submit"
								variant="gradient"
								color="info"
								size="large"
								disabled={loading}
								fullWidth
							>
								Registrar usuario
							</MDButton>
						</MDBox>
						<MDBox mt={2} mb={1} textAlign="center">
							<MDTypography variant="button" color="text">
								Ya tienes una cuenta?{" "}
								<MDTypography
									component={Link}
									to="/authentication/sign-in"
									variant="button"
									color="info"
									fontWeight="medium"
									textGradient
								>
									Iniciar sessión
								</MDTypography>
							</MDTypography>
						</MDBox>
					</MDBox>
				</MDBox>
			</Card>
			<MDBox>
				{renderSuccessSB}
				{renderErrorSB}
			</MDBox>
		</CoverLayout>
	);
}

// Manejar error si el servidor no responde
