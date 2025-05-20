// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import React, { useEffect, useState } from "react";

// Images
import team2 from "assets/images/team-2.jpg";
import useFetch from "hooks/useFetch";

export default function Data() {
	const [users, loading, error, hancelRequest] = useFetch(``);
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch(`http://127.0.0.1:3050/api/v1/user`)
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				setData(data.docs);
			})
			.catch((err) => console.log(err));
	}, []);

	if (!data) {
		return <div>Cargando datos...</div>;
	}

	const columns = [
		{ Header: "Nombre", accessor: "name", width: "31%", align: "left" },
		{ Header: "Medidor", accessor: "meter_number", align: "left" },
		{ Header: "Roles", accessor: "roles", align: "center" },
		{ Header: "Estado", accessor: "status", align: "center" },
		{ Header: "Acción", accessor: "action", align: "center" },
	];

	const rows = data.map((user) => ({
		name: (
			<Author
				image={team2}
				name={`${user.name} ${user.surname}`}
				ci={`CI: ${user.ci}`}
			/>
		),
		meter_number: (
			<MDTypography variant="caption">{user.meter_number}</MDTypography>
		),
		roles: (
			<MDTypography variant="caption" color="text" fontWeight="medium">
				USER
			</MDTypography>
		),
		status: (
			<MDBox ml={-1}>
				<MDBadge
					badgeContent={user.status ? "online" : "offline"}
					color={user.status ? "success" : "error"}
					variant="gradient"
					size="sm"
				/>
			</MDBox>
		),
		action: (
			<>
				<MDTypography
					component="a"
					href="#"
					variant="caption"
					color="text"
					fontWeight="medium"
				>
					<MDButton variant="contained" color="info">
						Editar
					</MDButton>
				</MDTypography>
				<MDTypography
					component="a"
					href="#"
					variant="caption"
					color="text"
					fontWeight="medium"
				>
					<MDButton variant="contained" color="error">
						Eliminar
					</MDButton>
				</MDTypography>
			</>
		),
	}));

	return {
		columns: columns,
		rows: rows,
	};
}

const Author = ({ image, name, ci }) => (
	<MDBox display="flex" alignItems="center" lineHeight={1}>
		<MDAvatar src={image} name={name} size="sm" />
		<MDBox ml={2} lineHeight={1}>
			<MDTypography display="block" variant="button" fontWeight="medium">
				{name}
			</MDTypography>
			<MDTypography variant="caption">{ci}</MDTypography>
		</MDBox>
	</MDBox>
);

const Job = ({ title, description }) => (
	<MDBox lineHeight={1} textAlign="left">
		<MDTypography
			display="block"
			variant="caption"
			color="text"
			fontWeight="medium"
		>
			{title}
		</MDTypography>
		<MDTypography variant="caption">{description}</MDTypography>
	</MDBox>
);

const rows = [
	{
		name: <Author image={team2} name="John Michael" ci="CI: 7542118" />,
		meter_number: <Job title="Manager" description="Organization" />,
		roles: (
			<MDTypography
				component="a"
				href="#"
				variant="caption"
				color="text"
				fontWeight="medium"
			>
				USER
			</MDTypography>
		),
		status: (
			<MDBox ml={-1}>
				<MDBadge
					badgeContent="online"
					color="success"
					variant="gradient"
					size="sm"
				/>
			</MDBox>
		),
		action: (
			<MDTypography
				component="a"
				href="#"
				variant="caption"
				color="text"
				fontWeight="medium"
			>
				<MDButton variant="contained" color="info">
					Editar
				</MDButton>
			</MDTypography>
		),
	},
];
