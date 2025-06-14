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

import React, { useContext, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, Chip, IconButton, Stack, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import useFetch from "hooks/useFetch";
import MDTypography from "components/MDTypography";
import handlerErrors from "helpers/handlerErrors";
import { formateDate } from "helpers/formatDate";
import CustomTable from "examples/Table";
import BillingTable from "layouts/Billing/components/BillingTable";
import BillingForm from "layouts/Billing/components/BillingForm";
import { useAuthContext } from "context/AuthContext";
import type {
	Billing,
	Billings,
} from "layouts/Billing/interfaces/billing.inerface";
import type { ColumnDef } from "@tanstack/react-table";

export default function BillingPage() {
	const { token } = useAuthContext();
	const [trigger, setTrigger] = useState(null);
	const { data, loading, error } = useFetch<Billings>({
		endpoint: `/billing`,
		eventTrigger: trigger,
		token,
	});
	const columns = useMemo<ColumnDef<Billing, any>[]>(
		() => [
			{
				accessorKey: "rowNumber",
				header: "Nro",
				cell: (info) => info.row.index + 1,
			},
			{
				accessorKey: "min_cubic_meters",
				header: "Minimo",
			},
			{
				accessorKey: "max_cubic_meters",
				header: "Maximo",
			},
			{
				accessorKey: "base_rate",
				header: "Monto Base",
				cell: ({ getValue }) => (
					<Box sx={{ borderRadius: 3 }}>{getValue()} Bs</Box>
				),
			},
			{
				accessorFn: (row) => formateDate(row.createdAt, "DD-MM-YYYY"),
				header: "Registrado el ",
			},
			{
				id: "acciones",
				header: "Acciones",
				cell: ({ row }) => <Stack direction="row" spacing={1}></Stack>,
			},
		],
		[]
	);
	console.log("🚀 ~ BillingPage ~ billingData:", data);

	return (
		<>
			<MDBox py={3}>
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
					{data && !loading && (
						<BillingTable dataTable={data.billings} setTrigger={setTrigger} />
					)}
				</Card>
				{/* Grid para mostrar los primeros elementos */}

				{loading && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						<Grid item xs={12} md={4} lg={4}>
							<Typography variant="h4" align="center" mt={1}>
								Cargando tabla de cobros ...
							</Typography>
						</Grid>
					</Grid>
				)}
				{error && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						<Grid item xs={12} md={4} lg={4}>
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
			</MDBox>
		</>
	);
}
