import { Stack, Typography } from '@mui/material';
export default function UnauthorizedPage() {
  return (
    <Stack direction="column" alignItems="center" justifyContent="center">
      <Typography mt={3} variant="h1" color="text.disabled">
        403 - Acceso denegado
      </Typography>
      <Typography variant="h6">No tiene permisos para acceder a esta pagina!</Typography>
    </Stack>
  );
}
