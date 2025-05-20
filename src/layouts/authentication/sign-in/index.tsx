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

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import GoogleIcon from "@mui/icons-material/Google";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Icons
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	setRef,
} from "@mui/material";
import usePost from "hooks/usePost";
import MDSnackbar from "components/MDSnackbar";

import { useAuthContext } from "context/AuthContext";
import type { UserLogin } from "interfaces/Profile.interface";

function Basic() {
	const [showPassword, setShowPassword] = useState(false);
	// SnackBar
	const [successSB, setSuccessSB] = useState(false);
	const [errorSB, setErrorSB] = useState(false);
	const [textAlert, setTextAlert] = useState("");

	const { post, loading, error } = usePost<UserLogin>();
	const { setToken, setProfile, setRefreshToken } = useAuthContext();
	const navigate = useNavigate();

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const signInWithGoogle = () => {
		console.log("Iniciar sesión con Google");
		window.open(`${""}/auth/admin/google`, "_self");
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

	const renderSuccessSB = (
		<MDSnackbar
			color="success"
			icon={<CheckRoundedIcon color="action" />}
			title="Credenciales correctos"
			// content={"Hello, world! This is a notification message"}
			content={textAlert}
			dateTime={"Hace unos segundos"}
			open={successSB}
			onClose={closeSuccessSB}
			close={closeSuccessSB}
			// bgWhite
		/>
	);

	const renderErrorSB = (
		<MDSnackbar
			color="error"
			icon={<WarningRoundedIcon />}
			title="Error de sesión"
			// content="Hello, world! This is a notification message"
			content={textAlert}
			dateTime="Hace unos segundos"
			open={errorSB}
			onClose={closeErrorSB}
			close={closeErrorSB}
			// bgWhite
		/>
	);

	const handleOnSubmit = (e: any) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const body = {
			email: data.get("email"),
			password: data.get("password"),
		};
		// console.log("Sendign to server...", body);
		post(`/auth/admin/signin`, body)
			.then((response) => {
				if (response) {
					openSuccessSB(response.message);
					setTimeout(() => {
						console.log(response);
						setProfile(response.user);
						setRefreshToken(response.myTokens.refreshToken);
						setToken(response.myTokens.accessToken);
						navigate(`/users`);
					}, 1500);
				}
			})
			.catch((err: any) => {
				console.log(err);
				openErrorSB(err.message);
			})
			.finally();
	};

	return (
		<BasicLayout image={bgImage}>
			<Card sx={{ mt: "30%" }}>
				<MDBox
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="info"
					mx={2}
					mt={-3}
					p={2}
					mb={1}
					textAlign="center"
				>
					<Grid
						container
						spacing={3}
						justifyContent="center"
						sx={{ mt: 1, mb: 2 }}
						columns={12}
					>
						{/* <Grid item xs={12}>
							<MDTypography
								component={MuiLink}
								href="#"
								variant="body1"
								color="white"
							>
								ADMINISTRADOR
							</MDTypography>
						</Grid> */}
						<Grid item xs={12}>
							<MDTypography variant="h4" fontWeight="medium" color="white">
								Iniciar sessión
							</MDTypography>
						</Grid>
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
					</Grid>
				</MDBox>
				<MDBox pt={3} pb={3} px={3}>
					<MDBox
						component="form"
						// noValidate
						onSubmit={handleOnSubmit}
						role="form"
					>
						<MDBox mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password">
									Email
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-ci"
									type="text"
									name="email"
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												edge="end"
											>
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
						{/* <MDBox display="flex" alignItems="center" ml={-1}>
							<Switch checked={rememberMe} onChange={handleSetRememberMe} />
							<MDTypography
								variant="button"
								fontWeight="regular"
								color="text"
								onClick={handleSetRememberMe}
								sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
							>
								&nbsp;&nbsp;Remember me
							</MDTypography>
						</MDBox> */}
						<MDBox mt={4} mb={1}>
							<MDButton
								variant="gradient"
								// disabled ={}
								type="submit"
								color="info"
								fullWidth
								size="large"
								disabled={loading}
							>
								Iniciar sessión
							</MDButton>
						</MDBox>
						<MDBox mt={3} mb={1} textAlign="center">
							<MDTypography variant="button" color="text">
								No tienes una cuenta?&nbsp;
								<MDTypography
									component={Link}
									to="/authentication/sign-up"
									variant="button"
									color="info"
									fontWeight="medium"
									textGradient
								>
									Crea una cuenta
								</MDTypography>
							</MDTypography>
						</MDBox>
						<MDBox>
							{renderSuccessSB}
							{renderErrorSB}
						</MDBox>
					</MDBox>
				</MDBox>
			</Card>
		</BasicLayout>
	);
}

export default Basic;
