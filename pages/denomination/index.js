import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function Denomination() {

  const [color2, setColor2] = React.useState('primary');
  const [color5, setColor5] = React.useState('primary');
  const [color10, setColor10] = React.useState('primary');
  const [colorOwn, setColorOwn] = React.useState('primary');

  const SetAmount2 = (index) => {
    setColor2('success');
    setColor5('primary');
    setColor10('primary');
    setColorOwn('success');
  };

  const SetAmount5 = (index) => {
    setColor2('primary');
    setColor5('success');
    setColor10('primary');
    setColorOwn('success');
  }

  const SetAmount10 = (index) => {
    setColor2('primary');
    setColor5('primary');
    setColor10('success');
    setColorOwn('success');
  }

  const ConfirmAmount = () => {
    GenerateAdminGameCode();

    location.href = 'connectwallet';
  };

  const OwnAmount = () => {

    

  };

  const GenerateAdminGameCode = () => {

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Game denomination
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={SetAmount2}
              color={color2}
            >
              2 $
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={SetAmount5}
              color={color5}
            >
              5 $
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={SetAmount10}
              color={color10}
            >
              10 $
            </Button>
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Own Amount"
              autoComplete="current-password"
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={ConfirmAmount}
            >
              Confirm Amount
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}