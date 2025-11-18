import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import ErrorLoader from "components/loader/ErrorLoader";
import MDBox from "components/MDBox";
import { useAuthContext } from "context/AuthContext";
import useFetch from "hooks/useFetch";
import type { WaterMeter } from "pages/meters/interfaces/meter.interface";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import EditMeterForm from "pages/meters/components/EditMeterForm";
import EmptyLoader from "components/loader/EmptyLoader";
import type { Users } from "pages/users/interfaces/user.interface";

export default function EditMeterPage() {
  const { meterId } = useParams();
  const { token } = useAuthContext();
  const {
    data: waterMeter,
    loading,
    error,
  } = useFetch<WaterMeter>({ endpoint: `/meter/id/${meterId}`, token });
  const {
    data: users,
    loading: loadingUsers,
    error: errorUsers,
  } = useFetch<Users>({ endpoint: `/user`, token });

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
            {waterMeter && users && !loading && (
              <EditMeterForm
                meter={waterMeter}
                users={users.users}
                token={token!}
              />
            )}

            {loading && <EmptyLoader title="Cargando medidor..." />}
            {loadingUsers && <EmptyLoader title="Cargando usuarios..." />}
            
            {error && <ErrorLoader title="Error al cargar el medidor" />}
            {errorUsers && <ErrorLoader title="Error al cargar usuarios" />}
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}
