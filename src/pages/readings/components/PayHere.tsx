import { useState, type Dispatch, type SetStateAction } from "react";

import { Card, CardMedia } from "@mui/material";

// Images
import payhere from "assets/gifs/giphy.webp";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import usePatch from "hooks/usePatch";
import useFetch from "hooks/useFetch";
import { useSnackbar } from "notistack";
import type { Invoice } from "pages/readings/interfaces/meterReading.interface";

type Props = {
	token: string;
	readingId: string;
	setPayHere: Dispatch<SetStateAction<boolean>>;
	setEventTrigger: Dispatch<SetStateAction<Date>>;
};

export default function PayHere({
	setPayHere,
	readingId,
	token,
	setEventTrigger,
}: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const {
		data: invoice,
		loading: loadingInvoice,
		error: errorInvoice,
	} = useFetch<Invoice>({
		endpoint: `/invoice/reading-id/${readingId}`,
		token,
	});
	const { patch, loading, error } = usePatch();

	const payNowHere = async () => {
		try {
			const response = await patch(
				`/invoice/${invoice?._id}`,
				{ isPaid: true },
				token
			);
			if (response) {
				console.log("Respuesta: ", response);
				enqueueSnackbar("Pagado correctamente", { variant: "success" });
			}
		} catch (err) {
			if (error) {
				enqueueSnackbar("Ocurrio un error " + error, { variant: "error" });
			}
		}
	};
	return (
		<Card sx={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
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
				<MDBox sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
					<MDButton
						color="error"
						sx={{ width: 120 }}
						onClick={() => setPayHere(false)}
					>
						Cancelar
					</MDButton>
					<MDButton
						color="success"
						disable={loading}
						sx={{ width: 120 }}
						onClick={payNowHere}
					>
						Aceptar
					</MDButton>
				</MDBox>
			</MDBox>
		</Card>
	);
}
