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
import { useContext, useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";

// @mui icons
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
// Custom Hooks
import useFetch from "hooks/useFetch";
import { useAuthContext } from "context/AuthContext";
import type { User } from "pages/users/interfaces/user.interface";
import EditUserForm from "pages/users/components/EditUserForm";
import ErrorLoader from "components/loader/ErrorLoader";
import type { Roles } from "pages/roles/interfaces/role.interface";

export default function EditUserPage() {
	const { userId } = useParams();
	const { token } = useAuthContext();

	const {
		data: user,
		loading,
		error,
	} = useFetch<User>({
		endpoint: `/user/${userId}`,
		eventTrigger: null,
		token,
	});
	const {
		data: roles,
		loading: rolesLoading,
		error: rolesError,
	} = useFetch<Roles>({ endpoint: `/role`, token });

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
				mt={{ xs: -20, lg: -18 }}
				px={1}
				width="calc(100% - 2rem)"
				mx="auto"
			>
				<Grid container spacing={1} justifyContent="center">
					<Grid item sm={6}>
						{loading && <ErrorLoader title="Cargando usuario" />}
						{error && <ErrorLoader title="Error al cargar el usuario" />}
						{user && roles && !loading && (
							<EditUserForm user={user} token={token!} roles={roles.roles} />
						)}

						{rolesLoading && <ErrorLoader title="Cargando roles" />}
						{rolesError && <ErrorLoader title="Error al cargar los roles" />}
					</Grid>
				</Grid>
			</MDBox>
		</>
	);
}
