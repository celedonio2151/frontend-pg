import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, Divider, Grid } from "@mui/material";

import dayjs from "dayjs";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import useFetch from "hooks/useFetch";
import ViewQRBank from "./components/ViewQRBank";

// MUI ICONS
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { DeleteOutline, DownloadDoneRounded } from "@mui/icons-material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";

import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import usePatch from "hooks/usePatch";
import useFetchEvent from "hooks/useFetchEvent";
import FormEdit from "./components/FormEdit";
import PdfPreview from "./components/PdfPreview";
import PayHere from "./components/PayHere";
import { formateDate } from "helpers/formatDate";
import useFetchPDF from "hooks/useFetchPDF";
import Header from "layouts/profile/components/Header";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import MeterInfoCard from "./components/MeterInfoCard";
import handlerErrors from "helpers/handlerErrors";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import { useAuthContext } from "context/AuthContext";

export default function EditMeterReading() {
	const { readingId } = useParams();
	const { token } = useAuthContext();
	const [dateTime, setDateTime] = useState(dayjs(new Date())); // Select date and time
	const [lastMonthValue, setLastMonthValue] = useState(0); // Ultima lectura
	const [description, setDescription] = useState(""); // Description
	const [disabledBalance, setDisabledBalance] = useState(true);
	const [balance, setBalance] = useState(0); // Balance to pay
	const [loadingForm, setLoadingForm] = useState(false); // Loading form
	const [responseSubmit, setResponseSubmit] = useState(null);
	const [errorSubmit, setErrorSubmit] = useState(null);
	const [eventTrigger, setEventTrigger] = useState(null);
	const [payHere, setPayHere] = useState(false); // Show or hide the Component Pay Here
	const [payQR, setPayQR] = useState(false); // Show or hide the Component Pay with QR Code
	const [data, loading, error] = useFetch(
		`/reading/id/${readingId}`,
		null,
		token
	); // Fetch the meter reading by id
	const [invoice, loadingInvoice, errorInvoice] = useFetch(
		`/invoice/reading-id/${readingId}`,
		eventTrigger,
		token
	); // Fetch the invoice by readingId

	// console.log("Lectura: ", data, loading, error);
	// console.log("Recibo: ", invoice, loadingInvoice, errorInvoice);
	useEffect(() => {
		if (data && !data?.error) {
			setLastMonthValue(data.lastMonth.meterValue);
			setBalance(data.balance);
			setDescription(data.description || "");
			setDateTime(dayjs(data.date));
		}
	}, [data]);

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
					sx={{ cursor: "pointer" }}
				>
					{response}
				</MDTypography>
			</MDTypography>
		</MDAlert>
	);

	// ==========	Envia para registrar la lectura
	function handleOnSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const body = {
			date: dateTime,
			lastMonthValue: lastMonthValue,
			balance,
			description: formData.get("description") || data?.description,
		};
		// console.log(body);
		setLoadingForm(true);
		const patchRequest = usePatch(`/reading/${readingId}`, token);
		patchRequest(body)
			.then((response) => {
				// console.log("Se registro la lecturas correctamente: ", response);
				setResponseSubmit("Se actualizo correctamente");
			})
			.catch((err) => {
				console.log(err);
				setErrorSubmit(err.message);
			})
			.finally(() => setLoadingForm(false));
	}
	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox pt={6} pb={3} maxWidth={1920} margin={"0 auto"}>
				<Grid
					container
					justifyContent="center"
					spacing={6}
					sx={{ bgcolor: "", paddingBottom: 4 }}
					columns={{ xs: 4, sm: 8, md: 12 }}
				>
					{/* Cargando información del usuario */}
					{!loading && !error && data && (
						<Grid item xs={12} md={8} xl={8}>
							<MDBox>
								{/* {invoice && invoice?.isPaid && (
										<MDTypography component="h3" variant="body">
											EL usuario ya cancelo su saldo del mes&nbsp;
											{formateDate(invoice.meterReading.date, "MMMM YYYY")}
										</MDTypography>
									)} */}
								<MeterInfoCard
									title="Información del propietario del medidor"
									description="Hola, soy la secretaria adminsitradora encargada de la gestión, cobros, lecturas y consumo de agua de la comunidad Mosoj Llajta - Municipio Yotala"
									info={{
										Nombre: `${data.waterMeter.fullname}  CI:${data.waterMeter.ci}`,
										Medidor: `${data.waterMeter.meterNumber}`,
										Mes: `${formateDate(data.date, "MMMM")}`,
										Anterior: `${data.beforeMonth.meterValue}`,
										Actual: `${data.lastMonth.meterValue}`,
										Cubos: `${data.lastMonth.meterValue}m³`,
										Saldo: `${data.balance}Bs.`,
									}}
									social={[]}
									action={{ route: "", tooltip: "Medidor de agua" }}
									shadow={false}
								/>
							</MDBox>
						</Grid>
					)}
					{loading && !data && (
						<Grid item p={2}>
							<MDTableLoading title="Cargando Información ..." />
						</Grid>
					)}
				</Grid>
				{/* Cargando formulario de edición si no esta pagado el recibo */}
				<Grid
					container
					justifyContent="center"
					spacing={6}
					sx={{
						bgcolor: "",
						paddingBottom: 4,
						// maxWidth: 1920,
						// margin: "0 auto",
						// alignContent: "center"
					}}
					columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
				>
					{invoice === null && (
						<>
							{!loading && !error && data && (
								<Grid item xs={12} sm={8} md={8} lg={8} xl={6}>
									<MDBox mx={2} mb={4}>
										{(responseSubmit || errorSubmit) &&
											alertContent(
												responseSubmit ? "success" : "error",
												responseSubmit
											)}
									</MDBox>
									<Card sx={{ marginBottom: 3, width: 1 }}>
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
											<MDTypography
												variant="h4"
												fontWeight="medium"
												color="white"
												mt={1}
											>
												Editando una lectura del medidor
											</MDTypography>
										</MDBox>
										<FormEdit
											data={data}
											dateTime={dateTime}
											setDateTime={setDateTime}
											lastMonthValue={lastMonthValue}
											setLastMonthValue={setLastMonthValue}
											description={description}
											setDescription={setDescription}
											disabledBalance={disabledBalance}
											setDisabledBalance={setDisabledBalance}
											balance={balance}
											setBalance={setBalance}
											loadingForm={loadingForm}
											setLoadingForm={setLoadingForm}
											responseSubmit={responseSubmit}
											setResponseSubmit={setResponseSubmit}
											errorSubmit={errorSubmit}
											setErrorSubmit={setErrorSubmit}
											handleOnSubmit={handleOnSubmit}
										/>
									</Card>
								</Grid>
							)}
						</>
					)}
					{loading && !data && (
						<Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
							<MDTableLoading title="Cargando formulario ..." />
						</Grid>
					)}
					{error && (
						<Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
							<MDTypography variant="h3">{handlerErrors(error)}</MDTypography>
						</Grid>
					)}
					{/* Si existe recibo y no esta pagado */}
					{!loadingInvoice && invoice && !invoice.isPaid && (
						<>
							{!payHere && !payQR && (
								<>
									<Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
										<MDButton
											color="info"
											sx={{ p: 5, width: 1, fontSize: 20 }}
											onClick={() => setPayHere(true)}
										>
											Pagar Aqui
										</MDButton>
									</Grid>
									<Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
										<MDButton
											color="success"
											sx={{ p: 5, width: 1, fontSize: 20 }}
											onClick={() => setPayQR(true)}
										>
											Pagar con QR
										</MDButton>
									</Grid>
								</>
							)}

							{payHere && (
								<Grid item xs={12} sm={6} md={6} lg={8} xl={4}>
									<PayHere
										setPayHere={setPayHere}
										readingId={readingId}
										token={token}
										setEventTrigger={setEventTrigger}
									/>
								</Grid>
							)}

							{payQR && (
								<Grid item xs={12} sm={6} md={6} lg={8} xl={4}>
									<ViewQRBank
										readingId={readingId}
										token={token}
										setPayQR={setPayQR}
									/>
								</Grid>
							)}
						</>
					)}
					{/* Si recibo esta pagado mostrar boton de imprimir*/}
					{invoice && invoice.isPaid && (
						<Grid
							item
							xs={12}
							sm={8}
							md={8}
							lg={8}
							xl={8}
							display={"flex"}
							justifyContent={"space-between"}
						>
							<MDButton
								color="primary"
								size="medium"
								onClick={() =>
									useFetchPDF(`/invoice/pdf/${readingId}`, token, "_blank")
								}
								endIcon={<DownloadRoundedIcon />}
							>
								Imprimir recibo
							</MDButton>
							<MDButton
								color="success"
								size="medium"
								onClick={() =>
									useFetchPDF(
										`/invoice/pdf-double/${readingId}`,
										token,
										"_blank"
									)
								}
								endIcon={<PictureAsPdfRoundedIcon />}
							>
								Imprimir doble
							</MDButton>
						</Grid>
					)}
					{loadingInvoice && (
						<Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
							<MDTableLoading title="Cargando recibo ..." />
						</Grid>
					)}
					{errorInvoice && (
						<Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
							<MDTypography variant="h3" textAlign={"center"}>
								{handlerErrors(errorInvoice)}
							</MDTypography>
						</Grid>
					)}

					{/* <PdfPreview dataPDF={invoice} /> */}
				</Grid>
			</MDBox>
			<Footer />
		</DashboardLayout>
	);
}
