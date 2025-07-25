import type { Components, Theme } from "@mui/material";

const MuiSelect: Components<Theme>['MuiSelect'] = {
  defaultProps: {
    variant: 'outlined',
    size: 'small',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.divider,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.dark,
        },
      },
    }),
  },
};

export default MuiSelect;
