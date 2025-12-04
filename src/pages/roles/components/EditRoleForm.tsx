import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
	Card,
	FormControl,
	FormControlLabel,
	Grid,
	Switch,
	TextField,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

// Types
import type { Role, RoleForm } from "pages/roles/interfaces/role.interface";

// Image
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useAuthContext } from "context/AuthContext";
import paths from "routes/paths";
import usePatch from "hooks/usePatch";

type Props = {
	id: string;
	role?: Role;
};

export default function EditRoleForm({ id, role }: Props) {
	const navigate = useNavigate();
	const { token } = useAuthContext();
	const { patch, loading, error } = usePatch<Role>();
	const { enqueueSnackbar } = useSnackbar();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<RoleForm>({
		defaultValues: {
			name: role?.name,
			description: role?.description,
			status: role?.status,
		},
	});

	const onSubmit = async (data: RoleForm) => {
		try {
			const role = await patch(`/role/${id}`, data, token);
			if (role) {
				console.log("Rol editado:", role);
				enqueueSnackbar("Rol editado correctamente", {
					variant: "success",
					autoHideDuration: 3000,
				});
				navigate(paths.roles);
			}
		} catch (err: any) {
			// enqueueSnackbar("Error al editar rol", { variant: "error" });
			enqueueSnackbar(error?.response?.data.message || "Error al editar rol", {
				variant: "error",
			});
			console.error("Error al registrar rol:", error);
		}
		// Simular petición al servidor
		// await new Promise((resolve) => setTimeout(resolve, 2000));
		// console.log("Petición enviada al servidor:", data);
	};

	console.log({ patch, loading, error });
	return (
		<>
			<MDBox
				width="calc(100% - 2rem)"
				minHeight="35vh"
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
						<Card sx={{ marginBottom: 3 }}>
							<MDBox
								variant="gradient"
								bgColor="primary"
								borderRadius="lg"
								coloredShadow="success"
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
									Editar rol {role?.name}
								</MDTypography>
							</MDBox>

							<MDBox pt={2} pb={3} px={3}>
								<MDBox
									component="form"
									onSubmit={handleSubmit(onSubmit)}
									role="form"
								>
									<MDBox mb={2}>
										<FormControl fullWidth>
											<TextField
												fullWidth
												label="Nombre del rol"
												{...register("name", {
													required: "El nombre es obligatorio",
													minLength: {
														value: 3,
														message: "Debe tener al menos 3 caracteres",
													},
													maxLength: {
														value: 50,
														message: "No puede tener más de 50 caracteres",
													},
												})}
												error={!!errors.name}
												helperText={errors.name?.message}
											/>
										</FormControl>
									</MDBox>

									<MDBox mb={2}>
										<FormControl fullWidth>
											<TextField
												fullWidth
												label="Descripción"
												multiline
												rows={2.1}
												{...register("description", {
													required: "La descripción es obligatoria",
													minLength: {
														value: 2,
														message: "Debe tener al menos 2 caracteres",
													},
													maxLength: {
														value: 255,
														message: "No puede tener más de 255 caracteres",
													},
												})}
												error={!!errors.description}
												helperText={errors.description?.message}
											/>
										</FormControl>
									</MDBox>

									<FormControlLabel
										control={
											<Switch
												{...register("status")}
												color="primary"
												checked={watch("status")}
											/>
										}
										label={
											watch("status") ? "Estado activo" : "Estado inactivo"
										}
									/>

									<MDBox mt={2}>
										<MDButton
											variant="gradient"
											color="primary"
											type="submit"
											disabled={isSubmitting}
											size="large"
											fullWidth
										>
											{isSubmitting ? "Guardando..." : "Guardar cambios"}
										</MDButton>
									</MDBox>
								</MDBox>
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</>
	);
}
