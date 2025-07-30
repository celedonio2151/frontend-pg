import { Card, CardContent, Grid, Typography } from "@mui/material";
import { formateDate } from "helpers/formatDate";
import useFetch from "hooks/useFetch";
import React from "react";

type Props = {
	token: string;
};
export default function DirectorsTable({ token }: Props) {
	const {
		data: boardDirectors,
		loading: loadingBoardDirectors,
		error: errorBoardDirectors,
	} = useFetch({ endpoint: "/board-directors", token });
	return (
		<div>
			{loadingBoardDirectors && <p>Cargando directores...</p>}
			{errorBoardDirectors && (
				<p>Error al cargar directores: {errorBoardDirectors.message}</p>
			)}
			{boardDirectors &&
				boardDirectors.map((director) => (
					<Card key={director._id}>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<MDAvatar
										src={director.user.profileImg}
										alt={`${director.user.name} ${director.user.surname}`}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="h6">{`${director.user.name} ${director.user.surname}`}</Typography>
									<Typography variant="body2">
										Cargo: {director.positionRole}
									</Typography>
									<Typography variant="body2">
										Fecha de inicio: {formateDate(director.startDate)}
									</Typography>
									<Typography variant="body2">
										Fecha de fin: {formateDate(director.endDate)}
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				))}
			{boardDirectors && boardDirectors.length === 0 && (
				<p>No hay directores registrados.</p>
			)}
		</div>
	);
}
