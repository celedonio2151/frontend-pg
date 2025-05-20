import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Divider,
	IconButton,
} from "@mui/material";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";

import MDAlert from "components/MDAlert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { formateDate } from "helpers/formatDate";
import usePost from "hooks/usePost";
import React, { useEffect, useRef, useState } from "react";
import MDButton from "components/MDButton";

export default function ViewQRBank({ readingId, token, setPayQR }) {
	const [dataBNB, setDataBNB] = useState(null); // data QR BNB
	const [loading, setLoading] = useState(false); // Loading QR
	const [error, setError] = useState(null); // Loading QR

	// UseEffect para ocultar el alert después de 3 segundos
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 5000);
			return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o si el error cambia
		}
	}, [error]);

	useEffect(() => {
		const postRequest = usePost(`/invoice/qr/${readingId}`, token);
		setLoading(true);
		postRequest()
			.then((response) => {
				console.log(response);
				setDataBNB(response);
			})
			.catch((err) => {
				console.log(err);
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCancelQR = () => {
		setPayQR(false);
		// Peticion al servidor para que cancele el QR generado
	};
	// Alertas
	const alertContent = (color, response) => (
		<MDAlert color={color} sx={{ mt: -3, mb: 4 }}>
			<MDTypography variant="body2" color="white">
				<MDTypography
					component="a"
					href="#"
					variant="body2"
					fontWeight="medium"
					color="white"
					sx={{ cursor: "pointer" }}
				>
					{response}
				</MDTypography>
			</MDTypography>
		</MDAlert>
	);

	return (
		<>
			{/* <MDBox mx={2} mb={4}> */}
			{error && alertContent("error", error.message)}
			{/* </MDBox> */}
			<Card sx={{ width: "100%" }}>
				<MDBox
					variant="gradient"
					bgColor="success"
					borderRadius="lg"
					coloredShadow="secondary"
					mx={2}
					mt={-3}
					p={3}
					mb={1}
					textAlign="center"
					// onClick={handleQRImageLoad}
				>
					<MDTypography
						variant="h4"
						fontWeight="medium"
						color="white"
						mt={1}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row",
						}}
					>
						<QrCode2RoundedIcon /> &nbsp;Codigo QR BNB
					</MDTypography>
				</MDBox>
				{dataBNB ? (
					<>
						<MDTypography
							variant="h3"
							sx={{ color: "#26b460", textAlign: "center", p: 1 }}
						>
							<span style={{ color: "#694780" }}>!Apunta, </span>
							escanea y paga!
						</MDTypography>
						<CardMedia
							component="img"
							// height="194"
							image={`data:image/png;base64,${dataBNB.bankBNB.qr}`}
							alt="Paella dish"
							sx={{
								backgroundColor: "#26b460",
								p: 0,
								m: 1,
								border: "1px solid #694780",
							}}
						/>
						{/* <Divider orientation="horizontal" flexItem /> */}
						<CardContent>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<MDTypography component="h3" variant="body2">
									<strong>Monto:</strong> {dataBNB.aditional.amount}
									{dataBNB.aditional.currency === "BOB"
										? "Bs."
										: dataBNB.aditional.currency}
								</MDTypography>
								<MDTypography component="h3" variant="body2">
									<strong>Uso Unico: </strong>{" "}
									{dataBNB.aditional.singleUse ? "SI" : "NO"}
								</MDTypography>
							</Box>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<MDTypography variant="body2">
									<strong>Expira: </strong>
								</MDTypography>
								<MDTypography variant="body2">
									{formateDate(
										dataBNB.aditional.expirationDate,
										"dddd DD MMMM YYYY HH:mm:ss"
									)}
								</MDTypography>
							</Box>
						</CardContent>
						<MDButton
							color="error"
							sx={{ mx: 1, mb: 1 }}
							onClick={handleCancelQR}
						>
							Cancelar
						</MDButton>
					</>
				) : (
					loading && (
						<MDBox
							variant="gradient"
							borderRadius="lg"
							mx={2}
							mt={2}
							mb={1}
							textAlign="center"
						>
							<MDTypography
								variant="h4"
								fontWeight="medium"
								color="dark"
								mt={1}
							>
								Generando codigo QR...
							</MDTypography>
						</MDBox>
					)
				)}
			</Card>
		</>
	);
}
