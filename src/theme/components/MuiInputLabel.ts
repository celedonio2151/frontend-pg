import type { Components, Theme } from "@mui/material";

const MuiInputLabel: Components<Theme>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.secondary,  // Color de la etiqueta normal
      '&.Mui-focused': {
        color: theme.palette.primary.main,  // Color al estar enfocado
      },
    }),
  },
};

export default MuiInputLabel;
