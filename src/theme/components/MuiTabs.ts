import type { Components, Theme } from "@mui/material";

const MuiTabs: Components<Theme>['MuiTabs'] = {
  styleOverrides: {
    root: {
      // Estilos generales para el contenedor de Tabs
      //  borderBottom: '1px solid rgba(0, 0, 0, 0.12)', // Ejemplo: Línea inferior
    },
    indicator: {
      // Estilos para la línea indicadora debajo de la Tab activa
      backgroundColor: '#f50057', // Usa tu color secundario
    },
  },
};

export default MuiTabs;
