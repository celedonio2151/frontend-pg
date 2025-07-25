import type { Components, Theme } from "@mui/material";

const MuiTextField: Components<Theme>['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
    size: 'small',
  },
  styleOverrides: {
    root: ({ theme }) => ({ //Recibimos el tema
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.divider, // Color del borde normal
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main, // Color del borde al hacer hover
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.dark,  // Color del borde al estar enfocado
        },
      },
    }),
  },
};

export default MuiTextField;
