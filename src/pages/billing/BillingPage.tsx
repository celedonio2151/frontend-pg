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
import Grid from "@mui/material/Grid";
import { Box, Card, Chip, IconButton, Stack, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import useFetch from "hooks/useFetch";
import MDTypography from "components/MDTypography";
import handlerErrors from "helpers/handlerErrors";
import { formateDate } from "helpers/formatDate";
import BillingTable from "pages/billing/components/BillingTable";
import BillingForm from "pages/billing/components/BillingForm";
import { useAuthContext } from "context/AuthContext";
import type { Billings } from "pages/billing/interfaces/billing.inerface";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import EmptyLoader from "components/loader/EmptyLoader";

export default function BillingPage() {
	const { token } = useAuthContext();
	const [trigger, setTrigger] = useState(new Date());
	const { data, loading, error } = useFetch<Billings>({
		endpoint: `/billing`,
		eventTrigger: trigger,
		token,
	});

	return (
		<Box py={3}>
			<Card>
				<MDBox
					mx={2}
					mt={-3}
					py={3}
					px={2}
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="info"
				>
					<MDTypography variant="h5" textAlign="center" color="white">
						Tarifas por consumo de agua {formateDate(new Date(), "YYYY")}
					</MDTypography>
				</MDBox>
				{data && data.billings.length > 0 && (
					<BillingTable dataTable={data.billings} setTrigger={setTrigger} />
				)}
			</Card>
			{/* Grid para mostrar los primeros elementos */}

			{loading && <MDTableLoading title="Cargando tabla de tarifas ..." />}

			{data && data.billings.length <= 0 && !loading && (
				<Grid container sx={{ justifyContent: "center" }} spacing={3}>
					<Grid item xs={12} md={4} lg={4}>
						<EmptyLoader title="No hay tarifas disponibles" />
					</Grid>
				</Grid>
			)}
			{error && (
				<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
					<Grid item xs={12} md={6} lg={4}>
						<MDTypography variant="h4" align="center" mt={1}>
							{handlerErrors(error)}
						</MDTypography>
					</Grid>
				</Grid>
			)}
			<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
				<Grid item xs={12} md={4} lg={6}>
					<Card>
						<MDBox
							mx={2}
							mt={-3}
							py={3}
							px={2}
							variant="gradient"
							bgColor="info"
							borderRadius="lg"
							coloredShadow="info"
						>
							<MDTypography variant="h5" textAlign="center" color="white">
								Tarifario de consumo de agua
							</MDTypography>
						</MDBox>
						<BillingForm setTrigger={setTrigger} />
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
