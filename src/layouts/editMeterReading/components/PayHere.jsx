import React, { useEffect, useState } from "react";

import { Card, CardMedia } from "@mui/material";

// Images
import payhere from "assets/gifs/giphy.webp";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import usePatch from "hooks/usePatch";
import useFetch from "hooks/useFetch";
import MDAlert from "components/MDAlert";

export default function PayHere({
	setPayHere,
	readingId,
	token,
	setEventTrigger,
}) {
	const [successPay, setSuccessPay] = useState({
		status: false,
		message: null,
	});
	const [timeOut, setTimeoutCustom] = useState(null);
	const [errorPay, setErrorPay] = useState({ status: false, message: null });
	const [invoice, loading, error] = useFetch(
		`/invoice/reading-id/${readingId}`,
		null,
		token
	);

	const alertContent = (text, color) => (
		<MDAlert color={color}>
			<MDTypography variant="body2" color="white">
				<MDTypography
					component="a"
					href="#"
					variant="body2"
					fontWeight="medium"
					color="white"
				>
					{text}
				</MDTypography>
			</MDTypography>
		</MDAlert>
	);
	const payNowHere = () => {
		const patchRequest = usePatch(`/invoice/${invoice._id}`, token);
		patchRequest({ isPaid: true })
			.then((response) => {
				setSuccessPay({
					status: true,
					message: "Saldo cancelado correctamente",
				});
				const id = setTimeout(() => {
					setEventTrigger(new Date());
					console.log("first event triggered automatically");
				}, 2000);
				setTimeoutCustom(id);
			})
			.catch((err) => {
				setErrorPay({ status: true, message: err.message });
			})
			.finally(() => {
				clearTimeout(timeOut);
			});
	};
	return (
		<>
			{successPay.status && alertContent(successPay.message, "success")}
			{errorPay.status && alertContent(errorPay.message, "error")}
			<Card>
				<MDBox
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="secondary"
					sx={{ cursor: "pointer" }}
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
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row",
						}}
					>
						Pagar Aquí
					</MDTypography>
				</MDBox>
				<MDBox>
					<CardMedia>
						<img
							src={payhere}
							style={{ width: "100%" }}
							frameBorder="0"
							allowFullScreen
						></img>
					</CardMedia>
					<MDBox
						sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
					>
						<MDButton
							color="error"
							sx={{ width: 120 }}
							onClick={() => setPayHere(false)}
						>
							Cancelar
						</MDButton>
						<MDButton color="success" sx={{ width: 120 }} onClick={payNowHere}>
							Aceptar
						</MDButton>
					</MDBox>
				</MDBox>
			</Card>
		</>
	);
}
