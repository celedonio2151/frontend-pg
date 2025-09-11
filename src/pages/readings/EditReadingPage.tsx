import { useState, type SyntheticEvent } from "react";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import { useParams } from "react-router-dom";
import useFetch from "hooks/useFetch";

// MUI Icons
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useAuthContext } from "context/AuthContext";
import type {
	Invoice,
	Reading,
} from "pages/readings/interfaces/meterReading.interface";
import ErrorLoader from "components/loader/ErrorLoader";
import EmptyLoader from "components/loader/EmptyLoader";
import EditReadingForm from "pages/readings/components/EditReadingForm";
import MDButton from "components/MDButton";
import PayHere from "pages/readings/components/PayHere";
import MeterInfoCard from "pages/readings/components/MeterInfoCard";
import PayQR from "pages/readings/components/PayQR";
import PayManyInvoices from "pages/readings/components/PayManyInvoices";

export default function EditReadingPage() {
	const { token } = useAuthContext();
	const { readingId } = useParams();
	const [payHere, setPayHere] = useState(false); // Show or hide the Pay Here
	const [payQR, setPayQR] = useState(false); // Show or hide the Pay with QR Code
	const [eventTrigger, setEventTrigger] = useState(new Date());
	const [value, setValue] = useState("one");

	const handleChange = (event: SyntheticEvent, newValue: string) => {
		console.log("🚀 ~ handleChange ~ event:", event);
		setValue(newValue);
	};
	const {
		data: reading,
		loading,
		error,
	} = useFetch<Reading>({ endpoint: `/reading/id/${readingId}`, token }); // Req reading
	const {
		data: invoice,
		loading: loadingInvoice,
		error: errorInvoice,
	} = useFetch<Invoice>({
		endpoint: `/invoice/reading-id/${readingId}`,
		token,
	});

	// console.log(invoice, loadingInvoice, errorInvoice);

	return (
		<>
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
				mt={{ xs: -43, lg: -30 }}
				px={1}
				width="calc(100% - 2rem)"
				mx="auto"
			>
				<Grid
					container
					spacing={0}
					flexDirection={"column"}
					justifyContent="center"
				>
					<Grid item>
						{loading && <EmptyLoader title="Cargando lectura..." />}
						{error && <ErrorLoader title="Error al cargar el usuario" />}
						{/* {reading && !loading && !invoice && (
							<EditReadingForm reading={reading} token={token!} />
						)} */}
					</Grid>
					{/* ============	RENDERIZAR SOLO SI EISTE LA LECTURA Y LA FACTURA */}
					{reading && !loading && (
						<Grid
							item
							container
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							textAlign={"center"}
						>
							<Grid
								item
								width="100%"
								maxWidth="800px"
								xs={12}
								sm={12}
								md={12}
								lg={6}
								xl={6}
							>
								<Tabs
									sx={{ backgroundColor: "", width: "100%" }}
									orientation={"horizontal"}
									value={value}
									onChange={handleChange}
									textColor="secondary"
									indicatorColor="secondary"
									aria-label="secondary tabs example"
									centered
								>
									<Tab
										sx={{ py: 2 }}
										value="one"
										label="Editar Lectura"
										icon={<SpeedRoundedIcon fontSize="medium" />}
										iconPosition="start"
										id="tab-one" // ID para accesibilidad
										aria-controls="tabpanel-one" // Controla qué panel se muestra
									/>
									<Tab
										sx={{ py: 2 }}
										value="two"
										label="Pagar Aqui"
										icon={<PaidRoundedIcon fontSize="medium" />}
										iconPosition="start"
										id="tab-two"
										aria-controls="tabpanel-two"
									/>
									<Tab
										sx={{ py: 2 }}
										value="three"
										label="Pagar con QR"
										icon={<QrCode2RoundedIcon fontSize="medium" />}
										iconPosition="start"
										id="tab-three"
										aria-controls="tabpanel-three"
									/>
								</Tabs>
							</Grid>
							{/* ===========================		CONTENIDO DEL LOS TABS	============================== */}
							<Grid
								item
								width="100%"
								maxWidth="800px"
								xs={12}
								sm={12}
								md={12}
								lg={6}
								xl={6}
							>
								<TabPanel value={value} index="one">
									{!invoice && !loadingInvoice ? (
										<Box mt={3}>
											<EditReadingForm reading={reading} token={token!} />
										</Box>
									) : (
										<ErrorLoader
											title="El recibo ya fue generado"
											description="No se puede editar un recibo ya generado. Pongase el contacto con el de sistemas"
										/>
									)}
								</TabPanel>

								{/* CONTENT PAY HERE */}
								<TabPanel value={value} index="two">
									<MeterInfoCard
										title="Informacion del medidor"
										meter={reading?.waterMeter}
										reading={reading!}
										method="cash"
									/>
									{invoice && !invoice.isPaid && !loadingInvoice && (
										<PayHere
											setPayHere={setPayHere}
											readingId={readingId!}
											token={token!}
											setEventTrigger={setEventTrigger}
										/>
									)}

									{!invoice && !loadingInvoice && (
										<EmptyLoader title="No hay recibo aun para pagar" />
									)}

									{invoice && !loadingInvoice && invoice.isPaid && (
										<MDButton
											variant="gradient"
											color="info"
											startIcon={<ReceiptRoundedIcon />}
											fullWidth
											size="large"
											onClick={() => handlePrintInvoice(readingId!, token!)}
										>
											Imprimir Recibo
										</MDButton>
									)}
								</TabPanel>

								{/* CONTENT PAY WITH QR */}
								<TabPanel value={value} index="three">
									<MeterInfoCard
										title="Informacion del medidor"
										meter={reading?.waterMeter}
										reading={reading}
										method="qr"
									/>
									{invoice && !invoice.isPaid && !loadingInvoice && (
										<PayQR
											readingId={readingId!}
											token={token!}
											setPayQR={setPayQR}
										/>
									)}

									{!invoice && !loadingInvoice && (
										<EmptyLoader title="No hay recibo aun para pagar" />
									)}

									{invoice && !loadingInvoice && invoice.isPaid && (
										<MDButton
											variant="gradient"
											color="info"
											startIcon={<ReceiptRoundedIcon />}
											fullWidth
											size="large"
											onClick={() => handlePrintInvoice(readingId!, token!)}
										>
											Imprimir Recibo
										</MDButton>
									)}
								</TabPanel>
							</Grid>
						</Grid>
					)}
					{reading && !loading && invoice && !loadingInvoice && (
						<PayManyInvoices waterMeter={reading?.waterMeter} />
					)}
				</Grid>
			</MDBox>
		</>
	);
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: string;
	value: string;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			sx={{ pt: 2 }}
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <>{children}</>}
		</Box>
	);
}

const handlePrintInvoice = async (readingId: string, token: string) => {
	const apiUrl = `${import.meta.env.VITE_SERVER}/invoice/pdf/${readingId}`;
	const headers = { Authorization: `Bearer ${token}` };
	try {
		const response = await fetch(apiUrl, { headers });
		if (response.status === 200) {
			const blob = await response.blob();
			const pdfURL = URL.createObjectURL(blob);
			window.open(pdfURL, "_blank", "noopener,noreferrer");
		} else {
			console.error(
				"Error al obtener el PDF. Estado de respuesta:",
				response.status
			);
		}
	} catch (error) {
		console.error("Error al obtener el PDF:", error);
	}
};
