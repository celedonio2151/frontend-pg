import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardMedia, Box } from "@mui/material";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { useSnackbar } from "notistack";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import LoadingItem from "components/loader/LoadingItem";
import ErrorLoader from "components/loader/ErrorLoader";
import { formateDate } from "helpers/formatDate";
import usePost from "hooks/usePost";
import type { QRInvoice } from "pages/readings/interfaces/invoice/invoice.interface";

type Props = {
	readingId: string;
	token: string;
	setPayQR: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PayQR({ readingId, token, setPayQR }: Props) {
	const [dataBNB, setDataBNB] = useState<QRInvoice | null>(null);
	const { enqueueSnackbar } = useSnackbar();
	const { post, loading, error } = usePost<QRInvoice>();

	useEffect(() => {
		let mounted = true;

		const fetchQR = async () => {
			try {
				const res = await post(`/invoice/qr/${readingId}`, {}, token);
				if (mounted && res) {
					setDataBNB(res);
					enqueueSnackbar("QR BNB cargado correctamente", {
						variant: "success",
					});
				}
			} catch (err: any) {
				console.log(error?.message);
				if (mounted) {
					enqueueSnackbar("Error al cargar el QR: " + err.message, {
						variant: "error",
					});
				}
			}
		};

		fetchQR();

		return () => {
			mounted = false;
		};
	}, [readingId, token]);

	const handleCancelQR = () => {
		setPayQR(false);
		// Opcional: peticion al backend para cancelar QR generado
	};

	return (
		<Card sx={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
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
			>
				<MDTypography
					variant="h4"
					fontWeight="medium"
					color="white"
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<QrCode2RoundedIcon /> &nbsp;Código QR BNB
				</MDTypography>
			</MDBox>

			{loading && !dataBNB && <LoadingItem title="Generando código QR..." />}

			{dataBNB && (
				<>
					<CardHeader
						sx={{ color: "#26b460", textAlign: "center", p: 1 }}
						title={
							<span>
								<span style={{ color: "#694780" }}>¡Apunta, </span>
								escanea y paga!
							</span>
						}
					/>
					<CardMedia
						component="img"
						image={`data:image/png;base64,${dataBNB.bankBNB.qr}`}
						alt="QR BNB"
						sx={{
							backgroundColor: "#26b460",
							p: 0,
							m: 1,
							border: "1px solid #694780",
						}}
					/>
					<CardContent>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<MDTypography variant="body2">
								<strong>Monto:</strong> {dataBNB.aditional.amount}
								{dataBNB.aditional.currency === "BOB"
									? "Bs."
									: dataBNB.aditional.currency}
							</MDTypography>
							<MDTypography variant="body2">
								<strong>Uso único:</strong>{" "}
								{dataBNB.aditional.singleUse ? "Sí" : "No"}
							</MDTypography>
						</Box>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<MDTypography variant="body2">
								<strong>Expira:</strong>
							</MDTypography>
							<MDTypography variant="body2">
								{formateDate(
									dataBNB.aditional.expirationDate,
									"ddd DD MMMM YYYY HH:mm:ss"
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
			)}

			{error && (
				<ErrorLoader
					title="Error al cargar QR. Intenta de nuevo más tarde."
					description={error.message}
				/>
			)}
		</Card>
	);
}
