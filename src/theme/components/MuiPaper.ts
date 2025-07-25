import type { Components, Theme } from "@mui/material";

const MuiPaper: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: {
      borderRadius: 12,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
  },
};

export default MuiPaper;
