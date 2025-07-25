import type { Components, Theme } from "@mui/material";

const MuiTab: Components<Theme>['MuiTab'] = {
  styleOverrides: {
    root: {
      textTransform: 'none', // Desactiva la capitalización automática
      fontWeight: 500,
      fontSize: '1rem',
      padding: '6px 16px',
      '&.Mui-selected': {
        color: '#9c27b0',   // Usa tu color primario cuando esté seleccionada
      },
    },
  },
};

export default MuiTab;
