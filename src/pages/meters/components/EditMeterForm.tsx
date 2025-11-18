import {
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  FormControlLabel,
  Grid,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

// MUI ICONS
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import MDBox from "components/MDBox";
import type {
  MeterForm,
  WaterMeter,
} from "pages/meters/interfaces/meter.interface";
import MDTypography from "components/MDTypography";
import usePatch from "hooks/usePatch";
import { useSnackbar } from "notistack";
import MDButton from "components/MDButton";
import type { User } from "pages/users/interfaces/user.interface";
type Props = {
  meter: WaterMeter;
  users: User[];
  token: string;
};

export default function EditMeterForm({ meter, users, token }: Props) {
  const { patch, loading, error } = usePatch();
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<MeterForm>({
    defaultValues: {
      user_id: meter.user._id,
      status: meter.status,
    },
  });

  const onSubmit = async (data: MeterForm) => {
    console.log("Enviando al servidor ", data);
    try {
      const response = await patch(`/meter/${meter._id}`, data, token);
      if (response) {
        enqueueSnackbar({
          variant: "success",
          message: "Actualizado correctamente",
        });
      }
    } catch (err) {
      if (error) {
        console.log(error);
        enqueueSnackbar({ variant: "error", message: "Ocurrio un error" });
      }
    }
  };

  return (
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
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Editando Medidor de agua
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={2} px={2}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} role="form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.user_id}
              >
                <InputLabel id="demo-simple-select-label">Usuario</InputLabel>
                <Select
                  sx={{ p: 1.5 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={users
                    .map((u) => u._id)
                    .find((id) => id === meter.user._id)}
                  {...register("user_id", {
                    required: "El usuario es obligatorio",
                  })}
                  label="Usuario"
                >
                  {users.map((u) => (
                    <MenuItem key={u._id} value={u._id} sx={{ mb: 0.5 }}>
                      {u.name} {u.surname} - {u.ci}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>{errors.user_id?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-phone-number">
                  N° Medidor
                </InputLabel>
                <OutlinedInput
                  id="outlined-email-number"
                  disabled
                  value={meter.meter_number}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle email" edge="end">
                        <SpeedRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="N° Medidor"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={!!field.value}
                        color="primary"
                      />
                    }
                    label={field.value ? "Activo" : "Inactivo"}
                  />
                )}
              />
            </Grid>
          </Grid>
          <MDBox mt={3} textAlign="center">
            <MDButton
              type="submit"
              fullWidth
              color="primary"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Guardando..." : "Editar Medidor"}
            </MDButton>
          </MDBox>
        </Box>
      </MDBox>
    </Card>
  );
}
