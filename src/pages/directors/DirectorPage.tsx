import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import useFetch from "hooks/useFetch";
import MDTypography from "components/MDTypography";
import handlerErrors from "helpers/handlerErrors";
import FormDirector from "pages/directors/components/FormDirector";
import { formateDate } from "helpers/formatDate";
import { useAuthContext } from "context/AuthContext";
import type { Directors } from "pages/directors/interfaces/director.interface";
import LoadingItem from "components/loader/LoadingItem";

export default function DirectorPage() {
	const { token } = useAuthContext();
	const { data, loading, error } = useFetch<Directors>({
		endpoint: `/board-directors?status=true`,
		eventTrigger: null,
		token,
	});

	return (
		<>
			<MDBox py={3}>
				{/* Grid para mostrar los primeros elementos */}
				<Typography variant="h3" textAlign="center" py={2}>
					Mesa directiva {formateDate(new Date(), "YYYY")}{" "}
				</Typography>
				{data && !loading && (
					<Grid container sx={{ justifyContent: "center" }} spacing={3}>
						{data.directors.slice(0, 1).map((item, index) => (
							<Grid key={item._id} item xs={12} md={6} lg={4}>
								<Card>
									<CardContent
										sx={{ display: "flex", justifyContent: "center" }}
									>
										<MDAvatar
											src={item.user.profileImg}
											sx={{ width: 180, height: 180 }}
											shadow="lg"
										/>
									</CardContent>
									<CardContent>
										<Typography variant="h6" align="center">
											{item.positionRole}
										</Typography>
										<Typography
											variant="body1"
											align="center"
											color="text.secondary"
										>
											{`${item.user.name} ${item.user.surname}`}
										</Typography>
										<Typography
											variant="caption"
											align="center"
											display="block"
											mt={1}
										>
											{`Periodo: ${new Date(
												item.startDate
											).toLocaleDateString()} - ${new Date(
												item.endDate
											).toLocaleDateString()}`}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}

				{/* Grid para el resto de los elementos */}
				{data?.directors && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						{data.directors.slice(1).map((item, index) => (
							<Grid key={item._id} item xs={12} md={4} lg={4}>
								<Card>
									<CardContent
										sx={{ display: "flex", justifyContent: "center" }}
									>
										<MDAvatar
											src={item.user.profileImg}
											sx={{ width: 150, height: 150 }}
											shadow="md"
										/>
									</CardContent>
									<CardContent>
										<Typography variant="h6" align="center">
											{item.positionRole}
										</Typography>
										<Typography
											variant="body1"
											align="center"
											color="text.secondary"
										>
											{`${item.user.name} ${item.user.surname}`}
										</Typography>
										<Typography
											variant="caption"
											align="center"
											display="block"
											mt={1}
										>
											{`Periodo: ${new Date(
												item.startDate
											).toLocaleDateString()} - ${new Date(
												item.endDate
											).toLocaleDateString()}`}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}
				{loading && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						<Grid item xs={12} md={4} lg={4}>
							<LoadingItem title="Cargando mesa directiva ..." />
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
					<Grid item xs={12} md={6} lg={4}>
						<FormDirector />
					</Grid>
				</Grid>
			</MDBox>
		</>
	);
}
