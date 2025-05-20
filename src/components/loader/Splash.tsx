import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

interface SplashProps {
  // variant?: TypographyProps['variant'];
  // color?: TypographyProps['color'];
  title?: string;
}

const Splash = ({ title }: SplashProps) => {
  return (
    <Stack alignItems="center" justifyContent="center" width={1} height={'100vh'}>
      <CircularProgress />
      {title && (
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      )}
    </Stack>
  );
};

export default Splash;
