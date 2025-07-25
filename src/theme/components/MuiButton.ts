import type { Components, Theme } from "@mui/material";

const MuiButton: Components<Theme>['MuiButton'] = {
  styleOverrides: {
    root: {
      borderRadius: 8,
      textTransform: 'none',
      padding: '8px 16px',
      fontWeight: 600,
    },
    containedPrimary: {
      color: '#fff',
      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
      '&:hover': {
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  defaultProps: {
    disableElevation: true, // Desactiva la elevación por defecto
  },
};

export default MuiButton;
