import EmptyLoader from "components/loader/EmptyLoader";
import ErrorLoader from "components/loader/ErrorLoader";
import Splash from "components/loader/Splash";
import { useAuthContext } from "context/AuthContext";
import useFetch from "hooks/useFetch";
import EditRoleForm from "pages/roles/components/EditRoleForm";
import type { Role } from "pages/roles/interfaces/role.interface";
import { useParams } from "react-router-dom";

export default function EditRolePage() {
	const { roleId } = useParams();
	const { token } = useAuthContext();

	const { data, loading, error } = useFetch<Role>({
		endpoint: `/role/${roleId}`,
		eventTrigger: null,
		token,
	});

	if (loading) return <Splash title="Cargando rol..." />;
	if (error) return <ErrorLoader title="Error al cargar el rol" />;
	if (!data) return <EmptyLoader title="No se encontró el rol" />;

	return (
		<>{roleId ? <EditRoleForm id={roleId} role={data} /> : "Rol Id invalido"}</>
	);
}
